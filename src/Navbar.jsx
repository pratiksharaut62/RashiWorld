import React from 'react';
import { Link } from 'react-router-dom'; // FIXED: Added the Router link import
import "./Navbar.css";

const Navbar = () => {
    return (
        <nav className="nav">
            <div className="nav-brand-group">
                <div className="nav-logo">
                    <img src="/logo.jpg" alt="Rashi Worldwide Logo" />
                </div>
                {/* Nested text container to clean up stacking and center alignment */}
                <div className="nav-brand-text">
                    <h1 className="brand-text">Rashi Worldwide</h1>
                </div>
            </div>

            {/* Menu Items */}
            {/* FIXED: Swapped out all <a> href tags for optimized <Link> components */}
            <ul className="ul">
                <li><Link to="/">Home</Link></li>
                
                <li><Link to="/contact">Contact</Link></li>
                
            </ul>
        </nav>
    );
};

export default Navbar;