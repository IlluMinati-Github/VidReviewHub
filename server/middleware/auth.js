const admin = require('../config/firebase-admin');

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      role: decodedToken.role || 'user' // Default role if not set
    };
    next();
  } catch (error) {
    console.error('Auth Error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};

const checkProjectAccess = async (req, res, next) => {
  try {
    const projectId = req.params.projectId;
    const { Project } = require('../models/Project');
    
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check if user is either the youtuber or editor of the project
    if (req.user.uid !== project.youtuberId && req.user.uid !== project.editorId) {
      return res.status(403).json({ error: 'Access denied to this project' });
    }

    // Add project to request for later use
    req.project = project;
    next();
  } catch (error) {
    console.error('Project Access Error:', error);
    res.status(500).json({ error: 'Error checking project access' });
  }
};

const checkProjectEditAccess = async (req, res, next) => {
  try {
    const projectId = req.params.projectId;
    const { Project } = require('../models/Project');
    
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check if user is the editor of the project
    if (req.user.uid !== project.editorId) {
      return res.status(403).json({ error: 'Only the assigned editor can edit this project' });
    }

    req.project = project;
    next();
  } catch (error) {
    console.error('Project Edit Access Error:', error);
    res.status(500).json({ error: 'Error checking project edit access' });
  }
};

const checkProjectReviewAccess = async (req, res, next) => {
  try {
    const projectId = req.params.projectId;
    const { Project } = require('../models/Project');
    
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check if user is the youtuber of the project
    if (req.user.uid !== project.youtuberId) {
      return res.status(403).json({ error: 'Only the youtuber can review this project' });
    }

    req.project = project;
    next();
  } catch (error) {
    console.error('Project Review Access Error:', error);
    res.status(500).json({ error: 'Error checking project review access' });
  }
};

module.exports = {
  verifyToken,
  checkRole,
  checkProjectAccess,
  checkProjectEditAccess,
  checkProjectReviewAccess
}; 