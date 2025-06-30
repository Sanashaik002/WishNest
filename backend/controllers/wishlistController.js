const Wishlist = require('../models/Wishlist');

exports.getWishlist = async (req, res) => {
  try {
    const items = await Wishlist.find({ user: req.user.id });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch wishlist' });
  }
};

exports.addWishlistItem = async (req, res) => {
  try {
    const item = new Wishlist({
      todo: req.body.todo,
      user: req.user.id
    });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateWishlistItem = async (req, res) => {
  const { id } = req.params;
  const { isCompleted } = req.body;

  try {
    const updated = await Wishlist.findOneAndUpdate(
      { _id: id, user: req.user.id },
      { isCompleted },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteWishlistItem = async (req, res) => {
  const { id } = req.params;
  try {
    await Wishlist.findOneAndDelete({ _id: id, user: req.userId });
    res.json({ msg: 'Deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to delete' });
  }
};
