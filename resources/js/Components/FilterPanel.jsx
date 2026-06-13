export default function FilterPanel({ filters, setFilters, config }) {
    const update = (key, val) => setFilters(prev => ({ ...prev, [key]: val }));

    const selects = config.filter(f => f.type === 'select' || f.type === 'date');
    const ranges  = config.filter(f => f.type === 'range');

    return (
        <div className="card border-0 shadow-sm mb-3 p-3">
            {/* Selects & Date row */}
            {selects.length > 0 && (
                <div className="d-flex flex-wrap gap-3 align-items-end mb-3">
                    {selects.map(f => (
                        <div key={f.key} style={{ minWidth: 160, flex: '1 1 160px' }}>
                            <label className="form-label small fw-semibold mb-1">{f.label}</label>
                            {f.type === 'select' && (
                                <select className="form-select form-select-sm"
                                    value={filters[f.key] ?? ''}
                                    onChange={e => update(f.key, e.target.value)}>
                                    <option value="">All</option>
                                    {f.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                </select>
                            )}
                            {f.type === 'date' && (
                                <input type="date" className="form-control form-control-sm"
                                    value={filters[f.key] ?? ''}
                                    onChange={e => update(f.key, e.target.value)} />
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Ranges row */}
            {ranges.length > 0 && (
                <div className="d-flex flex-wrap gap-3 align-items-end">
                    {ranges.map(f => (
                        <div key={f.keyMin} style={{ minWidth: 180, flex: '1 1 180px' }}>
                            <label className="form-label small fw-semibold mb-1">
                                {f.label}
                                <span className="text-muted ms-2">
                                    {f.prefix ?? ''}{filters[f.keyMin] ?? f.min} — {f.prefix ?? ''}{filters[f.keyMax] ?? f.max}
                                </span>
                            </label>
                            <input type="range" className="form-range" min={f.min} max={f.max} step={f.step ?? 1}
                                value={filters[f.keyMin] ?? f.min}
                                onChange={e => update(f.keyMin, Number(e.target.value))} />
                            <input type="range" className="form-range" min={f.min} max={f.max} step={f.step ?? 1}
                                value={filters[f.keyMax] ?? f.max}
                                onChange={e => update(f.keyMax, Number(e.target.value))} />
                        </div>
                    ))}
                </div>
            )}

            {/* Reset */}
            <div className="mt-3">
                <button className="btn btn-sm btn-outline-secondary" onClick={() => setFilters({})}>
                    Reset Filters
                </button>
            </div>
        </div>
    );
}