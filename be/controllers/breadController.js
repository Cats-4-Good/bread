const Post = require("../models/postModel");
const mongoose = require("mongoose");
const axios = require("axios");
require("dotenv").config();

const googleKey = process.env.GOOGLE_API;

// get all bakeries in region
const getBakeries = async (req, res) => {
  const { latitude, longitude, range } = req.params;

  try {
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
      {
        params: {
          location: `${latitude},${longitude}`,
          radius: range, // 1km radius
          type: "bakery",
          key: googleKey,
        },
      },
    );

    const bakeries = response.data.results;
    res.json(bakeries);
  } catch (e) {
    console.error(e);
    res.status(500).json({
      error: "An error occurred while fetching data from Google Places API",
    });
  }
};

// get bakery info through Google API
const getBakeryDetails = async (req, res) => {
  const { id } = req.params;

  details = "CALL GOOGLE API 2";
  console.log(18);

  res.status(200);
  // res.status(200).json(details);
};

// get all posts tagged to this bakery
const getPosts = async (req, res) => {
  const { id } = req.params;

  try {
    const posts = await Post.find({ bakeryId: id }).sort({ createdAt: -1 });
    // ignore the limits for now

    if (!posts) {
      console.log(31);
      return res.json({ oops: "No posts for that bakery yet!" });
    }

    const populatedPosts = await Promise.all(
      posts.map(async (post) => {
        if (post.photoId) {
          // Fetch photo details from GridFS based on photoId
          const photoDetails = await gfs.files
            .findOne({ _id: listing.photoId })
            .exec();
          // Add photo details to listing object
          return { ...listing, photoDetails };
        } else {
          // This should never occur...
          res.status(500).json({
            error: "The post has no photoId or photo not found in database! ",
          });
          return listing;
        }
      }),
    );
    res.status(200).json(populatedPosts);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

// create a new post
const createPost = async (req, res) => {
  const { bakeryId, title, price, userId } = req.body;
  const photoId = req.file.id;

  // add to DB
  try {
    const post = await Post.create({ bakeryId, title, price, userId, photoId });
    res.status(200).json(post);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

module.exports = {
  getBakeries,
  getBakeryDetails,
  getPosts,
  createPost,
};
