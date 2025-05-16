import React, { useState } from 'react';
import axios from 'axios';
import './FileUpload.css';

const FileUpload = ({ onUploadComplete }) => {
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
      setError(null);
    } else {
      setError('Please select a valid video file');
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setThumbnailFile(file);
      setError(null);
    } else {
      setError('Please select a valid image file');
    }
  };

  const handleUpload = async () => {
    if (!videoFile && !thumbnailFile) {
      setError('Please select at least one file to upload');
      return;
    }

    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      if (videoFile) formData.append('video', videoFile);
      if (thumbnailFile) formData.append('thumbnail', thumbnailFile);

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(progress);
          },
        }
      );

      onUploadComplete(response.data);
      setVideoFile(null);
      setThumbnailFile(null);
      setUploadProgress(0);
    } catch (err) {
      setError(err.response?.data?.error || 'Error uploading files');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="file-upload">
      <h2>Upload Files</h2>
      
      <div className="form-group">
        <label htmlFor="video">Video File:</label>
        <input
          type="file"
          id="video"
          accept="video/*"
          onChange={handleVideoChange}
          disabled={isUploading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="thumbnail">Thumbnail Image:</label>
        <input
          type="file"
          id="thumbnail"
          accept="image/*"
          onChange={handleThumbnailChange}
          disabled={isUploading}
        />
      </div>

      {error && <div className="error">{error}</div>}

      {uploadProgress > 0 && (
        <div className="progress-bar">
          <div
            className="progress"
            style={{ width: `${uploadProgress}%` }}
          ></div>
          <span>{uploadProgress}%</span>
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={isUploading || (!videoFile && !thumbnailFile)}
      >
        {isUploading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
};

export default FileUpload; 