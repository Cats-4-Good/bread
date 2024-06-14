const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const crypto = require('crypto');
const path = require('path');
const mongoose = require('mongoose');
require("dotenv").config();

const mongoURI = process.env.MONGO_URI;

gfs = Grid(mongoose.connection, mongoose.mongo);

// Create storage engine
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      const timestamp = Date.now();
      const filename = `${timestamp}-${file.originalname}`;
      const fileInfo = {
        filename: filename,
        bucketName: 'uploads',
      };
      resolve(fileInfo);
    });
  },
});
const upload = multer({ storage });

const express = require("express");

const {
  getBakeries,
  getBakeryDetails,
  getPosts,
  createPost,
} = require("../controllers/breadController");

const router = express.Router();

// GET bakeries in the area
router.get("/bakeries/:latitude/:longitude/:range", getBakeries);

// GET bakery information through Google API
router.get("/bakery/:id", getBakeryDetails);

// GET posts for particular bakery
router.get("/:id", getPosts);

//// GET posts based on bakery ID, filtered for recency
// router.get('/query/:qn', getFilteredPosts);

// POST a new post for a particular bakery
router.post("/", upload.single('file'), createPost);

// DELETE a post??

module.exports = router;
