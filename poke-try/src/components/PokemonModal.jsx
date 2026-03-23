import React, { useEffect, useState } from 'react';
import TypeBadge from './TypeBadge';
import HPBar from './HPBar';
import { usePokemon } from '../hooks/usePokemon';

const STAT_NAMES = {
    hp: 'HP',
    attack: 'ATK',
    defense: 'DEF',
    spAtk: 'SP.ATK',
    spDef: 'SP.DEF',
    speed: 'SPD',
};

const STAT_COLORS = {
    hp: '#FF3D3D',
    attack: '#FF6B35',
    defense: '#4FC3F7',
    spAtk: '#FF6AC1',
    spDef: '#69D44B',
    speed: '#FFD700',
};

const PokemonModal = ({ pokemon, onClose, onSendToBattle }) => {
    const { fetchSpeciesData, fetchEvolutionChain, fetchPokemonDetail } = usePokemon();
    const [species, setSpecies] = useState(null);
    const [evolutionChain, setEvolutionChain] = useState([]);
    const [evoSprites, setEvoSprites] = useState({});
    const [showShiny, setShowShiny] = useState(false);
    const [animateStats, setAnimateStats] = useState(false);

    useEffect(() => {
        if (!pokemon) return;
        setAnimateStats(false);
        const timer = setTimeout(() => setAnimateStats(true), 100);

        // Fetch species and evolution data
        const loadData = async () => {
            try {
                const speciesData = await fetchSpeciesData(pokemon.speciesUrl);
                setSpecies(speciesData);

                if (speciesData.evolutionChainUrl) {
                    const chain = await fetchEvolutionChain(speciesData.evolutionChainUrl);
                    setEvolutionChain(chain);

                    // Fetch sprites for each evo
                    const sprites = {};
                    for (const evo of chain) {
                        try {
                            const detail = await fetchPokemonDetail(evo.name);
                            sprites[evo.name] = detail.sprites.front_default;
                        } catch { /* skip */ }
                    }
                    setEvoSprites(sprites);
                }
            } catch { /* non-critical */ }
        };

        loadData();
        return () => clearTimeout(timer);
    }, [pokemon, fetchSpeciesData, fetchEvolutionChain, fetchPokemonDetail]);

    if (!pokemon) return null;

    const sprite = showShiny
        ? pokemon.sprites?.other?.['official-artwork']?.front_shiny || pokemon.sprites?.front_shiny
        : pokemon.sprites?.other?.['official-artwork']?.front_default || pokemon.sprites?.front_default;

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.85)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9000,
                padding: '20px',
                backdropFilter: 'blur(4px)',
            }}
            onClick={onClose}
        >
            <div
                onClick={e => e.stopPropagation()}
                className="crt-screen"
                style={{
                    background: 'var(--bg-panel)',
                    border: '3px solid var(--pixel-border)',
                    boxShadow: '6px 6px 0px rgba(255,215,0,0.3), -3px -3px 0px rgba(255,215,0,0.15), 0 0 40px rgba(255,215,0,0.1)',
                    maxWidth: '700px',
                    width: '100%',
                    maxHeight: '90vh',
                    overflow: 'auto',
                    padding: '24px',
                    position: 'relative',
                }}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    aria-label="Close modal"
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: 'none',
                        border: '2px solid var(--neon-red)',
                        color: 'var(--neon-red)',
                        fontFamily: "'Press Start 2P', cursive",
                        fontSize: '10px',
                        padding: '6px 10px',
                        cursor: 'pointer',
                        zIndex: 2,
                    }}
                >
                    ✕
                </button>

                {/* Header */}
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '20px' }}>
                    {/* Sprite */}
                    <div style={{
                        flex: '0 0 auto',
                        textAlign: 'center',
                        position: 'relative',
                    }}>
                        <div style={{
                            width: '160px',
                            height: '160px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'radial-gradient(circle, rgba(255,215,0,0.08) 0%, transparent 70%)',
                            border: '2px solid rgba(255,215,0,0.2)',
                        }}>
                            <img
                                src={sprite}
                                alt={pokemon.name}
                                className="pixel-sprite"
                                style={{
                                    width: '140px',
                                    height: '140px',
                                    objectFit: 'contain',
                                    filter: showShiny ? 'drop-shadow(0 0 8px rgba(255,215,0,0.6))' : 'none',
                                }}
                            />
                        </div>
                        <button
                            onClick={() => setShowShiny(!showShiny)}
                            className="btn-pixel"
                            style={{ marginTop: '8px', fontSize: '8px', padding: '6px 10px' }}
                        >
                            {showShiny ? '★ SHINY' : '☆ NORMAL'}
                        </button>
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: '200px' }}>
                        <div style={{ color: 'var(--text-dim)', fontFamily: "'VT323', monospace", fontSize: '18px' }}>
                            #{String(pokemon.id).padStart(3, '0')}
                        </div>
                        <h2 style={{
                            fontFamily: "'Press Start 2P', cursive",
                            fontSize: '16px',
                            color: 'var(--neon-yellow)',
                            textTransform: 'uppercase',
                            margin: '4px 0 12px',
                            textShadow: '0 0 10px rgba(255,215,0,0.3)',
                        }}>
                            {pokemon.name}
                        </h2>

                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
                            {pokemon.types.map(t => <TypeBadge key={t} type={t} />)}
                        </div>

                        {species?.flavorText && (
                            <p style={{
                                fontFamily: "'VT323', monospace",
                                fontSize: '16px',
                                color: 'var(--text-dim)',
                                lineHeight: '1.4',
                                marginBottom: '12px',
                            }}>
                                {species.flavorText}
                            </p>
                        )}

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '6px',
                            fontFamily: "'VT323', monospace",
                            fontSize: '16px',
                        }}>
                            <div><span style={{ color: 'var(--text-dim)' }}>Height:</span> {pokemon.height / 10}m</div>
                            <div><span style={{ color: 'var(--text-dim)' }}>Weight:</span> {pokemon.weight / 10}kg</div>
                            <div><span style={{ color: 'var(--text-dim)' }}>Base XP:</span> {pokemon.baseExperience}</div>
                            <div>
                                <span style={{ color: 'var(--text-dim)' }}>Abilities:</span>{' '}
                                {pokemon.abilities.join(', ')}
                            </div>
                        </div>

                        {species && (
                            <div style={{ marginTop: '8px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {species.isLegendary && (
                                    <span style={{
                                        fontFamily: "'Press Start 2P', cursive",
                                        fontSize: '8px',
                                        padding: '4px 8px',
                                        background: 'rgba(255,215,0,0.2)',
                                        border: '2px solid var(--neon-yellow)',
                                        color: 'var(--neon-yellow)',
                                    }}>
                                        ★ LEGENDARY
                                    </span>
                                )}
                                {species.isMythical && (
                                    <span style={{
                                        fontFamily: "'Press Start 2P', cursive",
                                        fontSize: '8px',
                                        padding: '4px 8px',
                                        background: 'rgba(255,106,193,0.2)',
                                        border: '2px solid var(--type-psychic)',
                                        color: 'var(--type-psychic)',
                                    }}>
                                        ✦ MYTHICAL
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Stats */}
                <div style={{
                    background: 'rgba(0,0,0,0.3)',
                    border: '2px solid rgba(255,215,0,0.2)',
                    padding: '16px',
                    marginBottom: '16px',
                }}>
                    <h3 style={{
                        fontFamily: "'Press Start 2P', cursive",
                        fontSize: '10px',
                        color: 'var(--neon-yellow)',
                        marginBottom: '12px',
                    }}>
                        BASE STATS
                    </h3>
                    {Object.entries(pokemon.stats).map(([key, value]) => (
                        <div key={key} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            marginBottom: '8px',
                        }}>
                            <span style={{
                                fontFamily: "'Press Start 2P', cursive",
                                fontSize: '8px',
                                color: STAT_COLORS[key],
                                width: '50px',
                                textAlign: 'right',
                            }}>
                                {STAT_NAMES[key]}
                            </span>
                            <span style={{
                                fontFamily: "'Courier Prime', monospace",
                                fontSize: '14px',
                                width: '35px',
                                textAlign: 'right',
                                fontWeight: 'bold',
                            }}>
                                {value}
                            </span>
                            <div style={{
                                flex: 1,
                                height: '10px',
                                background: '#1a1a2e',
                                border: '1px solid #333',
                                overflow: 'hidden',
                            }}>
                                <div style={{
                                    width: animateStats ? `${(value / 255) * 100}%` : '0%',
                                    height: '100%',
                                    background: `linear-gradient(90deg, ${STAT_COLORS[key]}, ${STAT_COLORS[key]}88)`,
                                    transition: 'width 0.8s ease-out',
                                    boxShadow: `0 0 6px ${STAT_COLORS[key]}44`,
                                }} />
                            </div>
                        </div>
                    ))}
                    <div style={{
                        borderTop: '1px solid rgba(255,215,0,0.2)',
                        marginTop: '8px',
                        paddingTop: '8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                    }}>
                        <span style={{
                            fontFamily: "'Press Start 2P', cursive",
                            fontSize: '8px',
                            color: 'var(--text-dim)',
                        }}>
                            TOTAL
                        </span>
                        <span style={{
                            fontFamily: "'Courier Prime', monospace",
                            fontSize: '16px',
                            fontWeight: 'bold',
                            color: 'var(--neon-yellow)',
                        }}>
                            {pokemon.totalStats}
                        </span>
                    </div>
                </div>

                {/* Evolution Chain */}
                {evolutionChain.length > 1 && (
                    <div style={{
                        background: 'rgba(0,0,0,0.3)',
                        border: '2px solid rgba(255,215,0,0.2)',
                        padding: '16px',
                        marginBottom: '16px',
                    }}>
                        <h3 style={{
                            fontFamily: "'Press Start 2P', cursive",
                            fontSize: '10px',
                            color: 'var(--neon-yellow)',
                            marginBottom: '12px',
                        }}>
                            EVOLUTION CHAIN
                        </h3>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            flexWrap: 'wrap',
                        }}>
                            {evolutionChain.map((evo, i) => (
                                <React.Fragment key={evo.name}>
                                    <div style={{
                                        textAlign: 'center',
                                        padding: '8px',
                                        background: evo.name === pokemon.name ? 'rgba(255,215,0,0.1)' : 'transparent',
                                        border: evo.name === pokemon.name ? '2px solid var(--neon-yellow)' : '2px solid transparent',
                                    }}>
                                        {evoSprites[evo.name] && (
                                            <img
                                                src={evoSprites[evo.name]}
                                                alt={evo.name}
                                                className="pixel-sprite"
                                                style={{ width: '48px', height: '48px' }}
                                            />
                                        )}
                                        <div style={{
                                            fontFamily: "'Press Start 2P', cursive",
                                            fontSize: '7px',
                                            textTransform: 'uppercase',
                                            color: evo.name === pokemon.name ? 'var(--neon-yellow)' : 'var(--text-dim)',
                                            marginTop: '4px',
                                        }}>
                                            {evo.name}
                                        </div>
                                        {evo.minLevel && (
                                            <div style={{
                                                fontFamily: "'VT323', monospace",
                                                fontSize: '12px',
                                                color: 'var(--text-dim)',
                                            }}>
                                                Lv.{evo.minLevel}
                                            </div>
                                        )}
                                    </div>
                                    {i < evolutionChain.length - 1 && (
                                        <span style={{
                                            fontFamily: "'Press Start 2P', cursive",
                                            fontSize: '12px',
                                            color: 'var(--neon-yellow)',
                                        }}>
                                            →
                                        </span>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                )}

                {/* Send to Battle */}
                <button
                    onClick={() => onSendToBattle?.(pokemon)}
                    className="btn-pixel"
                    style={{
                        width: '100%',
                        padding: '14px',
                        fontSize: '12px',
                        background: 'rgba(255,61,61,0.1)',
                        borderColor: 'var(--neon-red)',
                        color: 'var(--neon-red)',
                        boxShadow: '4px 4px 0px rgba(255,61,61,0.3)',
                    }}
                >
                    SEND TO BATTLE
                </button>
            </div>
        </div>
    );
};

export default PokemonModal;
