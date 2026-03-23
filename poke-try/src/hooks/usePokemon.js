import { useState, useRef, useCallback } from 'react';

const API_BASE = 'https://pokeapi.co/api/v2';
const CACHE = {};
const PAGE_SIZE = 20;

export function usePokemon() {
    const [pokemonList, setPokemonList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [totalCount, setTotalCount] = useState(0);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const abortRef = useRef(null);

    const fetchPokemonDetail = useCallback(async (nameOrId) => {
        const key = `pokemon-${nameOrId}`;
        if (CACHE[key]) return CACHE[key];

        const res = await fetch(`${API_BASE}/pokemon/${nameOrId}`);
        if (!res.ok) throw new Error(`Failed to fetch ${nameOrId}`);
        const data = await res.json();

        const detail = {
            id: data.id,
            name: data.name,
            sprites: data.sprites,
            types: data.types.map(t => t.type.name),
            stats: {
                hp: data.stats.find(s => s.stat.name === 'hp')?.base_stat || 0,
                attack: data.stats.find(s => s.stat.name === 'attack')?.base_stat || 0,
                defense: data.stats.find(s => s.stat.name === 'defense')?.base_stat || 0,
                spAtk: data.stats.find(s => s.stat.name === 'special-attack')?.base_stat || 0,
                spDef: data.stats.find(s => s.stat.name === 'special-defense')?.base_stat || 0,
                speed: data.stats.find(s => s.stat.name === 'speed')?.base_stat || 0,
            },
            totalStats: data.stats.reduce((sum, s) => sum + s.base_stat, 0),
            abilities: data.abilities.map(a => a.ability.name),
            baseExperience: data.base_experience,
            speciesUrl: data.species.url,
            moves: data.moves,
            height: data.height,
            weight: data.weight,
        };

        CACHE[key] = detail;
        return detail;
    }, []);

    const fetchPokemonList = useCallback(async (newOffset = 0, append = false) => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`${API_BASE}/pokemon?limit=${PAGE_SIZE}&offset=${newOffset}`);
            if (!res.ok) throw new Error('Failed to fetch Pokémon list');
            const data = await res.json();

            setTotalCount(data.count);
            setHasMore(!!data.next);
            setOffset(newOffset + PAGE_SIZE);

            const details = await Promise.all(
                data.results.map(p => fetchPokemonDetail(p.name))
            );

            if (append) {
                setPokemonList(prev => [...prev, ...details]);
            } else {
                setPokemonList(details);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [fetchPokemonDetail]);

    const fetchMore = useCallback(() => {
        if (!loading && hasMore) {
            fetchPokemonList(offset, true);
        }
    }, [fetchPokemonList, offset, loading, hasMore]);

    const searchPokemon = useCallback(async (query) => {
        if (!query.trim()) {
            fetchPokemonList(0, false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const q = query.toLowerCase().trim();
            // Try direct lookup by name or ID
            const detail = await fetchPokemonDetail(q);
            setPokemonList([detail]);
            setHasMore(false);
        } catch {
            // If direct lookup fails, filter from a larger set
            try {
                const res = await fetch(`${API_BASE}/pokemon?limit=1025&offset=0`);
                const data = await res.json();
                const q = query.toLowerCase().trim();
                const matches = data.results.filter(p =>
                    p.name.includes(q) || p.url.split('/').filter(Boolean).pop() === q
                );

                if (matches.length === 0) {
                    setPokemonList([]);
                    setHasMore(false);
                } else {
                    const details = await Promise.all(
                        matches.slice(0, 40).map(p => fetchPokemonDetail(p.name))
                    );
                    setPokemonList(details);
                    setHasMore(false);
                }
            } catch (err2) {
                setError('No Pokémon found');
                setPokemonList([]);
            }
        } finally {
            setLoading(false);
        }
    }, [fetchPokemonDetail, fetchPokemonList]);

    const fetchSpeciesData = useCallback(async (speciesUrl) => {
        const key = `species-${speciesUrl}`;
        if (CACHE[key]) return CACHE[key];

        const res = await fetch(speciesUrl);
        if (!res.ok) throw new Error('Failed to fetch species');
        const data = await res.json();

        const species = {
            isLegendary: data.is_legendary,
            isMythical: data.is_mythical,
            generation: data.generation?.name || 'unknown',
            evolutionChainUrl: data.evolution_chain?.url,
            color: data.color?.name,
            flavorText: data.flavor_text_entries
                ?.find(e => e.language.name === 'en')
                ?.flavor_text?.replace(/[\n\f]/g, ' ') || '',
        };

        CACHE[key] = species;
        return species;
    }, []);

    const fetchEvolutionChain = useCallback(async (url) => {
        const key = `evo-${url}`;
        if (CACHE[key]) return CACHE[key];

        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch evolution chain');
        const data = await res.json();

        const chain = [];
        let current = data.chain;

        while (current) {
            chain.push({
                name: current.species.name,
                minLevel: current.evolution_details?.[0]?.min_level || null,
            });
            current = current.evolves_to?.[0] || null;
        }

        CACHE[key] = chain;
        return chain;
    }, []);

    const fetchAllPokemonBasic = useCallback(async () => {
        const key = 'all-pokemon-basic';
        if (CACHE[key]) return CACHE[key];

        const res = await fetch(`${API_BASE}/pokemon?limit=1025&offset=0`);
        if (!res.ok) throw new Error('Failed to fetch all pokemon');
        const data = await res.json();
        CACHE[key] = data.results;
        return data.results;
    }, []);

    return {
        pokemonList,
        loading,
        error,
        totalCount,
        hasMore,
        fetchPokemonList,
        fetchMore,
        searchPokemon,
        fetchPokemonDetail,
        fetchSpeciesData,
        fetchEvolutionChain,
        fetchAllPokemonBasic,
        setPokemonList,
    };
}

export default usePokemon;
