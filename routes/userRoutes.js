const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const upload = require('./multerStorageCloudinary'); // Import your multer setup

const router = express.Router();

// Route to handle sign-up
router.post('/signup', upload.single('resume'), async (req, res) => {
    try {
        const { name, email, password, phoneNumber, qualifications } = req.body;
        const resume = req.file?.path; // Cloudinary URL of the uploaded file

        if (!resume) {
            return res.status(400).json({ message: 'Resume is required' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ name, email, password: hashedPassword, phoneNumber, qualifications, resume });
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

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user data', error });
    }
});

module.exports = router;
