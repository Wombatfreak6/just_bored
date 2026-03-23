// Fallback move data when PokéAPI doesn't return enough moves
// or when we need reliable move data for battle

export const FALLBACK_MOVES = {
    tackle: { name: 'Tackle', type: 'normal', power: 40, pp: 35, accuracy: 100, damageClass: 'physical', effect: null },
    scratch: { name: 'Scratch', type: 'normal', power: 40, pp: 35, accuracy: 100, damageClass: 'physical', effect: null },
    pound: { name: 'Pound', type: 'normal', power: 40, pp: 35, accuracy: 100, damageClass: 'physical', effect: null },
    'body-slam': { name: 'Body Slam', type: 'normal', power: 85, pp: 15, accuracy: 100, damageClass: 'physical', effect: 'paralysis' },
    flamethrower: { name: 'Flamethrower', type: 'fire', power: 90, pp: 15, accuracy: 100, damageClass: 'special', effect: 'burn' },
    'fire-blast': { name: 'Fire Blast', type: 'fire', power: 110, pp: 5, accuracy: 85, damageClass: 'special', effect: 'burn' },
    'fire-punch': { name: 'Fire Punch', type: 'fire', power: 75, pp: 15, accuracy: 100, damageClass: 'physical', effect: 'burn' },
    ember: { name: 'Ember', type: 'fire', power: 40, pp: 25, accuracy: 100, damageClass: 'special', effect: 'burn' },
    'hydro-pump': { name: 'Hydro Pump', type: 'water', power: 110, pp: 5, accuracy: 80, damageClass: 'special', effect: null },
    surf: { name: 'Surf', type: 'water', power: 90, pp: 15, accuracy: 100, damageClass: 'special', effect: null },
    'water-gun': { name: 'Water Gun', type: 'water', power: 40, pp: 25, accuracy: 100, damageClass: 'special', effect: null },
    'bubble-beam': { name: 'Bubble Beam', type: 'water', power: 65, pp: 20, accuracy: 100, damageClass: 'special', effect: null },
    thunderbolt: { name: 'Thunderbolt', type: 'electric', power: 90, pp: 15, accuracy: 100, damageClass: 'special', effect: 'paralysis' },
    thunder: { name: 'Thunder', type: 'electric', power: 110, pp: 10, accuracy: 70, damageClass: 'special', effect: 'paralysis' },
    'thunder-shock': { name: 'Thunder Shock', type: 'electric', power: 40, pp: 30, accuracy: 100, damageClass: 'special', effect: 'paralysis' },
    psychic: { name: 'Psychic', type: 'psychic', power: 90, pp: 10, accuracy: 100, damageClass: 'special', effect: null },
    confusion: { name: 'Confusion', type: 'psychic', power: 50, pp: 25, accuracy: 100, damageClass: 'special', effect: null },
    'ice-beam': { name: 'Ice Beam', type: 'ice', power: 90, pp: 10, accuracy: 100, damageClass: 'special', effect: null },
    blizzard: { name: 'Blizzard', type: 'ice', power: 110, pp: 5, accuracy: 70, damageClass: 'special', effect: null },
    'razor-leaf': { name: 'Razor Leaf', type: 'grass', power: 55, pp: 25, accuracy: 95, damageClass: 'physical', effect: null },
    'solar-beam': { name: 'Solar Beam', type: 'grass', power: 120, pp: 10, accuracy: 100, damageClass: 'special', effect: null },
    'vine-whip': { name: 'Vine Whip', type: 'grass', power: 45, pp: 25, accuracy: 100, damageClass: 'physical', effect: null },
    'dragon-claw': { name: 'Dragon Claw', type: 'dragon', power: 80, pp: 15, accuracy: 100, damageClass: 'physical', effect: null },
    'dragon-pulse': { name: 'Dragon Pulse', type: 'dragon', power: 85, pp: 10, accuracy: 100, damageClass: 'special', effect: null },
    'shadow-ball': { name: 'Shadow Ball', type: 'ghost', power: 80, pp: 15, accuracy: 100, damageClass: 'special', effect: null },
    'dark-pulse': { name: 'Dark Pulse', type: 'dark', power: 80, pp: 15, accuracy: 100, damageClass: 'special', effect: null },
    'air-slash': { name: 'Air Slash', type: 'flying', power: 75, pp: 15, accuracy: 95, damageClass: 'special', effect: null },
    earthquake: { name: 'Earthquake', type: 'ground', power: 100, pp: 10, accuracy: 100, damageClass: 'physical', effect: null },
    'rock-slide': { name: 'Rock Slide', type: 'rock', power: 75, pp: 10, accuracy: 90, damageClass: 'physical', effect: null },
    'iron-tail': { name: 'Iron Tail', type: 'steel', power: 100, pp: 15, accuracy: 75, damageClass: 'physical', effect: null },
    'dazzling-gleam': { name: 'Dazzling Gleam', type: 'fairy', power: 80, pp: 10, accuracy: 100, damageClass: 'special', effect: null },
    'sludge-bomb': { name: 'Sludge Bomb', type: 'poison', power: 90, pp: 10, accuracy: 100, damageClass: 'special', effect: null },
    'x-scissor': { name: 'X-Scissor', type: 'bug', power: 80, pp: 15, accuracy: 100, damageClass: 'physical', effect: null },
};

// Default movesets for popular Pokémon (battle fallbacks)
export const DEFAULT_MOVESETS = {
    charizard: ['flamethrower', 'air-slash', 'dragon-pulse', 'fire-blast'],
    blastoise: ['hydro-pump', 'ice-beam', 'surf', 'dark-pulse'],
    venusaur: ['solar-beam', 'sludge-bomb', 'razor-leaf', 'body-slam'],
    pikachu: ['thunderbolt', 'thunder', 'thunder-shock', 'tackle'],
    arcanine: ['flamethrower', 'fire-blast', 'fire-punch', 'body-slam'],
    gengar: ['shadow-ball', 'psychic', 'dark-pulse', 'sludge-bomb'],
    dragonite: ['dragon-claw', 'dragon-pulse', 'ice-beam', 'thunderbolt'],
    mewtwo: ['psychic', 'ice-beam', 'thunderbolt', 'shadow-ball'],
    gyarados: ['hydro-pump', 'ice-beam', 'dragon-pulse', 'dark-pulse'],
    alakazam: ['psychic', 'shadow-ball', 'dazzling-gleam', 'thunder-shock'],
};

// Get a usable moveset for any Pokémon
export function getMovesetForPokemon(pokemonName, pokemonTypes) {
    const name = pokemonName.toLowerCase();

    // Check for a default moveset
    if (DEFAULT_MOVESETS[name]) {
        return DEFAULT_MOVESETS[name].map(id => ({ ...FALLBACK_MOVES[id], id }));
    }

    // Generate a moveset based on types
    const moves = [];
    const allMoves = Object.entries(FALLBACK_MOVES);

    // Add STAB moves (same type attack bonus)
    for (const type of pokemonTypes) {
        const stabMoves = allMoves.filter(([, m]) => m.type === type);
        if (stabMoves.length > 0) {
            const best = stabMoves.sort((a, b) => b[1].power - a[1].power)[0];
            moves.push({ ...best[1], id: best[0] });
        }
    }

    // Fill remaining slots with good coverage moves
    const coverageTypes = ['ice', 'electric', 'ground', 'psychic', 'fire', 'water'];
    for (const type of coverageTypes) {
        if (moves.length >= 4) break;
        if (pokemonTypes.includes(type)) continue;
        const typeMoves = allMoves.filter(([, m]) => m.type === type && m.power >= 70);
        if (typeMoves.length > 0) {
            const pick = typeMoves[0];
            moves.push({ ...pick[1], id: pick[0] });
        }
    }

    // Always ensure at least 4 moves
    while (moves.length < 4) {
        moves.push({ ...FALLBACK_MOVES.tackle, id: 'tackle' });
    }

    return moves.slice(0, 4);
}
