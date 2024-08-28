// backend/routes/userRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const { ref, uploadBytes, getDownloadURL } = require('../firebase'); // Firebase functions
const { storage } = require('../firebase'); // Firebase storage
const User = require('../models/User');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // Use multer's memory storage

// Sign-up route
router.post('/signup', upload.single('resume'), async (req, res) => {
    try {
        const { name, email, password, phoneNumber, qualifications } = req.body;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        let resumeUrl = null;

        // Upload the resume to Firebase Storage if it exists
        if (req.file) {
            const storageRef = ref(storage, `resumes/${Date.now()}_${req.file.originalname}`);
            await uploadBytes(storageRef, req.file.buffer);
            resumeUrl = await getDownloadURL(storageRef); // Get the downloadable URL
        }

        // Save the new user to MongoDB
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            phoneNumber,
            qualifications,
            resume: resumeUrl,
        });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'Error signing up user', error });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
});

// Fetch user details route
router.get('/user', async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user data', error });
    }
});

module.exports = router;
