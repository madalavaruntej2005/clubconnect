// pages/Discover.jsx — Browse and list skills
import { useState, useEffect } from 'react';
import { db, isFirebaseConfigured } from '../firebase';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import './Discover.css';

const SAMPLE = [
    { id: 's1', title: 'UI/UX Design', author: 'Arjun K', tags: ['Design', 'Figma'], exchanges: 12, color: '#ede9fe' },
    { id: 's2', title: 'React Development', author: 'Priya S', tags: ['Tech', 'JavaScript'], exchanges: 9, color: '#dcfce7' },
    { id: 's3', title: 'Photography', author: 'Rahul V', tags: ['Creative', 'Lightroom'], exchanges: 7, color: '#fef3c7' },
    { id: 's4', title: 'Music Production', author: 'Sneha M', tags: ['Arts', 'Ableton'], exchanges: 5, color: '#fee2e2' },
    { id: 's5', title: 'Public Speaking', author: 'Dev R', tags: ['Soft Skills', 'Leadership'], exchanges: 11, color: '#ede9fe' },
    { id: 's6', title: 'Machine Learning', author: 'Kay P', tags: ['AI', 'Python'], exchanges: 8, color: '#dcfce7' },
];

export default function Discover() {
    const { user } = useAuth();
    const [skills, setSkills] = useState([]);
    const [search, setSearch] = useState('');
    const [tag, setTag] = useState('All');
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ title: '', description: '', tags: '' });
    const [toast, setToast] = useState('');

    useEffect(() => {
        if (!isFirebaseConfigured) { setSkills(SAMPLE); return; }
        async function load() {
            try {
                const snap = await getDocs(collection(db, 'skills'));
                const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
                setSkills(data.length ? data : SAMPLE);
            } catch { setSkills(SAMPLE); }
        }
        load();
    }, []);

    const showToast = (msg, type = '') => {
        setToast({ msg, type });
        setTimeout(() => setToast(''), 3000);
    };

    const handlePost = async (e) => {
        e.preventDefault();
        if (!user) { showToast('Please sign in to post a skill.', 'error'); return; }
        try {
            await addDoc(collection(db, 'skills'), {
                title: form.title,
                description: form.description,
                tags: form.tags.split(',').map(t => t.trim()),
                author: user.displayName || user.email,
                userId: user.uid,
                exchanges: 0,
                createdAt: serverTimestamp(),
                color: '#ede9fe',
            });
            showToast('Skill posted! 🎉', 'success');
            setForm({ title: '', description: '', tags: '' });
            setShowForm(false);
            const snap = await getDocs(collection(db, 'skills'));
            setSkills(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        } catch (err) {
            showToast('Error posting skill.', 'error');
        }
    };

    const allTags = ['All', ...new Set(skills.flatMap(s => s.tags || []))];
    const filtered = skills.filter(s => {
        const matchTag = tag === 'All' || (s.tags || []).includes(tag);
        const matchSearch = s.title?.toLowerCase().includes(search.toLowerCase());
        return matchTag && matchSearch;
    });

    return (
        <div className="page">
            <div className="page-banner">
                <h1>Discover Skills</h1>
                <p>Find skills to learn from students across your campus.</p>
            </div>

            <div className="container disc-body">
                {/* Controls */}
                <div className="disc-controls">
                    <input
                        className="form-input disc-search"
                        placeholder="Search skills..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    <div className="disc-tags">
                        {allTags.map(t => (
                            <button
                                key={t}
                                className={`tag-filter ${tag === t ? 'active' : ''}`}
                                onClick={() => setTag(t)}
                            >{t}</button>
                        ))}
                    </div>
                    {user && (
                        <button className="btn-primary" onClick={() => setShowForm(s => !s)}>
                            + Post a Skill
                        </button>
                    )}
                </div>

                {/* Post Form */}
                {showForm && (
                    <form className="card disc-form" onSubmit={handlePost}>
                        <h3>Post a New Skill</h3>
                        <div className="form-group">
                            <label>Skill Title *</label>
                            <input className="form-input" required value={form.title}
                                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                placeholder="e.g. React Development" />
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea className="form-input" rows={3} value={form.description}
                                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                placeholder="What will you teach?" style={{ resize: 'vertical' }} />
                        </div>
                        <div className="form-group">
                            <label>Tags (comma-separated)</label>
                            <input className="form-input" value={form.tags}
                                onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                                placeholder="e.g. Tech, JavaScript, React" />
                        </div>
                        <div className="form-row">
                            <button type="submit" className="btn-primary">Post Skill</button>
                            <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                        </div>
                    </form>
                )}

                {/* Skill Cards */}
                <div className="disc-grid">
                    {filtered.map(s => (
                        <div key={s.id} className="disc-card">
                            <div className="disc-icon" style={{ background: s.color || '#ede9fe' }}>
                                {s.title?.charAt(0) || '📚'}
                            </div>
                            <div className="disc-card-body">
                                <h3>{s.title}</h3>
                                <p className="text-gray disc-author">by {s.author}</p>
                                <p className="disc-desc">{s.description || 'Skill exchange opportunity on campus.'}</p>
                                <div className="disc-card-tags">
                                    {(s.tags || []).map(t => (
                                        <span key={t} className="badge badge-purple">{t}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="disc-card-footer">
                                <span className="text-gray" style={{ fontSize: '0.82rem' }}>🔄 {s.exchanges || 0} exchanges</span>
                                <button
                                    className="btn-primary"
                                    style={{ padding: '8px 18px', fontSize: '0.82rem' }}
                                    onClick={() => showToast('Request sent! 🎉', 'success')}
                                >Request</button>
                            </div>
                        </div>
                    ))}
                </div>

                {filtered.length === 0 && (
                    <p className="disc-empty">No skills found. Try a different search.</p>
                )}
            </div>

            {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
        </div>
    );
}
