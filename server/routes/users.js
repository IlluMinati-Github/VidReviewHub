const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const User = require('../models/User');

// Sync user data with MongoDB
router.post('/sync', async (req, res) => {
  try {
    const { uid, email, displayName, photoURL, role } = req.body;

    // Find user by uid or create new user
    let user = await User.findOne({ uid });
    
    if (user) {
      // Update existing user
      user.email = email;
      user.displayName = displayName;
      user.photoURL = photoURL;
      user.lastLogin = new Date();
    } else {
      // Create new user
      user = new User({
        uid,
        email,
        displayName,
        photoURL,
        role
      });
    }

    await user.save();
    res.status(200).json({ message: 'User data synced successfully', user });
  } catch (error) {
    console.error('Error syncing user data:', error);
    res.status(500).json({ error: 'Error syncing user data' });
  }
});

// Get current user profile
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.user.uid })
      .populate('projects');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get User Error:', error);
    res.status(500).json({ error: 'Error fetching user profile' });
  }
});

// Update user profile
router.put('/me', verifyToken, async (req, res) => {
  try {
    const { name, bio, profilePicture } = req.body;
    
    const user = await User.findOneAndUpdate(
      { uid: req.user.uid },
      { 
        $set: {
          name: name || undefined,
          bio: bio || undefined,
          profilePicture: profilePicture || undefined
        }
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Update User Error:', error);
    res.status(500).json({ error: 'Error updating user profile' });
  }
});

// Get user by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.params.id })
      .select('-projects'); // Don't send projects list for other users
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get User by ID Error:', error);
    res.status(500).json({ error: 'Error fetching user' });
  }
});

// Create or update user after Firebase auth
router.post('/auth', verifyToken, async (req, res) => {
  try {
    const { name, role } = req.body;
    
    let user = await User.findOne({ uid: req.user.uid });
    
    if (user) {
      // Update existing user
      user.name = name || user.name;
      user.role = role || user.role;
      await user.save();
    } else {
      // Create new user
      user = new User({
        uid: req.user.uid,
        email: req.user.email,
        name,
        role,
      });
      await user.save();
    }

    res.json(user);
  } catch (error) {
    console.error('Auth User Error:', error);
    res.status(500).json({ error: 'Error creating/updating user' });
  }
});

module.exports = router; 