// pages/Clubs.jsx — Browse and join clubs
import { useState, useEffect } from 'react';
import { db, isFirebaseConfigured } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import './Clubs.css';

const SAMPLE_CLUBS = [
    { id: 'c1', name: 'AI & ML Club', desc: 'Explore machine learning and AI applications.', emoji: '🤖', members: 120, grad: ['#7c3aed', '#4f46e5'], category: 'Tech' },
    { id: 'c2', name: 'Green Campus', desc: 'Sustainability and environmental advocacy on campus.', emoji: '🌱', members: 85, grad: ['#059669', '#10b981'], category: 'Environment' },
    { id: 'c3', name: 'Photography Club', desc: 'Weekly shoots, contests, and darkroom workshops.', emoji: '📷', members: 64, grad: ['#f59e0b', '#f97316'], category: 'Creative' },
    { id: 'c4', name: 'Debate Society', desc: 'Sharp your speaking and critical thinking skills.', emoji: '🎙️', members: 48, grad: ['#dc2626', '#f87171'], category: 'Soft Skills' },
    { id: 'c5', name: 'Coding League', desc: 'Competitive programming and hackathon prep.', emoji: '💻', members: 102, grad: ['#0369a1', '#38bdf8'], category: 'Tech' },
    { id: 'c6', name: 'Music Studio', desc: 'Band practice, sound design, open jam sessions.', emoji: '🎵', members: 56, grad: ['#7c3aed', '#c084fc'], category: 'Arts' },
];

export default function Clubs() {
    const [clubs, setClubs] = useState([]);
    const [cat, setCat] = useState('All');
    const [joined, setJoined] = useState({});

    useEffect(() => {
        if (!isFirebaseConfigured) { setClubs(SAMPLE_CLUBS); return; }
        async function load() {
            try {
                const snap = await getDocs(collection(db, 'clubs'));
                const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
                setClubs(data.length ? data : SAMPLE_CLUBS);
            } catch { setClubs(SAMPLE_CLUBS); }
        }
        load();
    }, []);

    const cats = ['All', ...new Set(clubs.map(c => c.category).filter(Boolean))];
    const filtered = cat === 'All' ? clubs : clubs.filter(c => c.category === cat);

    const toggleJoin = (id) => setJoined(j => ({ ...j, [id]: !j[id] }));

    return (
        <div className="page">
            <div className="page-banner">
                <h1>Active Clubs</h1>
                <p>{clubs.length} clubs — find your community.</p>
            </div>

            <div className="container clubs-body">
                <div className="clubs-filter">
                    {cats.map(c => (
                        <button key={c} className={`tag-filter ${cat === c ? 'active' : ''}`} onClick={() => setCat(c)}>{c}</button>
                    ))}
                </div>

                <div className="clubs-grid">
                    {filtered.map(club => (
                        <div key={club.id} className="club-cc-card">
                            <div className="club-cc-header" style={{
                                background: club.grad
                                    ? `linear-gradient(135deg, ${club.grad[0]}, ${club.grad[1]})`
                                    : 'linear-gradient(135deg, #7c3aed, #4f46e5)'
                            }}>
                                <span className="club-cc-emoji">{club.emoji || '🏛️'}</span>
                            </div>
                            <div className="club-cc-body">
                                <div className="club-cc-top">
                                    <h3>{club.name}</h3>
                                    {club.category && <span className="badge badge-purple">{club.category}</span>}
                                </div>
                                <p>{club.desc || club.description}</p>
                                <div className="club-cc-meta">
                                    <span className="text-gray">👥 {club.members || club.memberCount || 0} members</span>
                                    <button
                                        className={joined[club.id] ? 'btn-joined' : 'btn-primary'}
                                        style={{ padding: '7px 18px', fontSize: '0.82rem' }}
                                        onClick={() => toggleJoin(club.id)}
                                    >
                                        {joined[club.id] ? 'Joined ✓' : 'Join'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
