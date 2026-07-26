import React, { useEffect, useState } from "react";
import api from "../api.js";

function Order() {
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState({}); // { menuItemId: quantity }
  const [customerName, setCustomerName] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get("/menu").then((res) => setMenuItems(res.data.filter((i) => i.available)));
  }, []);

  const updateQuantity = (id, qty) => {
    setCart((prev) => ({ ...prev, [id]: Math.max(0, qty) }));
  };

  const total = menuItems.reduce((sum, item) => {
    const qty = cart[item._id] || 0;
    return sum + item.price * qty;
  }, 0);

  const placeOrder = async (e) => {
    e.preventDefault();
    setMessage("");
    const items = menuItems
      .filter((item) => (cart[item._id] || 0) > 0)
      .map((item) => ({
        menuItem: item._id,
        name: item.name,
        price: item.price,
        quantity: cart[item._id],
      }));

    if (!customerName || items.length === 0) {
      setMessage("Please enter your name and select at least one item.");
      return;
    }

    try {
      await api.post("/orders", { customerName, tableNumber, items });
      setMessage("Order placed successfully!");
      setCart({});
      setCustomerName("");
      setTableNumber("");
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong placing the order.");
    }
  };

  return (
    <div>
      <h1>Place an Order</h1>
      <form onSubmit={placeOrder} className="order-form">
        <input
          type="text"
          placeholder="Your name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Table number (optional)"
          value={tableNumber}
          onChange={(e) => setTableNumber(e.target.value)}
        />

        <div className="order-items">
          {menuItems.map((item) => (
            <div key={item._id} className="order-item-row">
              <span>{item.name} - ₹{item.price}</span>
              <input
                type="number"
                min="0"
                value={cart[item._id] || 0}
                onChange={(e) => updateQuantity(item._id, parseInt(e.target.value) || 0)}
              />
            </div>
          ))}
        </div>

        <p className="total">Total: ₹{total}</p>
        <button type="submit">Place Order</button>
        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
}

export default Order;
