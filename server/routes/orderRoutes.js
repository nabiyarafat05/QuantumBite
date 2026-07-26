const express = require("express");
const Order = require("../models/Order");
const { requireAuth, requireStaff } = require("../middleware/auth");

const router = express.Router();

// POST /api/orders - anyone can place an order
router.post("/", async (req, res) => {
  try {
    const { customerName, tableNumber, items } = req.body;
    if (!customerName || !items || items.length === 0) {
      return res.status(400).json({ message: "Customer name and at least one item are required" });
    }
    const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const order = await Order.create({ customerName, tableNumber, items, totalAmount });
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET /api/orders - staff only, view all orders (most recent first)
router.get("/", requireAuth, requireStaff, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// PATCH /api/orders/:id/status - staff only, update order status
router.patch("/:id/status", requireAuth, requireStaff, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["pending", "preparing", "ready", "completed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
