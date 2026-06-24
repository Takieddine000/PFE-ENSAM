import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

export default function SortableHeader({ label, sortKey, sortConfig, onSort }) {
    const isActive = sortConfig.key === sortKey;
    const direction = isActive ? sortConfig.direction : null;

    return (
        <th onClick={() => onSort(sortKey)} style={{ cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}>
            <div className="d-flex align-items-center gap-1">
                {label}
                {direction === 'asc'  && <ChevronUp size={14} />}
                {direction === 'desc' && <ChevronDown size={14} />}
                {!isActive && <ChevronsUpDown size={14} style={{ opacity: 0.4 }} />}
            </div>
        </th>
    );
}