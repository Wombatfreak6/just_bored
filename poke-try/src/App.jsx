import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Pokedex from './pages/Pokedex';
import Battle from './pages/Battle';
import './index.css';

function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Navigation */}
        <nav style={{
          background: 'var(--bg-panel)',
          borderBottom: '3px solid var(--pixel-border)',
          boxShadow: '0 4px 0px rgba(255,215,0,0.15), 0 0 20px rgba(255,215,0,0.05)',
          padding: '0 20px',
          position: 'sticky',
          top: 0,
          zIndex: 8000,
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
          }}>
            {/* Logo */}
            <div style={{
              fontFamily: "'Press Start 2P', cursive",
              fontSize: '10px',
              color: 'var(--neon-yellow)',
              padding: '14px 0',
              textShadow: '0 0 10px rgba(255,215,0,0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <span style={{ color: 'var(--neon-red)' }}>POKÉCENTRE</span>
            </div>

            {/* Nav Links */}
            <div style={{
              display: 'flex',
              gap: '0',
            }}>
              <NavLink
                to="/"
                style={({ isActive }) => ({
                  fontFamily: "'Press Start 2P', cursive",
                  fontSize: '9px',
                  color: isActive ? 'var(--neon-yellow)' : 'var(--text-dim)',
                  padding: '14px 16px',
                  borderBottom: isActive ? '3px solid var(--neon-yellow)' : '3px solid transparent',
                  transition: 'all 0.2s',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                })}
              >

                POKÉDEX
              </NavLink>

              <NavLink
                to="/battle"
                style={({ isActive }) => ({
                  fontFamily: "'Press Start 2P', cursive",
                  fontSize: '9px',
                  color: isActive ? 'var(--neon-yellow)' : 'var(--text-dim)',
                  padding: '14px 16px',
                  borderBottom: isActive ? '3px solid var(--neon-yellow)' : '3px solid transparent',
                  transition: 'all 0.2s',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                })}
              >

                BATTLE
              </NavLink>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main style={{ flex: 1, paddingBottom: '80px' }}>
          <Routes>
            <Route path="/" element={<Pokedex />} />
            <Route path="/battle" element={<Battle />} />
          </Routes>
        </main>

        {/* Mobile Bottom Nav */}
        <nav className="mobile-nav" style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'var(--bg-panel)',
          borderTop: '3px solid var(--pixel-border)',
          display: 'none',
          justifyContent: 'space-around',
          padding: '8px 0',
          zIndex: 8000,
        }}>
          <NavLink
            to="/"
            style={({ isActive }) => ({
              fontFamily: "'Press Start 2P', cursive",
              fontSize: '7px',
              color: isActive ? 'var(--neon-yellow)' : 'var(--text-dim)',
              textDecoration: 'none',
              textAlign: 'center',
              padding: '6px 12px',
            })}
          >

            DEX
          </NavLink>
          <NavLink
            to="/battle"
            style={({ isActive }) => ({
              fontFamily: "'Press Start 2P', cursive",
              fontSize: '7px',
              color: isActive ? 'var(--neon-yellow)' : 'var(--text-dim)',
              textDecoration: 'none',
              textAlign: 'center',
              padding: '6px 12px',
            })}
          >

            BATTLE
          </NavLink>
        </nav>

        {/* Footer Glow Line */}
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, transparent, var(--neon-yellow), transparent)',
          opacity: 0.4,
          pointerEvents: 'none',
        }} />
      </div>

      {/* CSS for mobile nav */}
      <style>{`
        @media (max-width: 768px) {
          .mobile-nav {
            display: flex !important;
          }
        }
      `}</style>
    </Router>
  );
}

export default App;
