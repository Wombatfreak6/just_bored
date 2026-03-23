import React from 'react';
import TypeBadge from './TypeBadge';

const MoveButtons = ({ moves, pp, onMoveSelect, onRun, disabled }) => {
    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
            marginTop: '10px',
        }}>
            {moves.map((move, i) => {
                const hasPP = pp[i] > 0;
                return (
                    <button
                        key={i}
                        onClick={() => !disabled && hasPP && onMoveSelect(i)}
                        disabled={disabled || !hasPP}
                        className="hover-glow"
                        aria-label={`Use ${move.name}`}
                        style={{
                            background: disabled ? 'rgba(30,30,60,0.5)' : 'var(--bg-panel)',
                            border: '3px solid',
                            borderColor: hasPP && !disabled ? 'var(--pixel-border)' : '#444',
                            padding: '10px',
                            cursor: disabled || !hasPP ? 'not-allowed' : 'pointer',
                            textAlign: 'left',
                            opacity: hasPP && !disabled ? 1 : 0.4,
                            transition: 'all 0.15s ease',
                            boxShadow: hasPP && !disabled
                                ? '3px 3px 0px rgba(255,215,0,0.2)'
                                : 'none',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px',
                        }}
                    >
                        <div style={{
                            fontFamily: "'Press Start 2P', cursive",
                            fontSize: '9px',
                            color: hasPP ? 'var(--text-primary)' : 'var(--text-dim)',
                            textTransform: 'uppercase',
                        }}>
                            {move.name}
                        </div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '6px',
                        }}>
                            <TypeBadge type={move.type} small />
                            <span style={{
                                fontFamily: "'Courier Prime', monospace",
                                fontSize: '12px',
                                color: pp[i] <= 2 ? 'var(--neon-red)' : 'var(--text-dim)',
                            }}>
                                PP {pp[i]}/{move.pp}
                            </span>
                        </div>
                    </button>
                );
            })}

            {/* Run Button */}
            <button
                onClick={() => !disabled && onRun?.()}
                disabled={disabled}
                className="hover-glow"
                aria-label="Run from battle"
                style={{
                    gridColumn: '1 / -1',
                    background: disabled ? 'rgba(30,30,60,0.5)' : 'rgba(255,61,61,0.05)',
                    border: '3px solid',
                    borderColor: disabled ? '#444' : 'var(--neon-red)',
                    padding: '8px',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    opacity: disabled ? 0.4 : 0.7,
                    fontFamily: "'Press Start 2P', cursive",
                    fontSize: '9px',
                    color: 'var(--neon-red)',
                    textTransform: 'uppercase',
                    transition: 'all 0.15s ease',
                }}
            >
                🏃 RUN
            </button>
        </div>
    );
};

export default MoveButtons;
