// pages/Leaderboard.jsx — Top contributors
import { useState, useEffect } from 'react';
import { db, isFirebaseConfigured } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const SAMPLE = [
    { id: 'l1', name: 'Arjun Kumar', initials: 'AK', color: '#7c3aed', skills: 12, exchanges: 48, points: 980 },
    { id: 'l2', name: 'Priya Sharma', initials: 'PS', color: '#059669', skills: 9, exchanges: 36, points: 845 },
    { id: 'l3', name: 'Rahul Verma', initials: 'RV', color: '#f59e0b', skills: 7, exchanges: 29, points: 712 },
    { id: 'l4', name: 'Sneha M.', initials: 'SM', color: '#dc2626', skills: 6, exchanges: 22, points: 634 },
    { id: 'l5', name: 'Dev Rajput', initials: 'DR', color: '#0369a1', skills: 5, exchanges: 18, points: 570 },
    { id: 'l6', name: 'Kay Patel', initials: 'KP', color: '#7c3aed', skills: 4, exchanges: 14, points: 480 },
];

const MEDALS = ['🥇', '🥈', '🥉'];

export default function Leaderboard() {
    const [data, setData] = useState([]);

    useEffect(() => {
        if (!isFirebaseConfigured) { setData(SAMPLE); return; }
        async function load() {
            try {
                const snap = await getDocs(collection(db, 'leaderboard'));
                const d = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
                    .sort((a, b) => (b.points || 0) - (a.points || 0));
                setData(d.length ? d : SAMPLE);
            } catch { setData(SAMPLE); }
        }
        load();
    }, []);

    return (
        <div className="page">
            <div className="page-banner">
                <h1>🏆 Leaderboard</h1>
                <p>Top students contributing to the ClubConnect community.</p>
            </div>

            <div className="container" style={{ padding: '48px 24px' }}>
                {/* Top 3 podium */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '48px', flexWrap: 'wrap' }}>
                    {data.slice(0, 3).map((u, i) => (
                        <div key={u.id} style={{
                            textAlign: 'center', background: 'var(--card-bg)',
                            border: '1.5px solid var(--border)', borderRadius: '20px',
                            padding: '28px 32px', minWidth: '160px',
                            boxShadow: 'var(--shadow-md)',
                            transform: i === 0 ? 'scale(1.08)' : 'none',
                            order: i === 0 ? 0 : i === 1 ? -1 : 1,
                        }}>
                            <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>{MEDALS[i]}</div>
                            <div className="avatar" style={{ background: u.color, margin: '0 auto 10px', width: '52px', height: '52px', fontSize: '1rem' }}>
                                {u.initials || u.name?.slice(0, 2).toUpperCase()}
                            </div>
                            <p style={{ fontWeight: 700, marginBottom: 4 }}>{u.name}</p>
                            <p style={{ color: 'var(--purple)', fontWeight: 800, fontSize: '1.3rem' }}>{u.points}</p>
                            <p style={{ fontSize: '0.78rem', color: 'var(--gray)' }}>points</p>
                        </div>
                    ))}
                </div>

                {/* Full Table */}
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div style={{
                        display: 'grid', gridTemplateColumns: '60px 1fr 90px 100px 90px',
                        padding: '12px 24px', background: 'var(--light-bg)',
                        borderBottom: '1px solid var(--border)',
                        fontSize: '0.8rem', fontWeight: 600, color: 'var(--gray)'
                    }}>
                        <span>Rank</span><span>Student</span><span>Skills</span><span>Exchanges</span><span>Points</span>
                    </div>
                    {data.map((u, i) => (
                        <div key={u.id} style={{
                            display: 'grid', gridTemplateColumns: '60px 1fr 90px 100px 90px',
                            padding: '14px 24px', borderBottom: i < data.length - 1 ? '1px solid var(--border)' : 'none',
                            alignItems: 'center', fontSize: '0.9rem',
                            background: i === 0 ? 'rgba(251,191,36,.05)' : i === 1 ? 'rgba(148,163,184,.04)' : i === 2 ? 'rgba(251,146,60,.04)' : ''
                        }}>
                            <span style={{ fontSize: '1.1rem' }}>{MEDALS[i] || i + 1}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 600 }}>
                                <div className="avatar" style={{ background: u.color || '#7c3aed', width: '34px', height: '34px', fontSize: '0.75rem' }}>
                                    {u.initials || u.name?.slice(0, 2).toUpperCase()}
                                </div>
                                {u.name}
                            </span>
                            <span>{u.skills}</span>
                            <span>{u.exchanges}</span>
                            <span style={{ fontWeight: 700, color: i === 0 ? 'var(--purple)' : i === 1 ? 'var(--green)' : i === 2 ? 'var(--orange)' : 'var(--red)' }}>
                                {u.points}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
