import { BrowserRouter, Link, Route, Routes, Navigate } from 'react-router-dom'
import './App.css'
import { AuthProvider, useAuth } from './auth'
import Login from './pages/Login'
import Home from './pages/Home'
import Friends from './pages/Friends'
import History from './pages/History'
import Wishlist from './pages/Wishlist'

function Nav() {
  const { user, logout } = useAuth()
  return (
    <nav style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Link to="/">Home</Link>
      <Link to="/friends">Friends</Link>
      <Link to="/history">History</Link>
      <Link to="/wishlist">Wishlist</Link>
      <span style={{ marginLeft: 'auto' }}>{user ? `@${user.username}` : ''}</span>
      {user && <button onClick={logout}>Logout</button>}
    </nav>
  )
}

function Guarded({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div style={{ padding: 16 }}>Loading...</div>
  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Guarded><Home /></Guarded>} />
          <Route path="/friends" element={<Guarded><Friends /></Guarded>} />
          <Route path="/history" element={<Guarded><History /></Guarded>} />
          <Route path="/wishlist" element={<Guarded><Wishlist /></Guarded>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
