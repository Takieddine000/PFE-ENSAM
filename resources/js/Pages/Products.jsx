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
import { Head } from '@inertiajs/react';
import { Package } from 'lucide-react';
import useSort from '@/hooks/useSort';
import SortableHeader from '@/Components/SortableHeader';

const empty = { id_category: '', id_provider: '', name: '', stock: '', price: '', reorder_threshold: 5 };

export default function Products() {
    const { auth } = usePage().props;
    const isAdmin = auth.user.role === 'admin';
    const { toasts, toast, removeToast } = useToast();
    const { confirmState, confirm, closeConfirm, handleConfirm } = useConfirm();

    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [providers, setProviders] = useState([]);
    const [form, setForm] = useState(empty);
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [editing, setEditing] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [search, setSearch] = useState('');
    const [idSearch, setIdSearch] = useState('');
    const [filters, setFilters] = useState({});

    const { sortConfig, onSort, sortData } = useSort();

    const load = async () => {
        try {
            const [p, c, pr] = await Promise.all([api.get('/products'), api.get('/categories'), api.get('/providers')]);
            setItems(Array.isArray(p.data) ? p.data : p.data.data ?? []);
            setCategories(Array.isArray(c.data) ? c.data : c.data.data ?? []);
            setProviders(Array.isArray(pr.data) ? pr.data : pr.data.data ?? []);
        } catch (e) { console.error(e); }
    };
    useEffect(() => { load(); }, []);

    const openCreate = () => {
        setForm(empty); setImageFile(null); setPreviewUrl(null);
        setEditing(null); setShowModal(true);
    };

    const openEdit = (item) => {
        setForm({
            id_category: item.id_category,
            id_provider: item.id_provider,
            name: item.name,
            stock: item.stock,
            price: item.price,
            reorder_threshold: item.reorder_threshold ?? 5,
        });
        setImageFile(null);
        setPreviewUrl(item.image_url ?? null);
        setEditing(item.id); setShowModal(true);
    };

    const handleImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImageFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const save = async () => {
        try {
            const fd = new FormData();
            fd.append('id_category', form.id_category);
            fd.append('id_provider', form.id_provider);
            fd.append('name', form.name);
            fd.append('stock', form.stock);
            fd.append('price', form.price);
            fd.append('reorder_threshold', form.reorder_threshold);
            if (imageFile) fd.append('image', imageFile);

            if (editing) {
                fd.append('_method', 'PUT');
                await api.post(`/products/${editing}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
                toast.success(`"${form.name}" updated.`);
            } else {
                await api.post('/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
                toast.success(`"${form.name}" added.`);
            }
            setShowModal(false); setForm(empty); setImageFile(null); setPreviewUrl(null);
            load();
        } catch (e) { toast.error('Something went wrong.'); }
    };

    const remove = (item) => {
        confirm('Delete Product', `Delete "${item.name}"? This cannot be undone.`, async () => {
            try {
                await api.delete(`/products/${item.id}`);
                toast.success(`"${item.name}" deleted.`);
                load();
            } catch (e) { toast.error('Could not delete product.'); }
        });
    };

    const f = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

    const maxPrice  = Math.max(0, ...items.map(i => Number(i.price)));
    const maxStock  = Math.max(0, ...items.map(i => i.stock));
    const maxOrders = Math.max(0, ...items.map(i => i.orders_count ?? 0));

    const filtered = items.filter(i => {
        const matchId       = !idSearch || String(i.id) === String(idSearch);
        const matchSearch   = i.name.toLowerCase().includes(search.toLowerCase()) ||
            i.category?.name.toLowerCase().includes(search.toLowerCase()) ||
            i.provider?.name.toLowerCase().includes(search.toLowerCase());
        const matchCat      = !filters.category || String(i.id_category) === String(filters.category);
        const matchProv     = !filters.provider  || String(i.id_provider) === String(filters.provider);
        const matchMinPrice = Number(i.price) >= (filters.minPrice ?? 0);
        const matchMaxPrice = Number(i.price) <= (filters.maxPrice ?? maxPrice);
        const matchMinStock = i.stock >= (filters.minStock ?? 0);
        const matchMaxStock = i.stock <= (filters.maxStock ?? maxStock);
        const matchMinOrders = (i.orders_count ?? 0) >= (filters.minOrders ?? 0);
        const matchMaxOrders = (i.orders_count ?? 0) <= (filters.maxOrders ?? maxOrders);
        return matchId && matchSearch && matchCat && matchProv &&
            matchMinPrice && matchMaxPrice && matchMinStock && matchMaxStock &&
            matchMinOrders && matchMaxOrders;
    });

    return ( <>
        <Head title="Products" />
        <AuthenticatedLayout>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3>Products</h3>
                {isAdmin && <button className="btn btn-primary" onClick={openCreate}>+ New Product</button>}
            </div>

            <SearchBar search={search} setSearch={setSearch} idSearch={idSearch} setIdSearch={setIdSearch} placeholder="Search products..." />

            <FilterPanel filters={filters} setFilters={setFilters} config={[
                { type: 'select', key: 'category', label: 'Category', col: 2, options: categories.map(c => ({ value: c.id, label: c.name })) },
                { type: 'select', key: 'provider', label: 'Provider', col: 2, options: providers.map(p => ({ value: p.id, label: p.name })) },
                { type: 'range', label: 'Price ($)', keyMin: 'minPrice', keyMax: 'maxPrice', min: 0, max: maxPrice || 100, step: 0.01, prefix: '$', col: 3 },
                { type: 'range', label: 'Stock', keyMin: 'minStock', keyMax: 'maxStock', min: 0, max: maxStock || 100, col: 3 },
                { type: 'range', label: 'Orders', keyMin: 'minOrders', keyMax: 'maxOrders', min: 0, max: maxOrders || 10, col: 3 },
            ]} />

            <table className="table table-bordered table-hover align-middle">
                <thead className="table-dark">
                    <tr>
                        <th>Image</th>
                        <SortableHeader label="#"      sortKey="id"         sortConfig={sortConfig} onSort={onSort} />
                        <SortableHeader label="Name"      sortKey="name"         sortConfig={sortConfig} onSort={onSort} />
                        <SortableHeader label="Category"      sortKey="category"         sortConfig={sortConfig} onSort={onSort} />
                        <SortableHeader label="Provider"      sortKey="provider"         sortConfig={sortConfig} onSort={onSort} />
                        <SortableHeader label="Stock"      sortKey="stock"         sortConfig={sortConfig} onSort={onSort} />
                        <SortableHeader label="Price"      sortKey="price"         sortConfig={sortConfig} onSort={onSort} />
                        <SortableHeader label="Orders"      sortKey="orders_count"         sortConfig={sortConfig} onSort={onSort} />
                        {isAdmin && <th>Actions</th>}</tr>
                </thead>
                <tbody>
                    {sortData(filtered).map(i => (
                        <tr key={i.id}>
                            <td>
                                {i.image_url
                                    ? <img src={i.image_url} alt={i.name} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6 }} />
                                    : <div style={{ width: 48, height: 48, background: '#f0f0f0', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#010101' }}><Package size={25}/></div>
                                }
                            </td>
                            <td>{i.id}</td>
                            <td>{i.name}</td>
                            <td>{i.category?.name}</td>
                            <td>{i.provider?.name}</td>
                            <td><span className={`badge ${i.stock < i.reorder_threshold ? 'bg-danger' : 'bg-success'}`}>{i.stock}</span></td>
                            <td>${Number(i.price).toFixed(2)}</td>
                            <td>{i.orders_count ?? 0}</td>
                            {isAdmin && <td className="d-flex gap-2">
                                <button className="btn btn-sm btn-warning text-white" onClick={() => openEdit(i)}>Edit</button>
                                <button className="btn btn-sm btn-danger" onClick={() => remove(i)}>Delete</button>
                            </td>}
                        </tr>
                    ))}
                </tbody>
            </table>

            {showModal && (
                <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog"><div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{editing ? 'Edit' : 'New'} Product</h5>
                            <button className="btn-close" onClick={() => setShowModal(false)} />
                        </div>
                        <div className="modal-body row g-3">
                            <div className="col-12">
                                <label className="form-label">Name</label>
                                <input className="form-control" value={form.name} onChange={e => f('name', e.target.value)} />
                            </div>
                            <div className="col-6">
                                <label className="form-label">Category</label>
                                <select className="form-select" value={form.id_category} onChange={e => f('id_category', e.target.value)}>
                                    <option value="">Select...</option>
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div className="col-6">
                                <label className="form-label">Provider</label>
                                <select className="form-select" value={form.id_provider} onChange={e => f('id_provider', e.target.value)}>
                                    <option value="">Select...</option>
                                    {providers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                            </div>
                            <div className="col-6">
                                <label className="form-label">Stock</label>
                                <input type="number" className="form-control" value={form.stock} onChange={e => f('stock', e.target.value)} />
                            </div>
                            <div className="col-6">
                                <label className="form-label">Reorder Threshold</label>
                                <input type="number" className="form-control" value={form.reorder_threshold} onChange={e => f('reorder_threshold', e.target.value)} />
                            </div>
                            <div className="col-6">
                                <label className="form-label">Price ($)</label>
                                <input type="number" className="form-control" value={form.price} onChange={e => f('price', e.target.value)} />
                            </div>
                            <div className="col-12">
                                <label className="form-label">Image</label>
                                <input type="file" className="form-control" accept="image/*" onChange={handleImage} />
                                {previewUrl && (
                                    <div className="mt-2">
                                        <img src={previewUrl} alt="Preview" style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8 }} />
                                    </div>
                                )}
                            </div>
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
        </AuthenticatedLayout></>
    );
}