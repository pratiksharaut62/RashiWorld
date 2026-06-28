import React from 'react';
import { contactDetails } from './contactData';
import './Contact.css';

const Contact = () => {
    const { phone, whatsappNumber, whatsappMessage, instagramUsername } = contactDetails;

    const channels = [
        {
            name: "WhatsApp",
            icon: "https://cdn-icons-png.flaticon.com/512/733/733585.png",
            url: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`,
            color: "#25D366", 
            subtitle: "Instant Chat Support",
            actionText: "Inquire Now"
        },
        {
            name: "Instagram",
            icon: "https://cdn-icons-png.flaticon.com/512/174/174855.png",
            url: `https://instagram.com/${instagramUsername}`,
            color: "#E84D0E", 
            subtitle: `@${instagramUsername}`,
            actionText: "View Lookbook"
        },
        {
            name: "Call Mobile",
            icon: "https://cdn-icons-png.flaticon.com/512/597/597177.png",
            url: `tel:${phone}`,
            color: "#E84D0E", 
            subtitle: phone,
            actionText: "Call Directly"
        }
    ];

    return (
        <div className="contact-page-wrapper">
            {/* Minimal Minimalist Header */}
            <div className="contact-hero-panel">
                <span className="contact-brand-tagline">Rashi Worldwide</span>
                <h1 className="contact-company-title">anything anytime anywhere</h1>
                <p className="contact-blurb-text">
                    An elite apparel exporter specializing in luxury premium manufacturing and reliable worldwide logistics. Over 10+ years of industrial expertise.
                </p>
            </div>
            
            {/* Flat Row System (No Big Boxes) */}
            <div className="contact-links-panel">
                <div className="contact-row-container">
                    {channels.map((channel, index) => (
                        <a 
                            key={index} 
                            href={channel.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="contact-row-item"
                            style={{ '--accent-color': channel.color }}
                        >
                            <div className="row-left-content">
                                <img src={channel.icon} alt={channel.name} className="contact-row-icon" />
                                <div className="row-text-block">
                                    <span className="channel-name">{channel.name}</span>
                                    <span className="channel-subtitle">{channel.subtitle}</span>
                                </div>
                            </div>
                            <div className="channel-action">
                                <span className="action-text">{channel.actionText}</span>
                                <span className="action-arrow">→</span>
                            </div>
                        </a>
                    ))}
                </div>
            </div>

            <div className="contact-disclaimer-bar">
                * Secure B2B purchase distribution is processed entirely via our active digital channels. Zero contact forms required.
            </div>
        

        </div>
    );
};

export default Contact;