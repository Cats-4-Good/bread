const Post = require('../models/postModel');
const mongoose = require('mongoose');

// get all bakeries in region
const getBakeries = async (req, res) => {
    const { location } = req.params;

    details = "CALL GOOGLE API 1";

    res.status(200).json(details);
}

// get bakery info through Google API
const getBakeryDetails = async (req, res) => {
    const { id } = req.params;

    details = "CALL GOOGLE API 2";
    console.log(18);

    res.status(200);
    // res.status(200).json(details);
}

// get all posts tagged to this bakery
const getPosts = async (req, res) => {
    const { id } = req.params;

    const posts = await Post.find({ bakeryId: id })
                            .sort( {createdAt: -1 })
                            // ignore the limits rn
    
    if (!posts) {
        console.log(31);
        return res.json({oops: "No posts for that bakery yet!"});
    }
    console.log(34);
    console.log(posts.length);
    res.status(200).json(posts);
}

// create a new post
const createPost = async (req, res) => {
    const {bakeryId, title, price, userId, photo} = req.body;

    // add to DB
    try {
        const post = await Post.create({ bakeryId, title, price, userId, photo });
        res.status(200).json(post);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
}

module.exports = {
    getBakeries, getBakeryDetails, getPosts, createPost
}