import React from 'react';
import "./Navbar.css";

const Navbar = () => {
    return (
        <nav className="nav">
            <div className="nav-brand-group">
                <div className="nav-logo">
                    <img src="/assets/logo.jpg" alt="Rashi Worldwide Logo" />
                </div>
                {/* Nested text container to clean up stacking and center alignment */}
                <div className="nav-brand-text">
                    <h1 className="brand-text">Rashi Worldwide</h1>
                    <p className="brand-slogan">anything anytime anywhere</p>
                </div>
            </div>

            {/* Menu Items */}
            <ul className="ul">
                <li><a href="/">Home</a></li>
                <li><a href="/stockDetails">Stock Details</a></li>
                <li><a href="/contact">Contact</a></li>
                <li><a href="/adminDashboard">Admin</a></li>
            </ul>
        </nav>
    );
};

export default Navbar;