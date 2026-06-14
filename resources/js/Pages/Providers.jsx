import { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { usePage } from '@inertiajs/react';
import api from '@/api';
import FilterPanel from '@/Components/FilterPanel';
import SearchBar from '@/Components/SearchBar';
import ConfirmModal from '@/Components/ConfirmModal';
import useToast from '@/hooks/useToast';
import useConfirm from '@/hooks/useConfirm';
import ToastContainer from '@/Components/Toast';

export default function Providers() {
    const { auth } = usePage().props;
    const isAdmin = auth.user.role === 'admin';
    const { toasts, toast, removeToast } = useToast();
    const { confirmState, confirm, closeConfirm, handleConfirm } = useConfirm();

    const [items, setItems] = useState([]);
    const [form, setForm] = useState({ name: '' });
    const [editing, setEditing] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [search, setSearch] = useState('');
    const [idSearch, setIdSearch] = useState('');
    const [filters, setFilters] = useState({});

    const load = () => api.get('/providers').then(r => setItems(Array.isArray(r.data) ? r.data : r.data.data ?? []));
    useEffect(() => { load().catch(console.error); }, []);

    const openCreate = () => { setForm({ name: '' }); setEditing(null); setShowModal(true); };
    const openEdit   = (item) => { setForm({ name: item.name }); setEditing(item.id); setShowModal(true); };

    const save = async () => {
        try {
            if (editing) {
                await api.put(`/providers/${editing}`, form);
                toast.success(`"${form.name}" updated.`);
            } else {
                await api.post('/providers', form);
                toast.success(`"${form.name}" added.`);
            }
            setShowModal(false); setForm({ name: '' }); load();
        } catch (e) { toast.error('Something went wrong.'); }
    };

    const deleteItem = (item) => {
        confirm('Delete Provider', `Delete "${item.name}"? This cannot be undone.`, async () => {
            try {
                await api.delete(`/providers/${item.id}`);
                toast.success(`"${item.name}" deleted.`);
                load();
            } catch (e) { toast.error('Could not delete.'); }
        });
    };

    const maxProducts = Math.max(0, ...items.map(i => i.products_count ?? 0));

    const filtered = items
        .filter(i => {
            const matchId     = !idSearch || String(i.id) === String(idSearch);
            const matchSearch = i.name.toLowerCase().includes(search.toLowerCase());
            const count    = i.products_count ?? 0;
            const matchMin = count >= (filters.minProducts ?? 0);
            const matchMax = count <= (filters.maxProducts ?? maxProducts);
            const matchHas = !filters.hasProducts ||
                (filters.hasProducts === 'yes' ? count > 0 : count === 0);
            return matchId && matchSearch && matchMin && matchMax && matchHas;
        })
        .sort((a, b) => {
            switch (filters.sortBy) {
                case 'az':    return a.name.localeCompare(b.name);
                case 'za':    return b.name.localeCompare(a.name);
                case 'most':  return (b.products_count ?? 0) - (a.products_count ?? 0);
                case 'least': return (a.products_count ?? 0) - (b.products_count ?? 0);
                default:      return 0;
            }
        });

    return (
        <AuthenticatedLayout>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3>Providers</h3>
                {isAdmin && <button className="btn btn-primary" onClick={openCreate}>+ New Provider</button>}
            </div>

            <SearchBar search={search} setSearch={setSearch} idSearch={idSearch} setIdSearch={setIdSearch} placeholder="Search providers..." />

            <FilterPanel filters={filters} setFilters={setFilters} config={[
                { type: 'select', key: 'hasProducts', label: 'Has Products', col: 3, options: [
                    { value: 'yes', label: 'Has Products' },
                    { value: 'no',  label: 'No Products'  },
                ]},
                { type: 'select', key: 'sortBy', label: 'Sort By', col: 3, options: [
                    { value: 'az',    label: 'A → Z'          },
                    { value: 'za',    label: 'Z → A'          },
                    { value: 'most',  label: 'Most Products'  },
                    { value: 'least', label: 'Least Products' },
                ]},
                { type: 'range', label: 'Products Count', keyMin: 'minProducts', keyMax: 'maxProducts', min: 0, max: maxProducts || 10, col: 6 },
            ]} />

            <table className="table table-bordered table-hover">
                <thead className="table-dark">
                    <tr><th>#</th><th>Name</th><th>Products</th>{isAdmin && <th>Actions</th>}</tr>
                </thead>
                <tbody>
                    {filtered.map(i => (
                        <tr key={i.id}>
                            <td>{i.id}</td>
                            <td>{i.name}</td>
                            <td><span className="badge bg-primary">{i.products_count ?? 0}</span></td>
                            {isAdmin && <td className="d-flex gap-2">
                                <button className="btn btn-sm btn-warning text-white" onClick={() => openEdit(i)}>Edit</button>
                                <button className="btn btn-sm btn-danger" onClick={() => deleteItem(i)}>Delete</button>
                            </td>}
                        </tr>
                    ))}
                </tbody>
            </table>

            {showModal && (
                <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog"><div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{editing ? 'Edit' : 'New'} Provider</h5>
                            <button className="btn-close" onClick={() => setShowModal(false)} />
                        </div>
                        <div className="modal-body">
                            <label className="form-label">Name</label>
                            <input className="form-control" value={form.name} onChange={e => setForm({ name: e.target.value })} />
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                            <button className="btn btn-primary" onClick={save}>Save</button>
                        </div>
                    </div></div>
                </div>
            )}

            <ConfirmModal
                show={confirmState.show}
                title={confirmState.title}
                message={confirmState.message}
                onConfirm={handleConfirm}
                onCancel={closeConfirm}
            />

            <ToastContainer toasts={toasts} remove={removeToast} />
        </AuthenticatedLayout>
    );
}