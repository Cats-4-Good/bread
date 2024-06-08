const express = require('express');

const { !!!!! } = require('../controllers/breadController');

const router = express.Router();

// GET posts for particular bakery
router.get('/:id', getPosts);

//// GET posts based on bakery ID, filtered for recency
// router.get('/query/:qn', getFilteredPosts);

// POST a new post for a particular bakery
router.post('/:id', createPost);

// DELETE a post??

module.exports = router;