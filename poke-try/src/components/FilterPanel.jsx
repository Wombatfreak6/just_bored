import React, { useState } from 'react';
import TypeBadge from './TypeBadge';

const ALL_TYPES = [
    'normal', 'fire', 'water', 'grass', 'electric', 'ice',
    'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
    'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy',
];

const GENERATIONS = [
    { label: 'Gen I', value: 'generation-i', range: [1, 151] },
    { label: 'Gen II', value: 'generation-ii', range: [152, 251] },
    { label: 'Gen III', value: 'generation-iii', range: [252, 386] },
    { label: 'Gen IV', value: 'generation-iv', range: [387, 493] },
    { label: 'Gen V', value: 'generation-v', range: [494, 649] },
    { label: 'Gen VI', value: 'generation-vi', range: [650, 721] },
    { label: 'Gen VII', value: 'generation-vii', range: [722, 809] },
    { label: 'Gen VIII', value: 'generation-viii', range: [810, 905] },
    { label: 'Gen IX', value: 'generation-ix', range: [906, 1025] },
];

const SORT_OPTIONS = [
    { label: 'Dex #', value: 'id' },
    { label: 'Name A-Z', value: 'name-asc' },
    { label: 'Name Z-A', value: 'name-desc' },
    { label: 'Total Stats', value: 'totalStats' },
    { label: 'HP', value: 'hp' },
    { label: 'Attack', value: 'attack' },
    { label: 'Speed', value: 'speed' },
];

const FilterPanel = ({ filters, onFilterChange, resultCount, isOpen, onToggle }) => {
    const { selectedTypes = [], selectedGen = null, category = 'all', statRanges = {}, sortBy = 'id', sortDir = 'asc' } = filters;

    const toggleType = (type) => {
        const next = selectedTypes.includes(type)
            ? selectedTypes.filter(t => t !== type)
            : [...selectedTypes, type];
        onFilterChange({ ...filters, selectedTypes: next });
    };

    const updateStatRange = (stat, field, value) => {
        onFilterChange({
            ...filters,
            statRanges: {
                ...statRanges,
                [stat]: { ...statRanges[stat], [field]: parseInt(value) || 0 },
            },
        });
    };

    const clearAll = () => {
        onFilterChange({
            selectedTypes: [],
            selectedGen: null,
            category: 'all',
            statRanges: {},
            sortBy: 'id',
            sortDir: 'asc',
        });
    };

    const hasActiveFilters = selectedTypes.length > 0 || selectedGen || category !== 'all' ||
        Object.keys(statRanges).length > 0;

    return (
        <div>
            {/* Toggle button + result count */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px',
                flexWrap: 'wrap',
                gap: '10px',
            }}>
                <button onClick={onToggle} className="btn-pixel" style={{ fontSize: '8px' }}>
                    {isOpen ? '▲ HIDE FILTERS' : '▼ SHOW FILTERS'}
                </button>
                <span style={{
                    fontFamily: "'VT323', monospace",
                    fontSize: '20px',
                    color: 'var(--neon-blue)',
                }}>
                    {resultCount} Pokémon found
                </span>
            </div>

            {/* Active filter tags */}
            {hasActiveFilters && (
                <div style={{
                    display: 'flex',
                    gap: '6px',
                    flexWrap: 'wrap',
                    marginBottom: '12px',
                }}>
                    {selectedTypes.map(t => (
                        <button
                            key={t}
                            onClick={() => toggleType(t)}
                            style={{
                                fontFamily: "'Press Start 2P', cursive",
                                fontSize: '7px',
                                padding: '4px 8px',
                                background: 'rgba(255,61,61,0.1)',
                                border: '2px solid var(--neon-red)',
                                color: 'var(--neon-red)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                            }}
                        >
                            {t.toUpperCase()} ✕
                        </button>
                    ))}
                    {selectedGen && (
                        <button
                            onClick={() => onFilterChange({ ...filters, selectedGen: null })}
                            style={{
                                fontFamily: "'Press Start 2P', cursive",
                                fontSize: '7px',
                                padding: '4px 8px',
                                background: 'rgba(79,195,247,0.1)',
                                border: '2px solid var(--neon-blue)',
                                color: 'var(--neon-blue)',
                                cursor: 'pointer',
                            }}
                        >
                            {GENERATIONS.find(g => g.value === selectedGen)?.label || selectedGen} ✕
                        </button>
                    )}
                    {category !== 'all' && (
                        <button
                            onClick={() => onFilterChange({ ...filters, category: 'all' })}
                            style={{
                                fontFamily: "'Press Start 2P', cursive",
                                fontSize: '7px',
                                padding: '4px 8px',
                                background: 'rgba(255,215,0,0.1)',
                                border: '2px solid var(--neon-yellow)',
                                color: 'var(--neon-yellow)',
                                cursor: 'pointer',
                            }}
                        >
                            {category.toUpperCase()} ✕
                        </button>
                    )}
                    <button
                        onClick={clearAll}
                        style={{
                            fontFamily: "'Press Start 2P', cursive",
                            fontSize: '7px',
                            padding: '4px 8px',
                            background: 'transparent',
                            border: '2px solid var(--text-dim)',
                            color: 'var(--text-dim)',
                            cursor: 'pointer',
                        }}
                    >
                        CLEAR ALL
                    </button>
                </div>
            )}

            {isOpen && (
                <div style={{
                    background: 'var(--bg-panel)',
                    border: '3px solid var(--pixel-border)',
                    boxShadow: '4px 4px 0px rgba(255,215,0,0.2)',
                    padding: '16px',
                    marginBottom: '16px',
                }}>
                    {/* Type Filter */}
                    <div style={{ marginBottom: '16px' }}>
                        <h4 style={{
                            fontFamily: "'Press Start 2P', cursive",
                            fontSize: '9px',
                            color: 'var(--neon-yellow)',
                            marginBottom: '10px',
                        }}>
                            TYPE
                        </h4>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            {ALL_TYPES.map(type => (
                                <button
                                    key={type}
                                    onClick={() => toggleType(type)}
                                    style={{
                                        opacity: selectedTypes.includes(type) ? 1 : 0.5,
                                        transform: selectedTypes.includes(type) ? 'scale(1.05)' : 'scale(1)',
                                        transition: 'all 0.15s ease',
                                        cursor: 'pointer',
                                        background: 'none',
                                        border: 'none',
                                        padding: 0,
                                    }}
                                >
                                    <TypeBadge type={type} small />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Generation Filter */}
                    <div style={{ marginBottom: '16px' }}>
                        <h4 style={{
                            fontFamily: "'Press Start 2P', cursive",
                            fontSize: '9px',
                            color: 'var(--neon-yellow)',
                            marginBottom: '10px',
                        }}>
                            GENERATION
                        </h4>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            {GENERATIONS.map(gen => (
                                <button
                                    key={gen.value}
                                    onClick={() => onFilterChange({
                                        ...filters, selectedGen: selectedGen === gen.value ? null : gen.value
                                    })}
                                    className="btn-pixel"
                                    style={{
                                        fontSize: '7px',
                                        padding: '5px 8px',
                                        background: selectedGen === gen.value ? 'rgba(255,215,0,0.15)' : 'transparent',
                                        opacity: selectedGen === gen.value ? 1 : 0.6,
                                    }}
                                >
                                    {gen.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Category Toggle */}
                    <div style={{ marginBottom: '16px' }}>
                        <h4 style={{
                            fontFamily: "'Press Start 2P', cursive",
                            fontSize: '9px',
                            color: 'var(--neon-yellow)',
                            marginBottom: '10px',
                        }}>
                            CATEGORY
                        </h4>
                        <div style={{ display: 'flex', gap: '6px' }}>
                            {['all', 'legendary', 'mythical', 'regular'].map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => onFilterChange({ ...filters, category: cat })}
                                    className="btn-pixel"
                                    style={{
                                        fontSize: '7px',
                                        padding: '5px 8px',
                                        background: category === cat ? 'rgba(255,215,0,0.15)' : 'transparent',
                                        opacity: category === cat ? 1 : 0.6,
                                    }}
                                >
                                    {cat.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Stat Sliders */}
                    <div style={{ marginBottom: '16px' }}>
                        <h4 style={{
                            fontFamily: "'Press Start 2P', cursive",
                            fontSize: '9px',
                            color: 'var(--neon-yellow)',
                            marginBottom: '10px',
                        }}>
                            STAT RANGES
                        </h4>
                        {['hp', 'attack', 'speed'].map(stat => (
                            <div key={stat} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                marginBottom: '8px',
                            }}>
                                <span style={{
                                    fontFamily: "'Press Start 2P', cursive",
                                    fontSize: '7px',
                                    width: '50px',
                                    color: 'var(--text-dim)',
                                    textTransform: 'uppercase',
                                }}>
                                    {stat}
                                </span>
                                <input
                                    type="range"
                                    min="0"
                                    max="255"
                                    value={statRanges[stat]?.min || 0}
                                    onChange={e => updateStatRange(stat, 'min', e.target.value)}
                                    style={{
                                        flex: 1,
                                        accentColor: 'var(--neon-yellow)',
                                        cursor: 'pointer',
                                    }}
                                    aria-label={`Minimum ${stat}`}
                                />
                                <span style={{
                                    fontFamily: "'Courier Prime', monospace",
                                    fontSize: '14px',
                                    width: '70px',
                                    textAlign: 'center',
                                    color: 'var(--text-primary)',
                                }}>
                                    {statRanges[stat]?.min || 0}–{statRanges[stat]?.max || 255}
                                </span>
                                <input
                                    type="range"
                                    min="0"
                                    max="255"
                                    value={statRanges[stat]?.max || 255}
                                    onChange={e => updateStatRange(stat, 'max', e.target.value)}
                                    style={{
                                        flex: 1,
                                        accentColor: 'var(--neon-yellow)',
                                        cursor: 'pointer',
                                    }}
                                    aria-label={`Maximum ${stat}`}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Sort */}
                    <div>
                        <h4 style={{
                            fontFamily: "'Press Start 2P', cursive",
                            fontSize: '9px',
                            color: 'var(--neon-yellow)',
                            marginBottom: '10px',
                        }}>
                            SORT BY
                        </h4>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                            <select
                                value={sortBy}
                                onChange={e => onFilterChange({ ...filters, sortBy: e.target.value })}
                                aria-label="Sort by"
                                style={{
                                    background: 'var(--bg-dark)',
                                    color: 'var(--text-primary)',
                                    border: '2px solid var(--pixel-border)',
                                    fontFamily: "'VT323', monospace",
                                    fontSize: '18px',
                                    padding: '6px 10px',
                                    cursor: 'pointer',
                                }}
                            >
                                {SORT_OPTIONS.map(o => (
                                    <option key={o.value} value={o.value}>{o.label}</option>
                                ))}
                            </select>
                            <button
                                onClick={() => onFilterChange({ ...filters, sortDir: sortDir === 'asc' ? 'desc' : 'asc' })}
                                className="btn-pixel"
                                style={{ fontSize: '8px', padding: '6px 10px' }}
                            >
                                {sortDir === 'asc' ? '▲ ASC' : '▼ DESC'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export { GENERATIONS };
export default FilterPanel;
