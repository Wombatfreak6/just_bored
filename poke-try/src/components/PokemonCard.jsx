import React, { useState } from 'react';
import TypeBadge from './TypeBadge';
import HPBar from './HPBar';

const PokemonCard = ({ pokemon, onClick }) => {
    const [showShiny, setShowShiny] = useState(false);
    const [imgLoaded, setImgLoaded] = useState(false);

    const sprite = showShiny
        ? pokemon.sprites?.front_shiny
        : pokemon.sprites?.front_default;

    const hasShiny = !!pokemon.sprites?.front_shiny;

    const dexNum = `#${String(pokemon.id).padStart(3, '0')}`;

    return (
        <div
            className="hover-glow"
            onClick={() => onClick?.(pokemon)}
            onKeyDown={(e) => e.key === 'Enter' && onClick?.(pokemon)}
            tabIndex={0}
            role="button"
            aria-label={`View ${pokemon.name} details`}
            style={{
                background: 'var(--bg-panel)',
                border: '3px solid var(--pixel-border)',
                boxShadow: '4px 4px 0px rgba(255,215,0,0.3), -2px -2px 0px rgba(255,215,0,0.15)',
                padding: '12px',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.2s ease',
            }}
        >
            {/* Dex Number */}
            <div style={{
                fontFamily: "'VT323', monospace",
                fontSize: '16px',
                color: 'var(--text-dim)',
                marginBottom: '4px',
            }}>
                {dexNum}
            </div>

            {/* Sprite */}
            <div style={{
                width: '100%',
                aspectRatio: '1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                background: 'radial-gradient(circle, rgba(255,215,0,0.05) 0%, transparent 70%)',
                marginBottom: '8px',
            }}>
                {!imgLoaded && (
                    <div className="pokeball-spinner" style={{ width: '32px', height: '32px', margin: '0 auto' }} />
                )}
                <img
                    src={sprite}
                    alt={pokemon.name}
                    className="pixel-sprite"
                    onLoad={() => setImgLoaded(true)}
                    style={{
                        width: '96px',
                        height: '96px',
                        display: imgLoaded ? 'block' : 'none',
                        filter: showShiny ? 'drop-shadow(0 0 6px rgba(255,215,0,0.5))' : 'none',
                    }}
                />
                {hasShiny && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowShiny(!showShiny);
                        }}
                        title={showShiny ? 'Show normal' : 'Show shiny'}
                        aria-label={showShiny ? 'Show normal sprite' : 'Show shiny sprite'}
                        style={{
                            position: 'absolute',
                            top: '2px',
                            right: '2px',
                            background: showShiny ? 'var(--neon-yellow)' : 'var(--bg-panel-2)',
                            border: '2px solid var(--neon-yellow)',
                            color: showShiny ? '#000' : 'var(--neon-yellow)',
                            cursor: 'pointer',
                            fontSize: '12px',
                            padding: '2px 4px',
                            fontFamily: "'VT323', monospace",
                            transition: 'all 0.2s',
                        }}
                    >
                        ✨
                    </button>
                )}
            </div>

            {/* Name */}
            <h3 style={{
                fontFamily: "'Press Start 2P', cursive",
                fontSize: '10px',
                color: 'var(--text-primary)',
                textTransform: 'uppercase',
                marginBottom: '8px',
                lineHeight: '1.4',
                minHeight: '28px',
                display: 'flex',
                alignItems: 'center',
            }}>
                {pokemon.name}
            </h3>

            {/* Type Badges */}
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '8px' }}>
                {pokemon.types.map(type => (
                    <TypeBadge key={type} type={type} small />
                ))}
            </div>

            {/* Mini HP bar */}
            <HPBar current={pokemon.stats.hp} max={255} showText={false} size="small" animated={false} />
        </div>
    );
};

export default PokemonCard;
