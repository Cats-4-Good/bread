const Post = require('../models/postModel');
const mongoose = require('mongoose');

// get all bakeries in region
const getBakeries = async (req, res) => {

}

// get bakery info through Google API
const getBakeryDetails = async (req, res) => {
    const { id } = req.params;

    details = "CALL GOOGLE API";

    res.status(200).json(details);
}

// get all posts tagged to this bakery
const getPosts = async (req, res) => {

}

// create a new post
const createPost = async (req, res) => {
    const {title, price, userId, photo} = req.body;

    // add to DB
    try {
        const post = await Post.create({ title, price, userId, photo });
        res.status(200).json(post);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
}

module.exports = {
    getBakeries, getBakeryDetails, getPosts, createPost
}