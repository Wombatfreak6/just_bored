import React from 'react';
import { useLocation } from 'react-router-dom';
import BattleArena from '../components/BattleArena';

const Battle = () => {
    const location = useLocation();
    const preSelectedPokemon = location.state?.pokemon || null;

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                <h1 style={{
                    fontFamily: "'Press Start 2P', cursive",
                    fontSize: '16px',
                    color: 'var(--neon-red)',
                    textShadow: '0 0 15px rgba(255,61,61,0.4)',
                }}>
                    BATTLE ARENA
                </h1>
            </div>
            <BattleArena preSelectedPokemon={preSelectedPokemon} />
        </div>
    );
};

export default Battle;
