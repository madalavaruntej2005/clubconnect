// components/Navbar.jsx — ClubConnect Navigation
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [showDrop, setShowDrop] = useState(false);

    const handleSignOut = async () => {
        await signOut(auth);
        navigate('/login');
    };

    const initials = user?.displayName
        ? user.displayName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
        : user?.email?.slice(0, 2).toUpperCase() ?? 'CC';

    const links = [
        { to: '/', label: 'Home' },
        { to: '/discover', label: 'Discover' },
        { to: '/clubs', label: 'Clubs' },
        { to: '/requests', label: 'Requests' },
        { to: '/leaderboard', label: 'Leaderboard' },
        { to: '/admin', label: 'Admin' },
        { to: '/profile', label: 'My Profile' },
    ];

    return (
        <header className="cc-navbar">
            <div className="cc-nav-inner">
                <NavLink to="/" className="cc-logo" onClick={() => setOpen(false)}>ClubConnect</NavLink>

                <nav className={`cc-nav-links ${open ? 'open' : ''}`}>
                    {links.map(l => (
                        <NavLink
                            key={l.to}
                            to={l.to}
                            end={l.to === '/'}
                            className={({ isActive }) => `cc-nav-link ${isActive ? 'active' : ''}`}
                            onClick={() => setOpen(false)}
                        >
                            {l.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="cc-nav-actions">
                    <button className="cc-notif-btn" onClick={() => alert('🔔 3 new skill exchange requests!')}>
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                        </svg>
                        <span className="cc-notif-dot" />
                    </button>

                    <div className="cc-avatar-wrap">
                        <button className="cc-avatar" onClick={() => setShowDrop(d => !d)}>
                            {user?.photoURL
                                ? <img src={user.photoURL} alt="avatar" className="cc-avatar-img" />
                                : initials
                            }
                        </button>
                        {showDrop && (
                            <div className="cc-dropdown">
                                <span className="cc-dropdown-name">{user?.displayName || user?.email || 'Guest'}</span>
                                <NavLink to="/profile" className="cc-dropdown-item" onClick={() => setShowDrop(false)}>My Profile</NavLink>
                                {user
                                    ? <button className="cc-dropdown-item danger" onClick={handleSignOut}>Sign Out</button>
                                    : <NavLink to="/login" className="cc-dropdown-item" onClick={() => setShowDrop(false)}>Sign In</NavLink>
                                }
                            </div>
                        )}
                    </div>

                    <button className="cc-hamburger" onClick={() => setOpen(o => !o)} aria-label="Menu">
                        <span className={open ? 'rotate45' : ''} />
                        <span className={open ? 'hidden' : ''} />
                        <span className={open ? 'rotate-45' : ''} />
                    </button>
                </div>
            </div>
        </header>
    );
}
