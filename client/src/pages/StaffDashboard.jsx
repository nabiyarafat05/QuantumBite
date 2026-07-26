import React, { useEffect, useState } from "react";
import api from "../api.js";
import { useAuth } from "../AuthContext.jsx";

function StaffDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [error, setError] = useState("");

  const [newItem, setNewItem] = useState({ name: "", description: "", price: "", category: "" });

  const loadData = () => {
    api.get("/orders").then((res) => setOrders(res.data)).catch(() => setError("Could not load orders."));
    api.get("/menu").then((res) => setMenuItems(res.data));
  };

  useEffect(() => {
    if (user?.role === "staff") loadData();
  }, [user]);

  if (!user || user.role !== "staff") {
    return <p>You need to be logged in as staff to view this page.</p>;
  }

  const updateStatus = async (orderId, status) => {
    await api.patch(`/orders/${orderId}/status`, { status });
    loadData();
  };

  const toggleAvailability = async (itemId) => {
    await api.patch(`/menu/${itemId}/availability`);
    loadData();
  };

  const addMenuItem = async (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.price) return;
    await api.post("/menu", { ...newItem, price: parseFloat(newItem.price) });
    setNewItem({ name: "", description: "", price: "", category: "" });
    loadData();
  };

  return (
    <div>
      <h1>Staff Dashboard</h1>
      {error && <p className="error">{error}</p>}

      <section>
        <h2>Incoming Orders</h2>
        {orders.length === 0 && <p>No orders yet.</p>}
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <p><strong>{order.customerName}</strong> {order.tableNumber && `(Table ${order.tableNumber})`}</p>
              <ul>
                {order.items.map((i, idx) => (
                  <li key={idx}>{i.name} x{i.quantity}</li>
                ))}
              </ul>
              <p>Total: ₹{order.totalAmount}</p>
              <select value={order.status} onChange={(e) => updateStatus(order._id, e.target.value)}>
                <option value="pending">Pending</option>
                <option value="preparing">Preparing</option>
                <option value="ready">Ready</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>Manage Menu</h2>
        <form onSubmit={addMenuItem} className="menu-form">
          <input placeholder="Item name" value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} />
          <input placeholder="Description" value={newItem.description}
            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })} />
          <input placeholder="Price" type="number" value={newItem.price}
            onChange={(e) => setNewItem({ ...newItem, price: e.target.value })} />
          <input placeholder="Category" value={newItem.category}
            onChange={(e) => setNewItem({ ...newItem, category: e.target.value })} />
          <button type="submit">Add Item</button>
        </form>

        <div className="menu-grid">
          {menuItems.map((item) => (
            <div key={item._id} className="menu-card">
              <h3>{item.name}</h3>
              <p className="price">₹{item.price}</p>
              <button onClick={() => toggleAvailability(item._id)}>
                Mark as {item.available ? "Unavailable" : "Available"}
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default StaffDashboard;
