const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

if (!process.env.CLOUD_NAME || !process.env.CLOUD_API_KEY || !process.env.CLOUD_API_SECRET) {
  console.error("Cloudinary env vars are missing or incomplete:", {
    CLOUD_NAME: Boolean(process.env.CLOUD_NAME),
    CLOUD_API_KEY: Boolean(process.env.CLOUD_API_KEY),
    CLOUD_API_SECRET: Boolean(process.env.CLOUD_API_SECRET),
  });
}

module.exports = cloudinary;

