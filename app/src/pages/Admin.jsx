// pages/Admin.jsx — Manage clubs (admin panel)
import { useState, useEffect } from 'react';
import { db, isFirebaseConfigured } from '../firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

const GRAD_OPTIONS = [
    ['#7c3aed', '#4f46e5'], ['#059669', '#10b981'],
    ['#f59e0b', '#f97316'], ['#dc2626', '#f87171'],
    ['#0369a1', '#38bdf8'],
];

export default function Admin() {
    const { user } = useAuth();
    const [clubs, setClubs] = useState([]);
    const [form, setForm] = useState({ name: '', desc: '', emoji: '🏛️', category: '', grad: 0 });
    const [toast, setToast] = useState('');

    const showToast = (msg, type = '') => { setToast({ msg, type }); setTimeout(() => setToast(''), 3000); };

    const loadClubs = async () => {
        if (!isFirebaseConfigured) { setClubs([]); return; }
        try {
            const snap = await getDocs(collection(db, 'clubs'));
            setClubs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        } catch { setClubs([]); }
    };

    useEffect(() => { loadClubs(); }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'clubs'), {
                name: form.name,
                description: form.desc,
                emoji: form.emoji,
                category: form.category,
                grad: GRAD_OPTIONS[form.grad],
                members: 0,
                adminId: user.uid,
                createdAt: serverTimestamp(),
            });
            showToast('Club created! 🎉', 'success');
            setForm({ name: '', desc: '', emoji: '🏛️', category: '', grad: 0 });
            loadClubs();
        } catch { showToast('Error creating club.', 'error'); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this club?')) return;
        try {
            await deleteDoc(doc(db, 'clubs', id));
            showToast('Club deleted.', 'error');
            loadClubs();
        } catch { showToast('Error deleting club.', 'error'); }
    };

    return (
        <div className="page">
            <div className="page-banner">
                <h1>⚙️ Admin Panel</h1>
                <p>Manage clubs, skills, and platform data.</p>
            </div>

            <div className="container" style={{ padding: '48px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'start' }}>
                {/* Create Club Form */}
                <form className="card" onSubmit={handleAdd}>
                    <h3 style={{ fontWeight: 700, marginBottom: 20, fontSize: '1.1rem' }}>➕ Create New Club</h3>
                    <div className="form-group">
                        <label>Club Name *</label>
                        <input className="form-input" required value={form.name}
                            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                            placeholder="e.g. Robotics Club" />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea className="form-input" rows={3} value={form.desc}
                            onChange={e => setForm(f => ({ ...f, desc: e.target.value }))}
                            placeholder="What is this club about?" style={{ resize: 'vertical' }} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div className="form-group">
                            <label>Emoji</label>
                            <input className="form-input" value={form.emoji}
                                onChange={e => setForm(f => ({ ...f, emoji: e.target.value }))}
                                placeholder="🤖" style={{ fontSize: '1.5rem' }} />
                        </div>
                        <div className="form-group">
                            <label>Category</label>
                            <input className="form-input" value={form.category}
                                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                                placeholder="Tech, Arts, Sports..." />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Gradient Color</label>
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            {GRAD_OPTIONS.map((g, i) => (
                                <div key={i}
                                    onClick={() => setForm(f => ({ ...f, grad: i }))}
                                    style={{
                                        width: 32, height: 32, borderRadius: '50%',
                                        background: `linear-gradient(135deg, ${g[0]}, ${g[1]})`,
                                        cursor: 'pointer', border: form.grad === i ? '3px solid var(--dark)' : '3px solid transparent',
                                        transition: 'var(--transition)',
                                    }} />
                            ))}
                        </div>
                    </div>
                    <button type="submit" className="btn-primary" style={{ marginTop: 8 }}>Create Club</button>
                </form>

                {/* Clubs List */}
                <div>
                    <h3 style={{ fontWeight: 700, marginBottom: 16, fontSize: '1.1rem' }}>📋 All Clubs ({clubs.length})</h3>
                    {clubs.length === 0 && <p className="text-gray">No clubs yet. Create one!</p>}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {clubs.map(c => (
                            <div key={c.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 20px' }}>
                                <div style={{
                                    width: 42, height: 42, borderRadius: '12px', flexShrink: 0,
                                    background: c.grad ? `linear-gradient(135deg, ${c.grad[0]}, ${c.grad[1]})` : 'var(--purple)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem',
                                }}>{c.emoji || '🏛️'}</div>
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontWeight: 700 }}>{c.name}</p>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--gray)' }}>{c.category}</p>
                                </div>
                                <button className="btn-danger" onClick={() => handleDelete(c.id)}>Delete</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
        </div>
    );
}
