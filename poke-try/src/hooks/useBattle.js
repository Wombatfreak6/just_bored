import { useState, useCallback, useRef } from 'react';
import { useTypeChart } from './useTypeChart';
import { getMovesetForPokemon, FALLBACK_MOVES } from '../data/moveData';

const LEVEL = 50;

// Battle phases: setup -> intro -> player_turn -> ai_turn -> result
export function useBattle() {
    const { getEffectiveness, getEffectivenessLabel } = useTypeChart();

    const [phase, setPhase] = useState('setup'); // setup, intro, player_turn, ai_turn, animating, result
    const [playerPokemon, setPlayerPokemon] = useState(null);
    const [opponentPokemon, setOpponentPokemon] = useState(null);
    const [playerHP, setPlayerHP] = useState(0);
    const [playerMaxHP, setPlayerMaxHP] = useState(0);
    const [opponentHP, setOpponentHP] = useState(0);
    const [opponentMaxHP, setOpponentMaxHP] = useState(0);
    const [playerMoves, setPlayerMoves] = useState([]);
    const [opponentMoves, setOpponentMoves] = useState([]);
    const [playerPP, setPlayerPP] = useState([]);
    const [opponentPP, setOpponentPP] = useState([]);
    const [battleLog, setBattleLog] = useState([]);
    const [currentMessage, setCurrentMessage] = useState('');
    const [winner, setWinner] = useState(null);
    const [playerStatus, setPlayerStatus] = useState(null); // burn, paralysis
    const [opponentStatus, setOpponentStatus] = useState(null);
    const [criticalHit, setCriticalHit] = useState(false);
    const [playerFainted, setPlayerFainted] = useState(false);
    const [opponentFainted, setOpponentFainted] = useState(false);
    const [playerTrainer] = useState('ASH');
    const [opponentTrainer] = useState('RIVAL GARY');

    const animatingRef = useRef(false);

    const addLog = useCallback((message) => {
        setBattleLog(prev => [...prev, message]);
        setCurrentMessage(message);
    }, []);

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const calculateDamage = useCallback((attacker, defender, move, attackerTypes) => {
        if (!move || move.power === 0) return 0;

        const isPhysical = move.damageClass === 'physical';
        const atk = isPhysical ? attacker.stats.attack : attacker.stats.spAtk;
        const def = isPhysical ? defender.stats.defense : defender.stats.spDef;

        // Gen I formula
        let damage = ((2 * LEVEL / 5 + 2) * move.power * (atk / def) / 50 + 2);

        // Type effectiveness
        const effectiveness = getEffectiveness(move.type, defender.types);
        damage *= effectiveness;

        // STAB (Same Type Attack Bonus)
        if (attackerTypes.includes(move.type)) {
            damage *= 1.5;
        }

        // Critical hit (6.25%)
        const isCritical = Math.random() < 0.0625;
        if (isCritical) {
            damage *= 1.5;
        }

        // Random factor
        const randomFactor = 0.85 + Math.random() * 0.15;
        damage *= randomFactor;

        return {
            damage: Math.max(1, Math.floor(damage)),
            effectiveness,
            isCritical,
        };
    }, [getEffectiveness]);

    const prepareBattleMoves = useCallback((pokemon) => {
        let moves = getMovesetForPokemon(pokemon.name, pokemon.types);
        return moves.map(m => ({
            ...m,
            currentPP: m.pp,
        }));
    }, []);

    const initBattle = useCallback((player, opponent) => {
        const pMoves = prepareBattleMoves(player);
        const oMoves = prepareBattleMoves(opponent);

        // Calculate HP stat (simplified)
        const pHP = Math.floor(((2 * player.stats.hp * LEVEL) / 100) + LEVEL + 10);
        const oHP = Math.floor(((2 * opponent.stats.hp * LEVEL) / 100) + LEVEL + 10);

        setPlayerPokemon(player);
        setOpponentPokemon(opponent);
        setPlayerHP(pHP);
        setPlayerMaxHP(pHP);
        setOpponentHP(oHP);
        setOpponentMaxHP(oHP);
        setPlayerMoves(pMoves);
        setOpponentMoves(oMoves);
        setPlayerPP(pMoves.map(m => m.pp));
        setOpponentPP(oMoves.map(m => m.pp));
        setBattleLog([]);
        setCurrentMessage('');
        setWinner(null);
        setPlayerStatus(null);
        setOpponentStatus(null);
        setCriticalHit(false);
        setPlayerFainted(false);
        setOpponentFainted(false);
        setPhase('intro');

        return { pHP, oHP, pMoves, oMoves, player, opponent };
    }, [prepareBattleMoves]);

    const startIntro = useCallback(async (player, opponent) => {
        addLog(`${opponentTrainer} sent out ${opponent.name.toUpperCase()}!`);
        await delay(1500);
        addLog(`Go! ${player.name.toUpperCase()}!`);
        await delay(1500);
        setPhase('player_turn');
        setCurrentMessage(`What will ${player.name.toUpperCase()} do?`);
    }, [addLog, opponentTrainer]);

    const applyStatusDamage = useCallback((statusCondition, pokemon, currentHP, maxHP, isPlayer) => {
        if (statusCondition === 'burn') {
            const burnDmg = Math.max(1, Math.floor(maxHP / 16));
            const newHP = Math.max(0, currentHP - burnDmg);
            if (isPlayer) setPlayerHP(newHP);
            else setOpponentHP(newHP);
            return { hp: newHP, msg: `${pokemon.name.toUpperCase()} is hurt by its burn!` };
        }
        return { hp: currentHP, msg: null };
    }, []);

    const aiSelectMove = useCallback((oMoves, oPP, oHP, oMaxHP, playerPkmn) => {
        // AI logic
        const availableMoves = oMoves.map((m, i) => ({ ...m, index: i })).filter((_, i) => oPP[i] > 0);
        if (availableMoves.length === 0) {
            return { move: { name: 'Struggle', type: 'normal', power: 50, damageClass: 'physical' }, index: -1 };
        }

        // Score each move
        const hpPercent = oHP / oMaxHP;
        const scored = availableMoves.map(m => {
            const eff = getEffectiveness(m.type, playerPkmn.types);
            let score = m.power * eff;

            // At low HP, prefer maximum damage
            if (hpPercent < 0.25) {
                score *= 1.5;
            }

            // Prefer super effective
            if (eff > 1) score *= 1.3;

            // Consider accuracy
            score *= (m.accuracy || 100) / 100;

            return { ...m, score };
        });

        scored.sort((a, b) => b.score - a.score);

        // Small randomness: 70% pick best, 30% pick random from top 2
        const pick = Math.random() < 0.7 ? scored[0] : scored[Math.floor(Math.random() * Math.min(2, scored.length))];
        return { move: pick, index: pick.index };
    }, [getEffectiveness]);

    const executeAttack = useCallback(async (attacker, defender, move, moveIndex, isPlayer, currentPlayerHP, currentOpponentHP) => {
        const attackerName = attacker.name.toUpperCase();
        const defenderName = defender.name.toUpperCase();
        let pHP = currentPlayerHP;
        let oHP = currentOpponentHP;

        // Check paralysis
        const status = isPlayer ? playerStatus : opponentStatus;
        if (status === 'paralysis' && Math.random() < 0.25) {
            addLog(`${attackerName} is paralyzed! It can't move!`);
            return { playerHP: pHP, opponentHP: oHP, fainted: false };
        }

        addLog(`${attackerName} used ${move.name.toUpperCase()}!`);
        await delay(800);

        // Deduct PP
        if (moveIndex >= 0) {
            if (isPlayer) {
                setPlayerPP(prev => {
                    const next = [...prev];
                    next[moveIndex] = Math.max(0, next[moveIndex] - 1);
                    return next;
                });
            } else {
                setOpponentPP(prev => {
                    const next = [...prev];
                    next[moveIndex] = Math.max(0, next[moveIndex] - 1);
                    return next;
                });
            }
        }

        const result = calculateDamage(attacker, defender, move, attacker.types);

        // Effectiveness message
        const effLabel = getEffectivenessLabel(result.effectiveness);
        if (effLabel.text) {
            addLog(effLabel.text);
            await delay(600);
        }

        // Critical hit
        if (result.isCritical) {
            setCriticalHit(true);
            addLog('A critical hit!');
            await delay(400);
            setCriticalHit(false);
        }

        // Apply damage
        if (isPlayer) {
            oHP = Math.max(0, oHP - result.damage);
            setOpponentHP(oHP);
        } else {
            pHP = Math.max(0, pHP - result.damage);
            setPlayerHP(pHP);
        }

        await delay(600);

        // Status effect from move
        if (move.effect && Math.random() < 0.1) {
            if (isPlayer && !opponentStatus) {
                setOpponentStatus(move.effect);
                addLog(`${defenderName} was ${move.effect === 'burn' ? 'burned' : 'paralyzed'}!`);
                await delay(600);
            } else if (!isPlayer && !playerStatus) {
                setPlayerStatus(move.effect);
                addLog(`${defenderName} was ${move.effect === 'burn' ? 'burned' : 'paralyzed'}!`);
                await delay(600);
            }
        }

        // Check faint
        const targetHP = isPlayer ? oHP : pHP;
        if (targetHP <= 0) {
            addLog(`${defenderName} fainted!`);
            if (isPlayer) setOpponentFainted(true);
            else setPlayerFainted(true);
            return { playerHP: pHP, opponentHP: oHP, fainted: true };
        }

        // Status damage at end of turn
        if (isPlayer && opponentStatus) {
            const statusResult = applyStatusDamage(opponentStatus, defender, oHP, opponentMaxHP, false);
            oHP = statusResult.hp;
            if (statusResult.msg) {
                addLog(statusResult.msg);
                await delay(600);
            }
            if (oHP <= 0) {
                addLog(`${defenderName} fainted!`);
                setOpponentFainted(true);
                return { playerHP: pHP, opponentHP: oHP, fainted: true };
            }
        } else if (!isPlayer && playerStatus) {
            const statusResult = applyStatusDamage(playerStatus, defender, pHP, playerMaxHP, true);
            pHP = statusResult.hp;
            if (statusResult.msg) {
                addLog(statusResult.msg);
                await delay(600);
            }
            if (pHP <= 0) {
                addLog(`${defenderName} fainted!`);
                setPlayerFainted(true);
                return { playerHP: pHP, opponentHP: oHP, fainted: true };
            }
        }

        return { playerHP: pHP, opponentHP: oHP, fainted: false };
    }, [playerStatus, opponentStatus, calculateDamage, getEffectivenessLabel, addLog, applyStatusDamage, opponentMaxHP, playerMaxHP]);

    const playerAttack = useCallback(async (moveIndex) => {
        if (phase !== 'player_turn' || animatingRef.current) return;
        animatingRef.current = true;
        setPhase('animating');

        const move = playerMoves[moveIndex];
        if (playerPP[moveIndex] <= 0) {
            addLog('No PP left for this move!');
            animatingRef.current = false;
            setPhase('player_turn');
            return;
        }

        // Player attacks
        let result = await executeAttack(
            playerPokemon, opponentPokemon, move, moveIndex, true, playerHP, opponentHP
        );

        if (result.fainted) {
            await delay(1000);
            setWinner('player');
            setPhase('result');
            addLog(`${playerTrainer}'s ${playerPokemon.name.toUpperCase()} wins!`);
            animatingRef.current = false;
            return;
        }

        // AI Turn
        setPhase('ai_turn');
        addLog('...');
        await delay(1200);

        const aiChoice = aiSelectMove(opponentMoves, opponentPP, result.opponentHP, opponentMaxHP, playerPokemon);

        result = await executeAttack(
            opponentPokemon, playerPokemon, aiChoice.move, aiChoice.index, false, result.playerHP, result.opponentHP
        );

        if (result.fainted) {
            await delay(1000);
            setWinner('opponent');
            setPhase('result');
            addLog(`${opponentTrainer}'s ${opponentPokemon.name.toUpperCase()} wins!`);
            animatingRef.current = false;
            return;
        }

        setPhase('player_turn');
        setCurrentMessage(`What will ${playerPokemon.name.toUpperCase()} do?`);
        animatingRef.current = false;
    }, [phase, playerMoves, playerPP, playerPokemon, opponentPokemon, playerHP, opponentHP,
        executeAttack, aiSelectMove, opponentMoves, opponentPP, opponentMaxHP, addLog,
        playerTrainer, opponentTrainer]);

    const tryRun = useCallback(async () => {
        if (phase !== 'player_turn' || animatingRef.current) return;
        animatingRef.current = true;
        setPhase('animating');
        addLog("Can't escape!");
        await delay(1000);

        // AI gets a free turn
        setPhase('ai_turn');
        addLog('...');
        await delay(1200);

        const aiChoice = aiSelectMove(opponentMoves, opponentPP, opponentHP, opponentMaxHP, playerPokemon);
        const result = await executeAttack(
            opponentPokemon, playerPokemon, aiChoice.move, aiChoice.index, false, playerHP, opponentHP
        );

        if (result.fainted) {
            await delay(1000);
            setWinner('opponent');
            setPhase('result');
            addLog(`${opponentTrainer}'s ${opponentPokemon.name.toUpperCase()} wins!`);
            animatingRef.current = false;
            return;
        }

        setPhase('player_turn');
        setCurrentMessage(`What will ${playerPokemon.name.toUpperCase()} do?`);
        animatingRef.current = false;
    }, [phase, opponentMoves, opponentPP, opponentHP, opponentMaxHP, playerPokemon,
        opponentPokemon, playerHP, executeAttack, addLog, aiSelectMove, opponentTrainer]);

    const resetBattle = useCallback(() => {
        setPhase('setup');
        setPlayerPokemon(null);
        setOpponentPokemon(null);
        setPlayerHP(0);
        setOpponentHP(0);
        setBattleLog([]);
        setCurrentMessage('');
        setWinner(null);
        setPlayerStatus(null);
        setOpponentStatus(null);
        setPlayerFainted(false);
        setOpponentFainted(false);
        animatingRef.current = false;
    }, []);

    return {
        phase,
        playerPokemon,
        opponentPokemon,
        playerHP,
        playerMaxHP,
        opponentHP,
        opponentMaxHP,
        playerMoves,
        opponentMoves,
        playerPP,
        opponentPP,
        battleLog,
        currentMessage,
        winner,
        playerStatus,
        opponentStatus,
        criticalHit,
        playerFainted,
        opponentFainted,
        playerTrainer,
        opponentTrainer,
        initBattle,
        startIntro,
        playerAttack,
        tryRun,
        resetBattle,
    };
}

export default useBattle;
