// App.jsx — ClubConnect Main Router
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import Discover from './pages/Discover';
import Clubs from './pages/Clubs';
import Requests from './pages/Requests';
import Leaderboard from './pages/Leaderboard';
import Admin from './pages/Admin';
import MyProfile from './pages/MyProfile';
import Login from './pages/Login';
import Signup from './pages/Signup';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/clubs" element={<Clubs />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected routes (require login) */}
          <Route path="/requests" element={
            <ProtectedRoute><Requests /></ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute><Admin /></ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute><MyProfile /></ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

