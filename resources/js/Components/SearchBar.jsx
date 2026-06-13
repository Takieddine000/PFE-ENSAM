export default function SearchBar({ search, setSearch, idSearch, setIdSearch, placeholder = 'Search...' }) {
    return (
        <div className="d-flex gap-2 mb-2">
            <input
                className="form-control"
                placeholder={placeholder}
                value={search}
                onChange={e => setSearch(e.target.value)}
            />
            <input
                type="number"
                className="form-control"
                placeholder="ID..."
                value={idSearch}
                onChange={e => setIdSearch(e.target.value)}
                style={{ width: '33%', flexShrink: 0 }}
            />
        </div>
    );
}