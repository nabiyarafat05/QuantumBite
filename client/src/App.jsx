import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext.jsx";
import Menu from "./pages/Menu.jsx";
import Order from "./pages/Order.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import StaffDashboard from "./pages/StaffDashboard.jsx";

function Nav() {
  const { user, logout } = useAuth();
  return (
    <nav className="nav">
      <Link to="/" className="brand">QuantumBite</Link>
      <div className="nav-links">
        <Link to="/">Menu</Link>
        <Link to="/order">Order</Link>
        {user?.role === "staff" && <Link to="/dashboard">Dashboard</Link>}
        {user ? (
          <>
            <span className="nav-user">Hi, {user.name}</span>
            <button onClick={logout} className="btn-link">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

function App() {
  return (
    <AuthProvider>
      <Nav />
      <main className="container">
        <Routes>
          <Route path="/" element={<Menu />} />
          <Route path="/order" element={<Order />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<StaffDashboard />} />
        </Routes>
      </main>
    </AuthProvider>
  );
}

export default App;
