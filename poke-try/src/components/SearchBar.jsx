import React, { useState, useEffect, useRef } from 'react';

const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState('');
    const debounceRef = useRef(null);

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            onSearch(query);
        }, 400);

        return () => clearTimeout(debounceRef.current);
    }, [query, onSearch]);

    return (
        <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '500px',
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                background: 'var(--bg-panel)',
                border: '3px solid var(--pixel-border)',
                boxShadow: '4px 4px 0px rgba(255,215,0,0.2)',
                padding: '0 12px',
            }}>
                <span style={{
                    fontSize: '20px',
                    marginRight: '8px',
                    filter: 'grayscale(1) brightness(2)',
                }}>
                    🔍
                </span>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search Pokémon name or #..."
                    aria-label="Search Pokémon by name or number"
                    style={{
                        flex: 1,
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        color: 'var(--text-primary)',
                        fontFamily: "'VT323', monospace",
                        fontSize: '22px',
                        padding: '10px 0',
                        letterSpacing: '1px',
                    }}
                />
                {query && (
                    <button
                        onClick={() => setQuery('')}
                        aria-label="Clear search"
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--neon-red)',
                            cursor: 'pointer',
                            fontSize: '18px',
                            fontFamily: "'Press Start 2P', cursive",
                            padding: '4px',
                        }}
                    >
                        ✕
                    </button>
                )}
            </div>
        </div>
    );
};

export default SearchBar;
