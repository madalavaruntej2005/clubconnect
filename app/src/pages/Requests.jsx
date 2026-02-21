// pages/Requests.jsx — Skill exchange requests
import { useState, useEffect } from 'react';
import { db, isFirebaseConfigured } from '../firebase';
import { collection, getDocs, addDoc, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

const SAMPLE = [
    { id: 'r1', from: 'Priya S', skill: 'UI/UX Design', message: 'Can you teach me Figma basics?', status: 'pending', createdAt: '2 hrs ago' },
    { id: 'r2', from: 'Rahul V', skill: 'React Dev', message: 'Need help with React hooks.', status: 'accepted', createdAt: '1 day ago' },
    { id: 'r3', from: 'Dev R', skill: 'Photography', message: 'Want to learn portrait lighting.', status: 'pending', createdAt: '3 days ago' },
];

export default function Requests() {
    const { user } = useAuth();
    const [requests, setRequests] = useState([]);
    const [toast, setToast] = useState('');

    useEffect(() => {
        if (!isFirebaseConfigured) { setRequests(SAMPLE); return; }
        async function load() {
            try {
                const snap = await getDocs(collection(db, 'requests'));
                const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
                setRequests(data.length ? data : SAMPLE);
            } catch { setRequests(SAMPLE); }
        }
        load();
    }, []);

    const showToast = (msg, type = '') => {
        setToast({ msg, type });
        setTimeout(() => setToast(''), 3000);
    };

    const handleStatus = async (id, status) => {
        try {
            const docRef = doc(db, 'requests', id);
            await updateDoc(docRef, { status });
            setRequests(reqs => reqs.map(r => r.id === id ? { ...r, status } : r));
            showToast(status === 'accepted' ? '✅ Request accepted!' : '❌ Request declined.', status === 'accepted' ? 'success' : 'error');
        } catch {
            setRequests(reqs => reqs.map(r => r.id === id ? { ...r, status } : r));
            showToast(status === 'accepted' ? '✅ Request accepted!' : '❌ Request declined.', status === 'accepted' ? 'success' : 'error');
        }
    };

    const statusBadge = (s) => {
        if (s === 'accepted') return <span className="badge badge-green">Accepted</span>;
        if (s === 'declined') return <span className="badge badge-red">Declined</span>;
        return <span className="badge badge-orange">Pending</span>;
    };

    return (
        <div className="page">
            <div className="page-banner">
                <h1>Skill Exchange Requests</h1>
                <p>Manage your incoming and outgoing skill exchange requests.</p>
            </div>

            <div className="container" style={{ padding: '48px 24px' }}>
                {requests.length === 0 && (
                    <p className="text-gray" style={{ textAlign: 'center', padding: '60px 0' }}>No requests yet.</p>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {requests.map(r => (
                        <div key={r.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                            <div className="avatar" style={{ background: 'var(--purple)' }}>
                                {r.from?.slice(0, 2).toUpperCase() || 'CC'}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                                    <span style={{ fontWeight: 700 }}>{r.from}</span>
                                    <span className="badge badge-purple">{r.skill}</span>
                                    {statusBadge(r.status)}
                                </div>
                                <p style={{ fontSize: '0.9rem', color: 'var(--gray)', marginBottom: '4px' }}>{r.message}</p>
                                <span style={{ fontSize: '0.78rem', color: 'var(--gray)' }}>{r.createdAt || ''}</span>
                            </div>
                            {r.status === 'pending' && (
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.82rem' }}
                                        onClick={() => handleStatus(r.id, 'accepted')}>Accept</button>
                                    <button className="btn-danger" onClick={() => handleStatus(r.id, 'declined')}>Decline</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
        </div>
    );
}
