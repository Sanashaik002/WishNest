const express = require('express');
const router = express.Router();
const Wishlist = require('../models/Wishlist');
const authenticateUser = require('../middleware/authMiddleware'); // ✅ Middleware for protecting routes

// ------------------ GET all wishlist items for logged-in user ------------------
router.get('/', authenticateUser, async (req, res) => {
  try {
    const items = await Wishlist.find({ userId: req.user.id });
    res.json(items);
  } catch (err) {
    console.error('Fetch wishlist error:', err);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// ------------------ POST a new wishlist item ------------------
router.post('/', authenticateUser, async (req, res) => {
  const { todo } = req.body;

  if (!todo || todo.trim() === '') {
    return res.status(400).json({ message: 'Todo cannot be empty' });
  }

  try {
    const newItem = new Wishlist({
      todo: todo.trim(),
      userId: req.user.id, // req.user should be set by middleware
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    console.error('Add wishlist error:', err);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// ------------------ PUT toggle completion ------------------
router.put('/:id', authenticateUser, async (req, res) => {
  try {
    const updated = await Wishlist.findByIdAndUpdate(
      req.params.id,
      { isCompleted: req.body.isCompleted },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    console.error('Update wishlist error:', err);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// ------------------ DELETE a wishlist item ------------------
router.delete('/:id', authenticateUser, async (req, res) => {
  try {
    await Wishlist.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    console.error('Delete wishlist error:', err);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

module.exports = router;
