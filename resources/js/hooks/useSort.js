import { useState } from 'react';

export default function useSort() {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

    const onSort = (key) => {
        setSortConfig(prev => {
            if (prev.key !== key) return { key, direction: 'asc' };
            if (prev.direction === 'asc') return { key, direction: 'desc' };
            return { key: null, direction: null };
        });
    };

    const sortData = (data) => {
        if (!sortConfig.key) return data;
        return [...data].sort((a, b) => {
            let valA = a[sortConfig.key];
            let valB = b[sortConfig.key];

            if (sortConfig.key.includes('.')) {
                const parts = sortConfig.key.split('.');
                valA = parts.reduce((obj, k) => obj?.[k], a);
                valB = parts.reduce((obj, k) => obj?.[k], b);
            }

            if (valA == null) valA = '';
            if (valB == null) valB = '';

            if (typeof valA === 'string') {
                return sortConfig.direction === 'asc'
                    ? valA.localeCompare(valB)
                    : valB.localeCompare(valA);
            }

            return sortConfig.direction === 'asc' ? valA - valB : valB - valA;
        });
    };

    return { sortConfig, onSort, sortData };
}