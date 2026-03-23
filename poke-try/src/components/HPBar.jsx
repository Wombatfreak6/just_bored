import React from 'react';

const HPBar = ({ current, max, showText = true, size = 'normal', animated = true }) => {
    const pct = max > 0 ? (current / max) * 100 : 0;

    const getColor = () => {
        if (pct > 50) return '#69D44B';
        if (pct > 20) return '#FFD700';
        return '#FF3D3D';
    };

    const height = size === 'small' ? '8px' : size === 'large' ? '18px' : '12px';
    const fontSize = size === 'small' ? '8px' : '10px';

    return (
        <div style={{ width: '100%' }}>
            {showText && (
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontFamily: "'Courier Prime', monospace",
                    fontSize,
                    marginBottom: '3px',
                    color: '#E8E8E8',
                }}>
                    <span style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '8px', color: '#FFD700' }}>HP</span>
                    <span>{current}/{max}</span>
                </div>
            )}
            <div
                style={{
                    width: '100%',
                    height,
                    background: '#1a1a2e',
                    border: '2px solid #333',
                    borderRadius: '1px',
                    overflow: 'hidden',
                    boxShadow: 'inset 0 0 5px rgba(0,0,0,0.5)',
                }}
                role="progressbar"
                aria-valuenow={current}
                aria-valuemin={0}
                aria-valuemax={max}
                aria-label={`HP: ${current} out of ${max}`}
            >
                <div
                    style={{
                        width: `${pct}%`,
                        height: '100%',
                        background: `linear-gradient(180deg, ${getColor()}, ${getColor()}aa)`,
                        transition: animated ? 'width 0.8s ease-out, background 0.3s' : 'none',
                        boxShadow: `0 0 8px ${getColor()}66`,
                    }}
                />
            </div>
        </div>
    );
};

export default HPBar;
