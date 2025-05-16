const express = require('express');
const router = express.Router();
const { verifyToken, checkProjectAccess, checkProjectEditAccess, checkProjectReviewAccess } = require('../middleware/auth');
const Project = require('../models/Project');
const User = require('../models/User');

// Create a new project
router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, description, videoUrl, thumbnailUrl, metadata, tags } = req.body;
    
    // Create new project
    const project = new Project({
      title,
      description,
      videoUrl,
      thumbnailUrl,
      metadata,
      tags,
      youtuberId: req.user.uid,
      editorId: req.body.editorId,
      status: 'draft'
    });

    await project.save();

    // Add project reference to both youtuber and editor
    await User.findOneAndUpdate(
      { uid: req.user.uid },
      { $push: { projects: project._id } }
    );
    
    if (req.body.editorId) {
      await User.findOneAndUpdate(
        { uid: req.body.editorId },
        { $push: { projects: project._id } }
      );
    }

    res.status(201).json(project);
  } catch (error) {
    console.error('Create Project Error:', error);
    res.status(500).json({ error: 'Error creating project' });
  }
});

// Get project details
router.get('/:id', verifyToken, checkProjectAccess, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('youtuberId', 'name email profilePicture')
      .populate('editorId', 'name email profilePicture');
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error('Get Project Error:', error);
    res.status(500).json({ error: 'Error fetching project' });
  }
});

// Update project metadata/status
router.put('/:id', verifyToken, checkProjectAccess, async (req, res) => {
  try {
    const { title, description, tags, status } = req.body;
    const project = req.project;

    // Check if user has permission to update status
    if (status && req.user.uid === project.youtuberId) {
      if (!['approved', 'changes_requested'].includes(status)) {
        return res.status(403).json({ error: 'Invalid status update' });
      }
    } else if (status && req.user.uid === project.editorId) {
      if (status !== 'in_review') {
        return res.status(403).json({ error: 'Invalid status update' });
      }
    }

    // Update fields
    if (title) project.title = title;
    if (description) project.description = description;
    if (tags) project.tags = tags;
    if (status) project.status = status;

    await project.save();
    res.json(project);
  } catch (error) {
    console.error('Update Project Error:', error);
    res.status(500).json({ error: 'Error updating project' });
  }
});

// Get user's projects
router.get('/user/projects', verifyToken, async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [
        { youtuberId: req.user.uid },
        { editorId: req.user.uid }
      ]
    })
    .sort({ createdAt: -1 })
    .populate('youtuberId', 'name email profilePicture')
    .populate('editorId', 'name email profilePicture');

    res.json(projects);
  } catch (error) {
    console.error('Get User Projects Error:', error);
    res.status(500).json({ error: 'Error fetching user projects' });
  }
});

// Add feedback to project
router.post('/:id/feedback', verifyToken, checkProjectAccess, async (req, res) => {
  try {
    const { message } = req.body;
    const project = req.project;

    await project.addFeedback(message, req.user.uid);
    res.json(project);
  } catch (error) {
    console.error('Add Feedback Error:', error);
    res.status(500).json({ error: 'Error adding feedback' });
  }
});

module.exports = router; 