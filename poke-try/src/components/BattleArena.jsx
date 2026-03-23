import React, { useEffect, useState } from 'react';
import HPBar from './HPBar';
import BattleLog from './BattleLog';
import MoveButtons from './MoveButtons';
import TypeBadge from './TypeBadge';
import { usePokemon } from '../hooks/usePokemon';
import { useBattle } from '../hooks/useBattle';

const POPULAR_POKEMON = [
    { name: 'charizard', id: 6 },
    { name: 'blastoise', id: 9 },
    { name: 'venusaur', id: 3 },
    { name: 'pikachu', id: 25 },
    { name: 'arcanine', id: 59 },
    { name: 'gengar', id: 94 },
    { name: 'dragonite', id: 149 },
    { name: 'mewtwo', id: 150 },
    { name: 'gyarados', id: 130 },
    { name: 'alakazam', id: 65 },
];

const BattleArena = ({ preSelectedPokemon }) => {
    const { fetchPokemonDetail } = usePokemon();
    const battle = useBattle();
    const [playerChoice, setPlayerChoice] = useState(null);
    const [opponentChoice, setOpponentChoice] = useState(null);
    const [availablePokemon, setAvailablePokemon] = useState([]);
    const [loadingSetup, setLoadingSetup] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Load popular Pokémon for setup
    useEffect(() => {
        const loadPokemon = async () => {
            setLoadingSetup(true);
            try {
                const details = await Promise.all(
                    POPULAR_POKEMON.map(p => fetchPokemonDetail(p.name))
                );
                setAvailablePokemon(details);

                // Set defaults
                if (preSelectedPokemon) {
                    setPlayerChoice(preSelectedPokemon);
                } else {
                    setPlayerChoice(details.find(d => d.name === 'charizard') || details[0]);
                }
                setOpponentChoice(details.find(d => d.name === 'blastoise') || details[1]);
            } catch (err) {
                console.error('Failed to load battle Pokémon:', err);
            }
            setLoadingSetup(false);
        };
        loadPokemon();
    }, [fetchPokemonDetail, preSelectedPokemon]);

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        try {
            const detail = await fetchPokemonDetail(searchQuery.toLowerCase().trim());
            if (detail && !availablePokemon.find(p => p.id === detail.id)) {
                setAvailablePokemon(prev => [...prev, detail]);
            }
            setPlayerChoice(detail);
        } catch { /* ignore */ }
    };

    const startBattle = async () => {
        if (!playerChoice || !opponentChoice) return;
        const result = battle.initBattle(playerChoice, opponentChoice);
        // Small delay then start intro
        await new Promise(r => setTimeout(r, 200));
        battle.startIntro(playerChoice, opponentChoice);
    };

    // Setup Screen
    if (battle.phase === 'setup') {
        if (loadingSetup) {
            return (
                <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                    <div className="pokeball-spinner" />
                    <p style={{
                        fontFamily: "'Press Start 2P', cursive",
                        fontSize: '10px',
                        color: 'var(--neon-yellow)',
                        marginTop: '20px',
                    }}>
                        LOADING BATTLE DATA...
                    </p>
                </div>
            );
        }

        return (
            <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
                <h2 style={{
                    fontFamily: "'Press Start 2P', cursive",
                    fontSize: '16px',
                    textAlign: 'center',
                    color: 'var(--neon-red)',
                    marginBottom: '30px',
                    textShadow: '0 0 10px rgba(255,61,61,0.4)',
                }}>
                    BATTLE SETUP
                </h2>

                {/* Search */}
                <div style={{
                    display: 'flex',
                    gap: '8px',
                    marginBottom: '20px',
                    maxWidth: '400px',
                    margin: '0 auto 20px',
                }}>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSearch()}
                        placeholder="Add Pokémon by name..."
                        aria-label="Search Pokémon to add to battle"
                        style={{
                            flex: 1,
                            background: 'var(--bg-panel)',
                            border: '2px solid var(--pixel-border)',
                            color: 'var(--text-primary)',
                            fontFamily: "'VT323', monospace",
                            fontSize: '18px',
                            padding: '8px 12px',
                        }}
                    />
                    <button onClick={handleSearch} className="btn-pixel" style={{ fontSize: '8px' }}>
                        ADD
                    </button>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto 1fr',
                    gap: '20px',
                    alignItems: 'start',
                }}>
                    {/* Player Side */}
                    <div>
                        <h3 style={{
                            fontFamily: "'Press Start 2P', cursive",
                            fontSize: '10px',
                            color: 'var(--neon-blue)',
                            marginBottom: '12px',
                            textAlign: 'center',
                        }}>
                            YOUR POKÉMON
                        </h3>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
                            gap: '6px',
                        }}>
                            {availablePokemon.map(p => (
                                <button
                                    key={p.id}
                                    onClick={() => setPlayerChoice(p)}
                                    style={{
                                        background: playerChoice?.id === p.id ? 'rgba(79,195,247,0.15)' : 'var(--bg-panel)',
                                        border: `2px solid ${playerChoice?.id === p.id ? 'var(--neon-blue)' : '#333'}`,
                                        padding: '6px',
                                        cursor: 'pointer',
                                        textAlign: 'center',
                                        transition: 'all 0.15s',
                                    }}
                                >
                                    <img
                                        src={p.sprites?.front_default}
                                        alt={p.name}
                                        className="pixel-sprite"
                                        style={{ width: '48px', height: '48px' }}
                                    />
                                    <div style={{
                                        fontFamily: "'Press Start 2P', cursive",
                                        fontSize: '6px',
                                        color: playerChoice?.id === p.id ? 'var(--neon-blue)' : 'var(--text-dim)',
                                        textTransform: 'uppercase',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    }}>
                                        {p.name}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* VS */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingTop: '40px',
                    }}>
                        <span style={{
                            fontFamily: "'Press Start 2P', cursive",
                            fontSize: '24px',
                            color: 'var(--neon-red)',
                            textShadow: '0 0 15px rgba(255,61,61,0.5)',
                        }}>
                            VS
                        </span>
                    </div>

                    {/* Opponent Side */}
                    <div>
                        <h3 style={{
                            fontFamily: "'Press Start 2P', cursive",
                            fontSize: '10px',
                            color: 'var(--neon-red)',
                            marginBottom: '12px',
                            textAlign: 'center',
                        }}>
                            OPPONENT
                        </h3>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
                            gap: '6px',
                        }}>
                            {availablePokemon.map(p => (
                                <button
                                    key={p.id}
                                    onClick={() => setOpponentChoice(p)}
                                    style={{
                                        background: opponentChoice?.id === p.id ? 'rgba(255,61,61,0.15)' : 'var(--bg-panel)',
                                        border: `2px solid ${opponentChoice?.id === p.id ? 'var(--neon-red)' : '#333'}`,
                                        padding: '6px',
                                        cursor: 'pointer',
                                        textAlign: 'center',
                                        transition: 'all 0.15s',
                                    }}
                                >
                                    <img
                                        src={p.sprites?.front_default}
                                        alt={p.name}
                                        className="pixel-sprite"
                                        style={{ width: '48px', height: '48px' }}
                                    />
                                    <div style={{
                                        fontFamily: "'Press Start 2P', cursive",
                                        fontSize: '6px',
                                        color: opponentChoice?.id === p.id ? 'var(--neon-red)' : 'var(--text-dim)',
                                        textTransform: 'uppercase',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    }}>
                                        {p.name}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Selected Preview */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '40px',
                    margin: '30px 0',
                    flexWrap: 'wrap',
                }}>
                    {playerChoice && (
                        <div style={{ textAlign: 'center' }}>
                            <img
                                src={playerChoice.sprites?.front_default}
                                alt={playerChoice.name}
                                className="pixel-sprite"
                                style={{ width: '96px', height: '96px', filter: 'drop-shadow(0 0 10px rgba(79,195,247,0.4))' }}
                            />
                            <div style={{
                                fontFamily: "'Press Start 2P', cursive",
                                fontSize: '10px',
                                color: 'var(--neon-blue)',
                                textTransform: 'uppercase',
                            }}>
                                {playerChoice.name}
                            </div>
                            <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', marginTop: '4px' }}>
                                {playerChoice.types.map(t => <TypeBadge key={t} type={t} small />)}
                            </div>
                        </div>
                    )}

                    {opponentChoice && (
                        <div style={{ textAlign: 'center' }}>
                            <img
                                src={opponentChoice.sprites?.front_default}
                                alt={opponentChoice.name}
                                className="pixel-sprite"
                                style={{ width: '96px', height: '96px', filter: 'drop-shadow(0 0 10px rgba(255,61,61,0.4))' }}
                            />
                            <div style={{
                                fontFamily: "'Press Start 2P', cursive",
                                fontSize: '10px',
                                color: 'var(--neon-red)',
                                textTransform: 'uppercase',
                            }}>
                                {opponentChoice.name}
                            </div>
                            <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', marginTop: '4px' }}>
                                {opponentChoice.types.map(t => <TypeBadge key={t} type={t} small />)}
                            </div>
                        </div>
                    )}
                </div>

                {/* FIGHT Button */}
                <div style={{ textAlign: 'center' }}>
                    <button
                        onClick={startBattle}
                        disabled={!playerChoice || !opponentChoice}
                        className="btn-pixel"
                        style={{
                            fontSize: '14px',
                            padding: '16px 40px',
                            borderColor: 'var(--neon-red)',
                            color: 'var(--neon-red)',
                            background: 'rgba(255,61,61,0.1)',
                            boxShadow: '6px 6px 0px rgba(255,61,61,0.3), 0 0 20px rgba(255,61,61,0.1)',
                            letterSpacing: '3px',
                        }}
                    >
                        FIGHT!
                    </button>
                </div>
            </div>
        );
    }

    // Battle Arena
    const isPlayerTurn = battle.phase === 'player_turn';
    const isAnimating = battle.phase === 'animating' || battle.phase === 'ai_turn' || battle.phase === 'intro';
    const battleOver = battle.phase === 'result';

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '10px', position: 'relative' }}>
            {/* Critical Hit Flash */}
            {battle.criticalHit && <div className="screen-flash" />}

            {/* Battle Arena */}
            <div className="crt-screen" style={{
                background: 'linear-gradient(180deg, #1a0a2e 0%, #0a1628 40%, #0a2818 80%, #0a1a10 100%)',
                border: '3px solid var(--pixel-border)',
                boxShadow: '6px 6px 0px rgba(255,215,0,0.2)',
                padding: '20px',
                minHeight: '320px',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* Parallax background elements */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `
            radial-gradient(circle at 20% 30%, rgba(255,107,53,0.1) 0%, transparent 40%),
            radial-gradient(circle at 80% 70%, rgba(79,195,247,0.08) 0%, transparent 40%)
          `,
                    pointerEvents: 'none',
                }} />

                {/* Battle field ground */}
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '40%',
                    background: 'linear-gradient(180deg, transparent, rgba(0,100,0,0.15))',
                    pointerEvents: 'none',
                }} />

                {/* Opponent Section (top) */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '20px',
                    position: 'relative',
                    zIndex: 2,
                }}>
                    {/* Opponent Info */}
                    <div style={{
                        background: 'rgba(0,0,0,0.6)',
                        border: '2px solid var(--neon-red)',
                        padding: '10px 14px',
                        minWidth: '220px',
                        boxShadow: '3px 3px 0px rgba(255,61,61,0.2)',
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '6px',
                        }}>
                            <span style={{
                                fontFamily: "'Press Start 2P', cursive",
                                fontSize: '9px',
                                color: 'var(--neon-red)',
                            }}>
                                {battle.opponentPokemon?.name?.toUpperCase()}
                            </span>
                            <span style={{
                                fontFamily: "'VT323', monospace",
                                fontSize: '14px',
                                color: 'var(--text-dim)',
                            }}>
                                Lv50
                            </span>
                        </div>
                        <HPBar current={battle.opponentHP} max={battle.opponentMaxHP} size="normal" />
                        {battle.opponentStatus && (
                            <span style={{
                                fontFamily: "'Press Start 2P', cursive",
                                fontSize: '7px',
                                color: battle.opponentStatus === 'burn' ? '#FF6B35' : '#FFD700',
                                marginTop: '4px',
                                display: 'block',
                            }}>
                                {battle.opponentStatus === 'burn' ? 'BRN' : 'PAR'}
                            </span>
                        )}
                    </div>

                    {/* Opponent Sprite */}
                    <div className={battle.opponentFainted ? 'faint-animation' : ''} style={{
                        position: 'relative',
                    }}>
                        <img
                            src={battle.opponentPokemon?.sprites?.front_default}
                            alt={battle.opponentPokemon?.name}
                            className="pixel-sprite"
                            style={{
                                width: '120px',
                                height: '120px',
                                filter: 'drop-shadow(0 0 10px rgba(255,61,61,0.3))',
                            }}
                        />
                    </div>
                </div>

                {/* Player Section (bottom) */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    position: 'relative',
                    zIndex: 2,
                }}>
                    {/* Player Sprite */}
                    <div className={battle.playerFainted ? 'faint-animation' : ''} style={{
                        position: 'relative',
                    }}>
                        <img
                            src={battle.playerPokemon?.sprites?.back_default || battle.playerPokemon?.sprites?.front_default}
                            alt={battle.playerPokemon?.name}
                            className="pixel-sprite"
                            style={{
                                width: '130px',
                                height: '130px',
                                filter: 'drop-shadow(0 0 10px rgba(79,195,247,0.3))',
                            }}
                        />
                    </div>

                    {/* Player Info */}
                    <div style={{
                        background: 'rgba(0,0,0,0.6)',
                        border: '2px solid var(--neon-blue)',
                        padding: '10px 14px',
                        minWidth: '220px',
                        boxShadow: '3px 3px 0px rgba(79,195,247,0.2)',
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '6px',
                        }}>
                            <span style={{
                                fontFamily: "'Press Start 2P', cursive",
                                fontSize: '9px',
                                color: 'var(--neon-blue)',
                            }}>
                                {battle.playerPokemon?.name?.toUpperCase()}
                            </span>
                            <span style={{
                                fontFamily: "'VT323', monospace",
                                fontSize: '14px',
                                color: 'var(--text-dim)',
                            }}>
                                Lv50
                            </span>
                        </div>
                        <HPBar current={battle.playerHP} max={battle.playerMaxHP} size="normal" />
                        {battle.playerStatus && (
                            <span style={{
                                fontFamily: "'Press Start 2P', cursive",
                                fontSize: '7px',
                                color: battle.playerStatus === 'burn' ? '#FF6B35' : '#FFD700',
                                marginTop: '4px',
                                display: 'block',
                            }}>
                                {battle.playerStatus === 'burn' ? 'BRN' : 'PAR'}
                            </span>
                        )}
                    </div>
                </div>

                {/* Trainer labels */}
                <div style={{
                    position: 'absolute',
                    top: '8px',
                    right: '10px',
                    fontFamily: "'VT323', monospace",
                    fontSize: '14px',
                    color: 'var(--neon-red)',
                    opacity: 0.6,
                }}>
                    {battle.opponentTrainer}
                </div>
                <div style={{
                    position: 'absolute',
                    bottom: '8px',
                    left: '10px',
                    fontFamily: "'VT323', monospace",
                    fontSize: '14px',
                    color: 'var(--neon-blue)',
                    opacity: 0.6,
                }}>
                    {battle.playerTrainer}
                </div>
            </div>

            {/* Battle Log */}
            <div style={{ marginTop: '10px' }}>
                <BattleLog messages={battle.battleLog} currentMessage={battle.currentMessage} />
            </div>

            {/* Move Buttons or Result */}
            {battleOver ? (
                <div style={{
                    textAlign: 'center',
                    padding: '30px',
                    background: 'var(--bg-panel)',
                    border: '3px solid',
                    borderColor: battle.winner === 'player' ? 'var(--neon-yellow)' : 'var(--neon-red)',
                    marginTop: '10px',
                    boxShadow: battle.winner === 'player'
                        ? '0 0 30px rgba(255,215,0,0.2)'
                        : '0 0 30px rgba(255,61,61,0.2)',
                }}>
                    <h2 style={{
                        fontFamily: "'Press Start 2P', cursive",
                        fontSize: '20px',
                        color: battle.winner === 'player' ? 'var(--neon-yellow)' : 'var(--neon-red)',
                        textShadow: battle.winner === 'player'
                            ? '0 0 15px rgba(255,215,0,0.5)'
                            : '0 0 15px rgba(255,61,61,0.5)',
                        marginBottom: '20px',
                        animation: 'blink-cursor 1s step-end infinite',
                    }}>
                        {battle.winner === 'player' ? 'YOU WIN!' : 'YOU LOSE!'}
                    </h2>
                    <button
                        onClick={battle.resetBattle}
                        className="btn-pixel"
                        style={{ fontSize: '12px', padding: '14px 30px' }}
                    >
                        PLAY AGAIN
                    </button>
                </div>
            ) : (
                <div style={{ marginTop: '10px' }}>
                    <MoveButtons
                        moves={battle.playerMoves}
                        pp={battle.playerPP}
                        onMoveSelect={battle.playerAttack}
                        onRun={battle.tryRun}
                        disabled={!isPlayerTurn}
                    />
                    {battle.phase === 'ai_turn' && (
                        <div style={{
                            textAlign: 'center',
                            marginTop: '10px',
                            fontFamily: "'Press Start 2P', cursive",
                            fontSize: '10px',
                            color: 'var(--neon-red)',
                            opacity: 0.8,
                        }}>
                            OPPONENT IS THINKING...
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default BattleArena;
