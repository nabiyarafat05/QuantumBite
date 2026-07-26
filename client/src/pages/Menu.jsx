import React, { useEffect, useState } from "react";
import api from "../api.js";

function Menu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/menu")
      .then((res) => setItems(res.data))
      .catch(() => setError("Could not load the menu. Is the server running?"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading menu...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div>
      <h1>Our Menu</h1>
      {items.length === 0 && <p>No menu items yet. Staff can add items from the dashboard.</p>}
      <div className="menu-grid">
        {items.map((item) => (
          <div key={item._id} className={`menu-card ${!item.available ? "unavailable" : ""}`}>
            <h3>{item.name}</h3>
            <p className="desc">{item.description}</p>
            <p className="price">₹{item.price}</p>
            <span className={`tag ${item.available ? "tag-available" : "tag-unavailable"}`}>
              {item.available ? "Available" : "Unavailable"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Menu;
