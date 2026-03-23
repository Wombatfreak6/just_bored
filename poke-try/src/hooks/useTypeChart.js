import { useCallback } from 'react';
import TYPE_CHART from '../data/typeChart';

export function useTypeChart() {
    const getEffectiveness = useCallback((attackType, defenderTypes) => {
        if (!attackType || !defenderTypes?.length) return 1;

        const atkType = attackType.toLowerCase();
        let multiplier = 1;

        for (const defType of defenderTypes) {
            const dt = defType.toLowerCase();
            if (TYPE_CHART[atkType] && TYPE_CHART[atkType][dt] !== undefined) {
                multiplier *= TYPE_CHART[atkType][dt];
            }
        }

        return multiplier;
    }, []);

    const getEffectivenessLabel = useCallback((multiplier) => {
        if (multiplier === 0) return { text: "It doesn't affect", color: '#666' };
        if (multiplier < 1) return { text: "It's not very effective...", color: '#888' };
        if (multiplier > 1) return { text: "It's super effective!", color: '#FFD700' };
        return { text: '', color: '' };
    }, []);

    return { getEffectiveness, getEffectivenessLabel };
}

export default useTypeChart;
