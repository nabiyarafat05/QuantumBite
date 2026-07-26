const express = require("express");
const MenuItem = require("../models/MenuItem");
const { requireAuth, requireStaff } = require("../middleware/auth");

const router = express.Router();

// GET /api/menu - anyone can view the menu
router.get("/", async (req, res) => {
  try {
    const items = await MenuItem.find().sort({ category: 1, name: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// POST /api/menu - staff only, add a new menu item
router.post("/", requireAuth, requireStaff, async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    if (!name || price === undefined) {
      return res.status(400).json({ message: "Name and price are required" });
    }
    const item = await MenuItem.create({ name, description, price, category });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// PATCH /api/menu/:id/availability - staff only, toggle available/unavailable
router.patch("/:id/availability", requireAuth, requireStaff, async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Menu item not found" });
    item.available = !item.available;
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// DELETE /api/menu/:id - staff only
router.delete("/:id", requireAuth, requireStaff, async (req, res) => {
  try {
    await MenuItem.findByIdAndDelete(req.params.id);
    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
