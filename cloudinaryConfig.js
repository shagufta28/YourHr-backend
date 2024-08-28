const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'dla2mc8qu',
    api_key: '771352457989395',
    api_secret: 'IiA1OiyvM1mhnB2GL7yKwxulMWI',
    secure: true, // Optional: Use https for the URLs
});

module.exports = cloudinary;
