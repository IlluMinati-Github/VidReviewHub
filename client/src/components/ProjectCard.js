import React, { useState, useEffect } from 'react';
import { useProjectUpdates } from '../hooks/useProjectUpdates';
import { toast } from 'react-toastify';
import './ProjectCard.css';

const ProjectCard = ({ project: initialProject, onUpdate, onStatusChange }) => {
  const { project, loading, error } = useProjectUpdates(initialProject.id);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProject, setEditedProject] = useState(initialProject);

  useEffect(() => {
    if (project) {
      setEditedProject(project);
      
      // Show notification for status changes
      if (project.status !== initialProject.status) {
        const statusMessages = {
          approved: 'Your video has been approved! 🎉',
          changes_requested: 'Changes have been requested for your video.',
          in_review: 'Your video is now under review.'
        };
        
        if (statusMessages[project.status]) {
          toast.info(statusMessages[project.status], {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      }
    }
  }, [project, initialProject.status]);

  if (loading) {
    return <div className="project-card loading">Loading...</div>;
  }

  if (error) {
    return <div className="project-card error">Error: {error.message}</div>;
  }

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProject(project);
  };

  const handleSave = async () => {
    try {
      await onUpdate(editedProject);
      setIsEditing(false);
      toast.success('Project updated successfully!');
    } catch (error) {
      toast.error('Failed to update project');
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await onStatusChange(project.id, newStatus);
      toast.success(`Project status updated to ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update project status');
    }
  };

  return (
    <div className="project-card">
      <div className="preview-section">
        <div className="video-preview">
          <video src={project.videoUrl} controls />
        </div>
        <div className="thumbnail-preview">
          <img src={project.thumbnailUrl} alt="Thumbnail" />
        </div>
      </div>

      <div className="content-section">
        {isEditing ? (
          <div className="edit-form">
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={editedProject.title}
                onChange={(e) => setEditedProject({ ...editedProject, title: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={editedProject.description}
                onChange={(e) => setEditedProject({ ...editedProject, description: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Tags</label>
              <input
                type="text"
                value={editedProject.tags?.join(', ')}
                onChange={(e) => setEditedProject({ ...editedProject, tags: e.target.value.split(',').map(tag => tag.trim()) })}
                placeholder="Enter tags separated by commas"
              />
            </div>
            <div className="edit-actions">
              <button className="save-btn" onClick={handleSave}>Save</button>
              <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
            </div>
          </div>
        ) : (
          <div className="project-info">
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <div className="tags">
              {project.tags?.map((tag, index) => (
                <span key={index} className="tag">{tag}</span>
              ))}
            </div>
            <div className="status-section">
              <span className={`status ${project.status}`}>{project.status}</span>
              <button className="edit-btn" onClick={handleEdit}>Edit</button>
            </div>
          </div>
        )}
      </div>

      {project.status === 'in_review' && (
        <div className="action-buttons">
          <button 
            className="approve-btn"
            onClick={() => handleStatusChange('approved')}
          >
            Approve
          </button>
          <button 
            className="request-changes-btn"
            onClick={() => handleStatusChange('changes_requested')}
          >
            Request Changes
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectCard; 