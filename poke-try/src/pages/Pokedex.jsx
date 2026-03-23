import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PokemonCard from '../components/PokemonCard';
import PokemonModal from '../components/PokemonModal';
import SearchBar from '../components/SearchBar';
import FilterPanel, { GENERATIONS } from '../components/FilterPanel';
import { usePokemon } from '../hooks/usePokemon';

const Pokedex = ({ onSendToBattle }) => {
    const navigate = useNavigate();
    const {
        pokemonList,
        loading,
        error,
        hasMore,
        fetchPokemonList,
        fetchMore,
        searchPokemon,
        fetchSpeciesData,
    } = usePokemon();

    const [selectedPokemon, setSelectedPokemon] = useState(null);
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [filters, setFilters] = useState({
        selectedTypes: [],
        selectedGen: null,
        category: 'all',
        statRanges: {},
        sortBy: 'id',
        sortDir: 'asc',
    });
    const [searchActive, setSearchActive] = useState(false);
    const [speciesCache, setSpeciesCache] = useState({});

    // Initial load
    useEffect(() => {
        fetchPokemonList(0, false);
    }, []);

    // Fetch species data for filtering (legendary/mythical)
    useEffect(() => {
        const loadSpecies = async () => {
            for (const p of pokemonList) {
                if (!speciesCache[p.id] && p.speciesUrl) {
                    try {
                        const species = await fetchSpeciesData(p.speciesUrl);
                        setSpeciesCache(prev => ({ ...prev, [p.id]: species }));
                    } catch { /* skip */ }
                }
            }
        };
        if (filters.category !== 'all') {
            loadSpecies();
        }
    }, [pokemonList, filters.category, fetchSpeciesData, speciesCache]);

    const handleSearch = useCallback((query) => {
        if (query.trim()) {
            setSearchActive(true);
            searchPokemon(query);
        } else {
            setSearchActive(false);
            fetchPokemonList(0, false);
        }
    }, [searchPokemon, fetchPokemonList]);

    // Apply filters and sorting
    const filteredPokemon = useMemo(() => {
        let result = [...pokemonList];

        // Type filter
        if (filters.selectedTypes.length > 0) {
            result = result.filter(p =>
                filters.selectedTypes.some(t => p.types.includes(t))
            );
        }

        // Generation filter
        if (filters.selectedGen) {
            const gen = GENERATIONS.find(g => g.value === filters.selectedGen);
            if (gen) {
                result = result.filter(p => p.id >= gen.range[0] && p.id <= gen.range[1]);
            }
        }

        // Category filter
        if (filters.category !== 'all') {
            result = result.filter(p => {
                const sp = speciesCache[p.id];
                if (!sp) return filters.category === 'regular';
                if (filters.category === 'legendary') return sp.isLegendary;
                if (filters.category === 'mythical') return sp.isMythical;
                if (filters.category === 'regular') return !sp.isLegendary && !sp.isMythical;
                return true;
            });
        }

        // Stat range filters
        for (const [stat, range] of Object.entries(filters.statRanges)) {
            if (range.min > 0 || range.max < 255) {
                result = result.filter(p => {
                    const val = p.stats[stat] || 0;
                    return val >= (range.min || 0) && val <= (range.max || 255);
                });
            }
        }

        // Sort
        result.sort((a, b) => {
            let val = 0;
            switch (filters.sortBy) {
                case 'name-asc':
                    return a.name.localeCompare(b.name);
                case 'name-desc':
                    return b.name.localeCompare(a.name);
                case 'totalStats':
                    val = a.totalStats - b.totalStats;
                    break;
                case 'hp':
                    val = a.stats.hp - b.stats.hp;
                    break;
                case 'attack':
                    val = a.stats.attack - b.stats.attack;
                    break;
                case 'speed':
                    val = a.stats.speed - b.stats.speed;
                    break;
                case 'id':
                default:
                    val = a.id - b.id;
            }
            return filters.sortDir === 'desc' ? -val : val;
        });

        return result;
    }, [pokemonList, filters, speciesCache]);

    const handleSendToBattle = (pokemon) => {
        setSelectedPokemon(null);
        if (onSendToBattle) {
            onSendToBattle(pokemon);
        }
        navigate('/battle', { state: { pokemon } });
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <h1 style={{
                    fontFamily: "'Press Start 2P', cursive",
                    fontSize: '18px',
                    color: 'var(--neon-yellow)',
                    textShadow: '0 0 15px rgba(255,215,0,0.4)',
                    marginBottom: '8px',
                }}>
                    POKÉDEX
                </h1>
                <p style={{
                    fontFamily: "'VT323', monospace",
                    fontSize: '18px',
                    color: 'var(--text-dim)',
                }}>
                    Explore and discover all Pokémon
                </p>
            </div>

            {/* Search Bar */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                <SearchBar onSearch={handleSearch} />
            </div>

            {/* Filter Panel */}
            <FilterPanel
                filters={filters}
                onFilterChange={setFilters}
                resultCount={filteredPokemon.length}
                isOpen={filtersOpen}
                onToggle={() => setFiltersOpen(!filtersOpen)}
            />

            {/* Error State */}
            {error && (
                <div className="crt-static" style={{
                    textAlign: 'center',
                    padding: '40px',
                    background: 'var(--bg-panel)',
                    border: '3px solid var(--neon-red)',
                    marginBottom: '20px',
                }}>
                    <h3 style={{
                        fontFamily: "'Press Start 2P', cursive",
                        fontSize: '12px',
                        color: 'var(--neon-red)',
                        marginBottom: '10px',
                    }}>
                        NO SIGNAL
                    </h3>
                    <p style={{ fontFamily: "'VT323', monospace", fontSize: '18px', color: 'var(--text-dim)' }}>
                        {error}
                    </p>
                </div>
            )}

            {/* Pokemon Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                gap: '14px',
                marginTop: '16px',
            }}>
                {filteredPokemon.map(p => (
                    <PokemonCard key={p.id} pokemon={p} onClick={setSelectedPokemon} />
                ))}
            </div>

            {/* Loading */}
            {loading && (
                <div style={{ textAlign: 'center', padding: '30px' }}>
                    <div className="pokeball-spinner" />
                    <p style={{
                        fontFamily: "'Press Start 2P', cursive",
                        fontSize: '10px',
                        color: 'var(--neon-yellow)',
                        marginTop: '10px',
                    }}>
                        LOADING...
                    </p>
                </div>
            )}

            {/* Load More */}
            {!loading && hasMore && !searchActive && (
                <div style={{ textAlign: 'center', marginTop: '24px' }}>
                    <button onClick={fetchMore} className="btn-pixel" style={{ fontSize: '10px' }}>
                        LOAD MORE POKÉMON
                    </button>
                </div>
            )}

            {/* Empty State */}
            {!loading && filteredPokemon.length === 0 && !error && (
                <div style={{
                    textAlign: 'center',
                    padding: '40px',
                    color: 'var(--text-dim)',
                }}>
                    <p style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '10px' }}>
                        NO POKÉMON FOUND
                    </p>
                    <p style={{ fontFamily: "'VT323', monospace", fontSize: '18px', marginTop: '8px' }}>
                        Try adjusting your filters or search
                    </p>
                </div>
            )}

            {/* Detail Modal */}
            {selectedPokemon && (
                <PokemonModal
                    pokemon={selectedPokemon}
                    onClose={() => setSelectedPokemon(null)}
                    onSendToBattle={handleSendToBattle}
                />
            )}
        </div>
    );
};

export default Pokedex;
