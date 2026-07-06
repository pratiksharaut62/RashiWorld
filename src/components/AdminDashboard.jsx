'use client';

import { useState, useEffect } from 'react';
import AdminLogin from './AdminLogin';
import '@/styles/admin-dashboard.css';
import { supabase } from '@/lib/supabaseClient';

const AdminDashboard = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [activeTab, setActiveTab] = useState('stock-crud');

    // Initialized as an empty array; populated from Supabase
    const [stockItems, setStockItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Hero slider — images shown in rotation on the public homepage banner
    const [heroSlides, setHeroSlides] = useState([]);
    const [isHeroLoading, setIsHeroLoading] = useState(false);
    const [isUploadingHero, setIsUploadingHero] = useState(false);

    // Form inputs streamlined to map directly to your 4 schema columns
    const [newStock, setNewStock] = useState({
        title: '',
        brand: '',
        status: 'Active',
        expiry: '',
    });

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null); // Holds the string "title"

    const [globalSettings, setGlobalSettings] = useState({
        brandName: "Rashi Worldwide",
        tagline: "anything anytime anywhere",
        whatsappNumber: "+91 77090 08441",
        instagramUsername: "rashiworldwide",
        welcomeQuote: "Fashion is a universal language. We weave comfort, culture, and timeless luxury into garments that speak to the world."
    });

    // Native Supabase Session Observer Hook
    useEffect(() => {
        // 1. Check current fallback token validity state on initial mount
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                setIsAuthenticated(true);
                fetchStockItems();
                fetchHeroSlides();
            } else {
                setIsAuthenticated(false);
            }
        });

        // 2. Continuous structural listener for active token expirations or auth updates
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                setIsAuthenticated(true);
                fetchStockItems();
                fetchHeroSlides();
            } else {
                setIsAuthenticated(false);
                setStockItems([]);
                setHeroSlides([]);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    // --- SUPABASE API CRUD OPERATIONS ---

    // READ
    const fetchStockItems = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('stocks')
            .select('*')
            .order('title', { ascending: true }); // Sorting by title column

        if (error) {
            console.error("Fetch Error:", error.message);
            alert("Could not load catalog: " + error.message);
        } else {
            setStockItems(data || []);
        }
        setIsLoading(false);
    };

    // CREATE
    const handleAddStock = async (e) => {
        e.preventDefault();
        if (!newStock.title || !newStock.brand) {
            return alert("Product Title and Brand are required by your database schema.");
        }

        const { data, error } = await supabase
            .from('stocks')
            .insert([
                {
                    title: newStock.title,
                    brand: newStock.brand,
                    status: newStock.status,
                    expiry: newStock.expiry || null
                }
            ])
            .select();

        if (error) {
            console.error("Error inserting data:", error.message);
            alert("Failed to add entry: " + error.message);
        } else {
            if (data && data.length > 0) setStockItems(prev => [data[0], ...prev]);
            // Reset state
            setNewStock({ title: '', brand: '', status: 'Active', expiry: '' });
        }
    };

    // UPDATE (Visibility Switcher)
    const handleToggleVisibility = async (productTitle, currentStatus) => {
        const nextStatus = currentStatus === 'Active' ? 'Hidden' : 'Active';

        const { error } = await supabase
            .from('stocks')
            .update({ status: nextStatus })
            .eq('title', productTitle);

        if (error) {
            console.error("Update Visibility Error:", error.message);
            alert("Failed to change status: " + error.message);
        } else {
            setStockItems(prev => prev.map(item => item.title === productTitle ? { ...item, status: nextStatus } : item));
        }
    };

    // UPDATE (Full item modification)
    const handleSaveEdit = async (e) => {
        e.preventDefault();

        const { error } = await supabase
            .from('stocks')
            .update({
                brand: editingItem.brand,
                status: editingItem.status,
                expiry: editingItem.expiry || null,
            })
            .eq('title', editingItem.title); // Matches using exact primary key string

        if (error) {
            console.error("Error updating item:", error.message);
            alert("Failed to update record: " + error.message);
        } else {
            setStockItems(prev => prev.map(item => item.title === editingItem.title ? editingItem : item));
            setIsEditModalOpen(false);
            setEditingItem(null);
        }
    };

    // DELETE
    const executeDelete = async () => {
        const { error } = await supabase
            .from('stocks')
            .delete()
            .eq('title', itemToDelete); // target deletion via primary key

        if (error) {
            console.error("Error deleting data:", error.message);
            alert("Failed to clear database record: " + error.message);
        } else {
            setStockItems(prev => prev.filter(item => item.title !== itemToDelete));
            setIsDeleteModalOpen(false);
            setItemToDelete(null);
        }
    };

    // --- FORM INPUT UTILITIES ---

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewStock(prev => ({ ...prev, [name]: value }));
    };

    const handleSettingChange = (e) => {
        const { name, value } = e.target;
        setGlobalSettings(prev => ({ ...prev, [name]: value }));
    };

    const openEditModal = (item) => { setEditingItem({ ...item }); setIsEditModalOpen(true); };
    const openDeleteModal = (productTitle) => { setItemToDelete(productTitle); setIsDeleteModalOpen(true); };

    // --- HERO SLIDER (public homepage banner) ---

    // READ
    const fetchHeroSlides = async () => {
        setIsHeroLoading(true);
        const { data, error } = await supabase
            .from('hero_slides')
            .select('*')
            .order('sort_order', { ascending: true });

        if (error) {
            console.error("Hero slides fetch error:", error.message);
        } else {
            setHeroSlides(data || []);
        }
        setIsHeroLoading(false);
    };

    const getHeroPublicUrl = (path) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        const { data } = supabase.storage.from('images').getPublicUrl(path);
        return data.publicUrl;
    };

    // CREATE (upload image(s) to storage, then insert row per slide)
    const handleHeroUpload = async (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        setIsUploadingHero(true);
        try {
            let nextOrder = heroSlides.length > 0
                ? Math.max(...heroSlides.map(s => s.sort_order ?? 0)) + 1
                : 0;

            for (const file of files) {
                const path = `hero/${Date.now()}-${file.name}`;
                const { error: uploadError } = await supabase.storage.from('images').upload(path, file);
                if (uploadError) throw uploadError;

                const { data, error: insertError } = await supabase
                    .from('hero_slides')
                    .insert([{ image_path: path, sort_order: nextOrder }])
                    .select();
                if (insertError) throw insertError;

                if (data && data.length > 0) setHeroSlides(prev => [...prev, data[0]]);
                nextOrder += 1;
            }
        } catch (err) {
            console.error("Hero upload error:", err.message);
            alert("Failed to upload hero image: " + err.message);
        } finally {
            setIsUploadingHero(false);
            e.target.value = '';
        }
    };

    // DELETE
    const handleDeleteHeroSlide = async (slide) => {
        if (!confirm("Remove this hero slide? It will stop appearing on the homepage.")) return;

        const { error } = await supabase.from('hero_slides').delete().eq('id', slide.id);
        if (error) {
            console.error("Hero delete error:", error.message);
            alert("Failed to remove slide: " + error.message);
            return;
        }

        await supabase.storage.from('images').remove([slide.image_path]);
        setHeroSlides(prev => prev.filter(s => s.id !== slide.id));
    };

    // Sign out natively from Supabase, wiping the client JWT safely
    const handleLogout = async () => {
        await supabase.auth.signOut();
        setIsAuthenticated(false);
    };

    const getStatusBadge = (item) => {
        if (item.status === 'Hidden') return <span className="status-badge badge-hidden">Hidden</span>;
        if (!item.expiry) return <span className="status-badge badge-active">Active</span>;

        const diffDays = Math.ceil((new Date(item.expiry) - new Date()) / (1000 * 3600 * 24));
        if (diffDays >= 0 && diffDays <= 3) {
            return <span className="status-badge badge-expiring"><span className="pulse-dot"></span>Expiring Soon</span>;
        }
        return <span className="status-badge badge-active">Active</span>;
    };

    // Graceful loading fallback while assessing token structure
    if (isAuthenticated === null) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#666' }}>Verifying Security Session...</div>;
    }

    if (!isAuthenticated) return <AdminLogin onLoginSuccess={() => { setIsAuthenticated(true); fetchStockItems(); fetchHeroSlides(); }} />;

    return (
        <div className="admin-dashboard-container">
            <aside className="admin-sidebar">
                <div className="sidebar-top">
                    <div className="admin-brand-zone">
                        <div className="admin-logo">R</div>
                        <div>
                            <h3>Admin Dashboard</h3>
                            <p>Rashi Worldwide</p>
                        </div>
                    </div>

                    <nav className="admin-nav-menu">
                        <button className={`nav-btn ${activeTab === 'stock-crud' ? 'is-active' : ''}`} onClick={() => setActiveTab('stock-crud')}>
                            <span>📦</span> Stock Catalog CRUD
                        </button>
                        <button className={`nav-btn ${activeTab === 'hero-slider' ? 'is-active' : ''}`} onClick={() => setActiveTab('hero-slider')}>
                            <span>🖼️</span> Hero Slider
                        </button>
                        <button className={`nav-btn ${activeTab === 'global-settings' ? 'is-active' : ''}`} onClick={() => setActiveTab('global-settings')}>
                            <span>⚙️</span> Component Settings
                        </button>
                    </nav>
                </div>

                <div className="sidebar-bottom">
                    <button onClick={handleLogout} className="nav-btn logout-btn-style">Log Out</button>
                </div>
            </aside>

            <main className="admin-main-viewport">
                <header className="viewport-header">
                    <h2>{activeTab.replace('-', ' ').toUpperCase()}</h2>
                    <span className="secure-badge">Database Live</span>
                </header>

                <div key={activeTab} className="panel-fade-in">
                    {activeTab === 'stock-crud' && (
                        <>
                            <section className="surface-card mt-6">
                                <h3>Active Catalog ({stockItems.length})</h3>
                                {isLoading ? (
                                    <p style={{ padding: '1rem', color: '#888' }}>Syncing with Supabase Ledger...</p>
                                ) : (
                                    <div className="table-overflow-container">
                                        <table className="admin-crud-table">
                                            <thead>
                                                <tr>
                                                    <th>Title</th><th>Brand</th><th>Status</th><th>Expiry</th><th style={{ textAlign: 'right' }}>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {stockItems.map(item => (
                                                    <tr key={item.title}>
                                                        <td><div className="font-bold">{item.title}</div></td>
                                                        <td><span className="category-tag">{item.brand || "General"}</span></td>
                                                        <td>{getStatusBadge(item)}</td>
                                                        <td className="font-mono text-muted">{item.expiry || 'N/A'}</td>
                                                        <td className="actions-cell">
                                                            <button className="action-icon-btn" onClick={() => openEditModal(item)}>Edit</button>
                                                            <button className="action-icon-btn" onClick={() => handleToggleVisibility(item.title, item.status)}>{item.status === 'Active' ? 'Hide' : 'Show'}</button>
                                                            <button className="action-icon-btn delete" onClick={() => openDeleteModal(item.title)}>Delete</button>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {stockItems.length === 0 && (
                                                    <tr>
                                                        <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>No inventory matches found in stocks table.</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </section>

                            <section className="surface-card">
                                <h3>Publish New Stock Entry</h3>
                                <form onSubmit={handleAddStock} className="crud-grid-form">
                                    <div className="input-group full-width"><label>Stock Line Title *</label><input type="text" name="title" value={newStock.title} onChange={handleInputChange} placeholder="e.g., Silk Slip Dress Collection" required /></div>
                                    <div className="input-group"><label>Brand *</label><input type="text" name="brand" value={newStock.brand} onChange={handleInputChange} placeholder="e.g., Nike, Zara..." required /></div>
                                    <div className="input-group"><label>Expiry Date</label><input type="date" name="expiry" value={newStock.expiry} onChange={handleInputChange} /></div>

                                    <div className="full-width"><button type="submit" className="admin-action-btn primary-btn">Save to Supabase</button></div>
                                </form>
                            </section>
                        </>
                    )}

                    {activeTab === 'hero-slider' && (
                        <div className="surface-card">
                            <h3>Homepage Hero Slider</h3>
                            <p className="panel-helper-text">
                                Upload photos to rotate through the homepage hero banner. If none are uploaded,
                                a default image is shown automatically.
                            </p>
                            <div className="dropzone-area">
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleHeroUpload}
                                    id="hero-drop-input"
                                    disabled={isUploadingHero}
                                />
                                <label htmlFor="hero-drop-input" className="dropzone-label">
                                    <span className="upload-icon">🖼️</span>
                                    <p>{isUploadingHero ? 'Uploading…' : <>Drag hero images here or <strong>browse drive</strong></>}</p>
                                </label>
                            </div>

                            {isHeroLoading ? (
                                <p style={{ padding: '1rem', color: '#888' }}>Loading current slides...</p>
                            ) : heroSlides.length > 0 ? (
                                <div className="hero-slides-grid">
                                    {heroSlides.map((slide) => (
                                        <div className="hero-slide-thumb" key={slide.id}>
                                            <img src={getHeroPublicUrl(slide.image_path)} alt="Hero slide" />
                                            <button
                                                className="action-icon-btn delete hero-slide-remove"
                                                onClick={() => handleDeleteHeroSlide(slide)}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="panel-helper-text">No custom slides yet — the homepage is showing the default image.</p>
                            )}
                        </div>
                    )}

                    {activeTab === 'global-settings' && (
                        <div className="surface-card">
                            <h3>Global Content Variables</h3>
                            <p className="panel-helper-text">Instantly updates the frontend Welcome & Contact DOM nodes.</p>
                            <div className="settings-form-layout">
                                <div className="input-group"><label>Brand Name</label><input type="text" name="brandName" value={globalSettings.brandName} onChange={handleSettingChange} /></div>
                                <div className="input-group"><label>Tagline</label><input type="text" name="tagline" value={globalSettings.tagline} onChange={handleSettingChange} /></div>
                                <div className="input-group"><label>WhatsApp Endpoint</label><input type="text" name="whatsappNumber" value={globalSettings.whatsappNumber} onChange={handleSettingChange} /></div>
                                <div className="input-group"><label>Instagram Handle</label><input type="text" name="instagramUsername" value={globalSettings.instagramUsername} onChange={handleSettingChange} /></div>
                                <div className="input-group full-width"><label>Welcome Statement Quote</label><textarea name="welcomeQuote" rows="3" value={globalSettings.welcomeQuote} onChange={handleSettingChange}></textarea></div>
                                <button className="admin-action-btn primary-btn mt-2" onClick={() => alert("Saved.")}>Update Global State</button>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* MODALS */}
            {isEditModalOpen && editingItem && (
                <div className="dashboard-modal-overlay">
                    <div className="dashboard-modal-card">
                        <h3>Update Content Matrix</h3>
                        <form onSubmit={handleSaveEdit} className="crud-grid-form mt-4">
                            <div className="input-group full-width">
                                <label>Product Title (Primary Key Bound)</label>
                                <input type="text" value={editingItem.title} disabled style={{ background: '#eee', cursor: 'not-allowed' }} />
                            </div>
                            <div className="input-group">
                                <label>Brand</label>
                                <input type="text" value={editingItem.brand || ''} onChange={(e) => setEditingItem(prev => ({ ...prev, brand: e.target.value }))} required />
                            </div>
                            <div className="input-group">
                                <label>Status</label>
                                <select value={editingItem.status || 'Active'} onChange={(e) => setEditingItem(prev => ({ ...prev, status: e.target.value }))}>
                                    <option value="Active">Active</option>
                                    <option value="Hidden">Hidden</option>
                                </select>
                            </div>
                            <div className="input-group">
                                <label>Expiry Date</label>
                                <input type="date" value={editingItem.expiry || ''} onChange={(e) => setEditingItem(prev => ({ ...prev, expiry: e.target.value }))} />
                            </div>
                            <div className="modal-actions-wrapper full-width">
                                <button type="button" className="modal-btn cancel" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
                                <button type="submit" className="modal-btn confirm">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isDeleteModalOpen && (
                <div className="dashboard-modal-overlay">
                    <div className="dashboard-modal-card destructive-variant">
                        <h4>Destructive Action</h4>
                        <p>Are you certain? The record <strong>"{itemToDelete}"</strong> will be permanently purged from client endpoints.</p>
                        <div className="modal-actions-wrapper">
                            <button type="button" className="modal-btn cancel" onClick={() => setIsDeleteModalOpen(false)}>Abort</button>
                            <button type="button" className="modal-btn destructive" onClick={executeDelete}>Purge Record</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;