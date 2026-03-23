import React from 'react';
import { TYPE_COLORS } from '../data/typeChart';

const TypeBadge = ({ type, small = false }) => {
    const color = TYPE_COLORS[type?.toLowerCase()] || '#A8A878';

    return (
        <span
            style={{
                display: 'inline-block',
                padding: small ? '2px 6px' : '3px 10px',
                fontSize: small ? '10px' : '12px',
                fontFamily: "'Press Start 2P', cursive",
                color: '#fff',
                backgroundColor: color,
                border: '2px solid rgba(255,255,255,0.2)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                textShadow: '1px 1px 0 rgba(0,0,0,0.5)',
                boxShadow: `2px 2px 0px rgba(0,0,0,0.3), inset 0 0 10px rgba(255,255,255,0.1)`,
            }}
        >
            {type}
        </span>
    );
};

export default TypeBadge;
