// pages/MyProfile.jsx — User profile with Firestore data
import { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { useAuth } from '../context/AuthContext';

export default function MyProfile() {
    const { user } = useAuth();
    const [profile, setProfile] = useState({ displayName: '', bio: '', skills: '' });
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState('');

    const showToast = (msg, type = '') => { setToast({ msg, type }); setTimeout(() => setToast(''), 3000); };

    useEffect(() => {
        async function load() {
            if (!user) return;
            try {
                const snap = await getDoc(doc(db, 'users', user.uid));
                if (snap.exists()) {
                    const d = snap.data();
                    setProfile({
                        displayName: d.displayName || user.displayName || '',
                        bio: d.bio || '',
                        skills: (d.skills || []).join(', '),
                    });
                } else {
                    setProfile({ displayName: user.displayName || '', bio: '', skills: '' });
                }
            } catch {
                setProfile({ displayName: user.displayName || '', bio: '', skills: '' });
            }
            setLoading(false);
        }
        load();
    }, [user]);

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            await updateProfile(auth.currentUser, { displayName: profile.displayName });
            await setDoc(doc(db, 'users', user.uid), {
                displayName: profile.displayName,
                bio: profile.bio,
                email: user.email,
                skills: profile.skills.split(',').map(s => s.trim()).filter(Boolean),
                updatedAt: serverTimestamp(),
            }, { merge: true });
            setSaved(true);
            showToast('Profile saved! ✅', 'success');
            setTimeout(() => setSaved(false), 2000);
        } catch { showToast('Error saving profile.', 'error'); }
    };

    if (loading) return (
        <div className="page loader-wrap"><div className="loader" /></div>
    );

    const initials = (profile.displayName || user?.email || 'CC')
        .split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

    return (
        <div className="page">
            <div className="page-banner">
                <h1>My Profile</h1>
                <p>Manage your info and skills on ClubConnect.</p>
            </div>

            <div className="container" style={{ padding: '48px 24px', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px', alignItems: 'start' }}>
                {/* Avatar Card */}
                <div className="card" style={{ textAlign: 'center' }}>
                    <div style={{
                        width: 90, height: 90, borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--purple), #4f46e5)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '2rem', fontWeight: 800, color: 'white',
                        margin: '0 auto 16px',
                    }}>{initials}</div>
                    <h2 style={{ fontWeight: 700, marginBottom: 4 }}>{profile.displayName || 'Your Name'}</h2>
                    <p style={{ fontSize: '0.85rem', color: 'var(--gray)', marginBottom: 16 }}>{user.email}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                        {profile.skills.split(',').filter(Boolean).map((s, i) => (
                            <span key={i} className="badge badge-purple">{s.trim()}</span>
                        ))}
                    </div>
                </div>

                {/* Edit Form */}
                <form className="card" onSubmit={handleSave}>
                    <h3 style={{ fontWeight: 700, marginBottom: 20 }}>Edit Profile</h3>
                    <div className="form-group">
                        <label>Display Name</label>
                        <input className="form-input" value={profile.displayName}
                            onChange={e => setProfile(p => ({ ...p, displayName: e.target.value }))}
                            placeholder="Your full name" />
                    </div>
                    <div className="form-group">
                        <label>Bio</label>
                        <textarea className="form-input" rows={3} value={profile.bio}
                            onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
                            placeholder="Tell others about yourself..."
                            style={{ resize: 'vertical' }} />
                    </div>
                    <div className="form-group">
                        <label>Skills (comma-separated)</label>
                        <input className="form-input" value={profile.skills}
                            onChange={e => setProfile(p => ({ ...p, skills: e.target.value }))}
                            placeholder="e.g. React, Design, Photography" />
                    </div>
                    <div className="form-group">
                        <label>Email (read-only)</label>
                        <input className="form-input" value={user.email} disabled
                            style={{ opacity: 0.6, cursor: 'not-allowed' }} />
                    </div>
                    <button type="submit" className="btn-primary">
                        {saved ? '✅ Saved!' : 'Save Profile'}
                    </button>
                </form>
            </div>

            {/* Stats */}
            <div className="container" style={{ paddingBottom: '48px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px' }}>
                    {[
                        { label: 'Skills Shared', value: 0, color: 'var(--purple)' },
                        { label: 'Exchanges Done', value: 0, color: 'var(--green)' },
                        { label: 'Points Earned', value: 0, color: 'var(--orange)' },
                        { label: 'Clubs Joined', value: 0, color: 'var(--red)' },
                    ].map((s, i) => (
                        <div key={i} className="card" style={{ textAlign: 'center', padding: '28px' }}>
                            <p style={{ fontSize: '2rem', fontWeight: 800, color: s.color, marginBottom: 6 }}>{s.value}</p>
                            <p style={{ color: 'var(--gray)', fontSize: '0.88rem' }}>{s.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
        </div>
    );
}
