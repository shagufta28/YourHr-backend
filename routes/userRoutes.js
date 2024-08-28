const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const upload = require('../multerStorageCloudinary'); // Import your multer setup with Cloudinary configuration

const router = express.Router();

// Route to handle sign-up
router.post('/signup', upload.single('resume'), async (req, res) => {
  try {
    const { name, email, password, phoneNumber, qualifications } = req.body;

    // Upload the resume to Cloudinary (assuming you have a field named 'resume' for the file)
    const result = await cloudinary.uploader.upload(req.file.path);
    const resumeUrl = result.secure_url; // Full URL from Cloudinary

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword,   
 phoneNumber, qualifications, resume: resumeUrl });
    await newUser.save();

    res.status(201).json();
  } catch (error) {
    res.status(500).json({ message: 'Error signing up user', error });
  }
});

// Route to handle login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate a token (optional)
        const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
});

// Route to get user data
router.get('/user', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'No token provided' });

        const decoded = jwt.verify(token, 'your_jwt_secret');
        const user = await User.findById(decoded.userId);

        if (!user) return res.status(404).json({ message: 'User not found' });

        // Send user data, including resume URL
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user data', error });
    }
});

module.exports = router;
