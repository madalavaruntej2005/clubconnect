// pages/Home.jsx — ClubConnect Home Page
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const stats = [
    { value: 1240, label: 'Students', color: 'purple' },
    { value: 38, label: 'Active Clubs', color: 'green' },
    { value: 860, label: 'Skills Listed', color: 'orange' },
    { value: 412, label: 'Exchanges Done', color: 'red' },
];

function useCounter(ref, target, duration = 1800) {
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        let start = 0;
        const step = Math.ceil(target / (duration / 16));
        const obs = new IntersectionObserver(([e]) => {
            if (!e.isIntersecting) return;
            const timer = setInterval(() => {
                start = Math.min(start + step, target);
                el.textContent = start.toLocaleString();
                if (start >= target) clearInterval(timer);
            }, 16);
            obs.disconnect();
        }, { threshold: 0.5 });
        obs.observe(el);
        return () => obs.disconnect();
    }, [ref, target, duration]);
}

function StatItem({ value, label, color }) {
    const ref = useRef(null);
    useCounter(ref, value);
    return (
        <div className="home-stat">
            <span ref={ref} className={`home-stat-num ${color}`}>0</span>
            <span className="home-stat-label">{label}</span>
        </div>
    );
}

export default function Home() {
    return (
        <main className="home-page">
            {/* Hero */}
            <section className="home-hero">
                <div className="home-badge">
                    <span className="home-badge-dot" /> Now live at your college
                </div>
                <h1 className="home-title">
                    Learn. Teach.<br />
                    <span className="accent-purple">Grow</span> together with<br />
                    <span className="accent-green">ClubConnect</span>
                </h1>
                <p className="home-sub">
                    Connect with peers across clubs, showcase your skills, and build a<br />
                    reputation that follows you beyond campus. Built on React + Firebase.
                </p>
                <div className="home-cta">
                    <Link to="/discover" className="btn-primary">
                        <span className="cta-dot" /> Discover Skills
                    </Link>
                    <Link to="/clubs" className="btn-secondary">Browse Clubs →</Link>
                </div>

                {/* Stats */}
                <div className="home-stats">
                    {stats.map((s, i) => (
                        <div key={i} className="home-stat-wrap">
                            {i > 0 && <div className="home-stat-divider" />}
                            <StatItem {...s} />
                        </div>
                    ))}
                </div>
            </section>

            {/* Features */}
            <section className="home-features">
                <div className="container">
                    <div className="section-badge-cc">Why ClubConnect?</div>
                    <h2 className="section-h2">Everything you need to <span className="accent-purple">grow</span></h2>
                    <div className="features-grid">
                        {[
                            { icon: '🎯', title: 'Skill Exchange', desc: 'Post what you can teach, find what you want to learn.', color: '#ede9fe' },
                            { icon: '🏛️', title: 'Club Discovery', desc: 'Browse 38+ active clubs and find your community.', color: '#dcfce7' },
                            { icon: '🏆', title: 'Leaderboard', desc: 'Earn points for every skill exchanged and climb the ranks.', color: '#fef3c7' },
                            { icon: '🤝', title: 'Smart Matching', desc: 'Our algorithm connects you with the perfect skill buddy.', color: '#fee2e2' },
                        ].map((f, i) => (
                            <div key={i} className="feature-card">
                                <div className="feature-icon" style={{ background: f.color }}>{f.icon}</div>
                                <h3>{f.title}</h3>
                                <p>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="home-cta-band">
                <h2>Ready to grow with ClubConnect?</h2>
                <p>Join thousands of students already sharing skills on campus.</p>
                <Link to="/signup" className="btn-primary">Get Started Free →</Link>
            </section>
        </main>
    );
}
