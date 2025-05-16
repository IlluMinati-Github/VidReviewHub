import { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/config';

export const useStorage = () => {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [url, setUrl] = useState(null);

  const uploadFile = async (file, path) => {
    try {
      // Create a storage reference
      const storageRef = ref(storage, `${path}/${file.name}`);
      
      // Create file metadata including the content type
      const metadata = {
        contentType: file.type,
      };

      // Upload file and metadata
      const uploadTask = uploadBytesResumable(storageRef, file, metadata);

      // Listen for state changes, errors, and completion of the upload
      uploadTask.on('state_changed',
        (snapshot) => {
          // Get task progress
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
        },
        (error) => {
          // Handle errors
          setError(error);
        },
        async () => {
          // Upload completed successfully
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setUrl(downloadURL);
        }
      );

      return uploadTask;
    } catch (error) {
      setError(error);
      throw error;
    }
  };

  const uploadVideo = async (file, userId) => {
    return uploadFile(file, `videos/${userId}`);
  };

  const uploadThumbnail = async (file, userId) => {
    return uploadFile(file, `thumbnails/${userId}`);
  };

  return {
    progress,
    error,
    url,
    uploadVideo,
    uploadThumbnail
  };
}; 