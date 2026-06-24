import { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { usePage } from '@inertiajs/react';
import api from '@/api';
import FilterPanel from '@/Components/FilterPanel';
import SearchBar from '@/Components/SearchBar';
import ConfirmModal from '@/Components/ConfirmModal';
import useToast from '@/hooks/useToast';
import useConfirm from '@/hooks/useConfirm';
import useSort from '@/hooks/useSort';
import SortableHeader from '@/Components/SortableHeader';
import ToastContainer from '@/Components/Toast';

export default function Orders() {
    const { auth } = usePage().props;
    const isAdmin = auth.user.role === 'admin';
    const { toasts, toast, removeToast } = useToast();
    const { confirmState, confirm, closeConfirm, handleConfirm } = useConfirm();
    const { sortConfig, onSort, sortData } = useSort();

    const [items, setItems] = useState([]);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [providers, setProviders] = useState([]);
    const [form, setForm] = useState({ id_product: '', amount: '' });
    const [editing, setEditing] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [search, setSearch] = useState('');
    const [idSearch, setIdSearch] = useState('');
    const [filters, setFilters] = useState({});

    const load = async () => {
        try {
            const [o, p, c, pr] = await Promise.all([
                api.get('/orders'), api.get('/products'),
                api.get('/categories'), api.get('/providers')
            ]);
            const prods = Array.isArray(p.data) ? p.data : p.data.data ?? [];
            const orders = (Array.isArray(o.data) ? o.data : o.data.data ?? []).map(order => {
                const product = prods.find(p => p.id === order.id_product);
                return {
                    ...order,
                    category_name: product?.category?.name ?? '',
                    provider_name: product?.provider?.name ?? '',
                    product_price: Number(product?.price ?? 0),
                };
            });
            setItems(orders);
            setProducts(prods);
            setCategories(Array.isArray(c.data) ? c.data : c.data.data ?? []);
            setProviders(Array.isArray(pr.data) ? pr.data : pr.data.data ?? []);
        } catch (e) { console.error(e); }
    };
    
    useEffect(() => { load(); }, []);

    const openCreate = () => { setForm({ id_product: '', amount: '' }); setEditing(null); setShowModal(true); };
    const openEdit = (item) => { setForm({ id_product: item.id_product, amount: item.amount }); setEditing(item.id); setShowModal(true); };

    const save = async () => {
        try {
            const product = products.find(p => p.id == form.id_product);
            if (editing) {
                await api.put(`/orders/${editing}`, form);
                toast.success(`Order for "${product?.name}" updated.`);
            } else {
                await api.post('/orders', form);
                toast.success(`Order for "${product?.name}" placed.`);
                window.dispatchEvent(new Event('notifications:refresh'));
            }
            setShowModal(false); setForm({ id_product: '', amount: '' }); load();
        } catch (e) {
            const msg = e.response?.data?.message ?? 'Something went wrong.';
            toast.error(msg);
        }
    };

    const remove = (item) => {
        confirm('Delete Order', `Delete order #${item.id}?`, async () => {
            try {
                await api.delete(`/orders/${item.id}`);
                toast.success(`Order #${item.id} deleted.`);
                load();
            } catch (e) { toast.error('Could not delete.'); }
        });
    };

    const confirmOrder = async (item) => {
        try {
            await api.put(`/orders/${item.id}/confirm`);
            toast.success(`Order #${item.id} confirmed.`);
            load();
        } catch (e) {
            toast.error(e.response?.data?.message ?? 'Could not confirm order.');
        }
    };

    const maxAmount = Math.max(0, ...items.map(i => i.amount));
    const maxPrice  = Math.max(0, ...products.map(p => Number(p.price)));
    const maxStock  = Math.max(0, ...products.map(p => p.stock));

    const filtered = items.filter(i => {
        const product = products.find(p => p.id === i.id_product);
        const matchId       = !idSearch || String(i.id) === String(idSearch);
        const matchSearch   = i.product?.name.toLowerCase().includes(search.toLowerCase());
        const matchProduct  = !filters.product  || String(i.id_product) === String(filters.product);
        const matchCategory = !filters.category || String(product?.id_category) === String(filters.category);
        const matchProvider = !filters.provider || String(product?.id_provider) === String(filters.provider);
        const matchStatus   = !filters.status   || i.status === filters.status;
        const matchMinAmt   = i.amount >= (filters.minAmount ?? 0);
        const matchMaxAmt   = i.amount <= (filters.maxAmount ?? maxAmount);
        const matchMinPrice = Number(product?.price ?? 0) >= (filters.minPrice ?? 0);
        const matchMaxPrice = Number(product?.price ?? 0) <= (filters.maxPrice ?? maxPrice);
        const matchMinStock = (product?.stock ?? 0) >= (filters.minStock ?? 0);
        const matchMaxStock = (product?.stock ?? 0) <= (filters.maxStock ?? maxStock);
        const matchDate     = !filters.date || i.created_at?.startsWith(filters.date);
        return matchId && matchSearch && matchProduct && matchCategory && matchProvider &&
            matchStatus && matchMinAmt && matchMaxAmt && matchMinPrice && matchMaxPrice &&
            matchMinStock && matchMaxStock && matchDate;
    });

    return (
        <>
            <Head title="Orders" />
            <AuthenticatedLayout>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3>Orders</h3>
                    <button className="btn btn-primary" onClick={openCreate}>+ New Order</button>
                </div>

                <SearchBar search={search} setSearch={setSearch} idSearch={idSearch} setIdSearch={setIdSearch} placeholder="Search by product..." />

                <FilterPanel filters={filters} setFilters={setFilters} config={[
                    { type: 'select', key: 'status',   label: 'Status',   col: 2, options: [
                        { value: 'pending',   label: 'Pending'   },
                        { value: 'confirmed', label: 'Confirmed' },
                    ]},
                    { type: 'select', key: 'product',  label: 'Product',  col: 2, options: products.map(p   => ({ value: p.id,  label: p.name  })) },
                    { type: 'select', key: 'category', label: 'Category', col: 2, options: categories.map(c => ({ value: c.id,  label: c.name  })) },
                    { type: 'select', key: 'provider', label: 'Provider', col: 2, options: providers.map(p  => ({ value: p.id,  label: p.name  })) },
                    { type: 'range',  label: 'Amount',    keyMin: 'minAmount', keyMax: 'maxAmount', min: 0, max: maxAmount || 100, col: 3 },
                    { type: 'range',  label: 'Price ($)', keyMin: 'minPrice',  keyMax: 'maxPrice',  min: 0, max: maxPrice  || 100, step: 0.01, prefix: '$', col: 3 },
                    { type: 'range',  label: 'Stock',     keyMin: 'minStock',  keyMax: 'maxStock',  min: 0, max: maxStock  || 100, col: 3 },
                    { type: 'date',   key: 'date', label: 'Date', col: 2 },
                ]} />

                <table className="table table-bordered table-hover">
                    <thead className="table-dark">
                        <tr>
                            <SortableHeader label="#"       sortKey="id"           sortConfig={sortConfig} onSort={onSort} />
                            <SortableHeader label="Product" sortKey="product.name" sortConfig={sortConfig} onSort={onSort} />
                            <SortableHeader label="Category" sortKey="category_name" sortConfig={sortConfig} onSort={onSort} />
                            <SortableHeader label="Provider" sortKey="provider_name" sortConfig={sortConfig} onSort={onSort} />
                            <SortableHeader label="Amount"  sortKey="amount"       sortConfig={sortConfig} onSort={onSort} />
                            <SortableHeader label="Price"    sortKey="product_price" sortConfig={sortConfig} onSort={onSort} />
                            <SortableHeader label="Status"  sortKey="status"       sortConfig={sortConfig} onSort={onSort} />
                            <SortableHeader label="Date"    sortKey="created_at"   sortConfig={sortConfig} onSort={onSort} />
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortData(filtered).map(i => {
                            const product = products.find(p => p.id === i.id_product);
                            return (
                                <tr key={i.id}>
                                    <td>{i.id}</td>
                                    <td>{i.product?.name}</td>
                                    <td>{product?.category?.name ?? '—'}</td>
                                    <td>{product?.provider?.name ?? '—'}</td>
                                    <td>{i.amount}</td>
                                    <td>${Number(product?.price ?? 0).toFixed(2)}</td>
                                    <td>
                                        {i.status === 'confirmed' && <span className="badge bg-success">Confirmed</span>}
                                        {i.status === 'cancelled' && <span className="badge bg-danger">Cancelled</span>}
                                        {i.status === 'pending'   && <span className="badge bg-warning text-dark">Pending</span>}
                                    </td>
                                    <td>{new Date(i.created_at).toLocaleDateString()}</td>
                                    <td>
                                        <div className="d-flex gap-2 flex-wrap">
                                            {i.status === 'pending' && (
                                                <>
                                                    <button className="btn btn-sm btn-success" onClick={() => confirmOrder(i)}>Confirm</button>
                                                    <button className="btn btn-sm btn-warning text-white" onClick={() => openEdit(i)}>Edit</button>
                                                    <button className="btn btn-sm btn-danger" onClick={() => remove(i)}>Delete</button>
                                                </>
                                            )}
                                            {i.status === 'confirmed' && (
                                                <span className="text-muted small">—</span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        {filtered.length === 0 && (
                            <tr><td colSpan={9} className="text-muted small p-3">No orders yet.</td></tr>
                        )}
                    </tbody>
                </table>

                {showModal && (
                    <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog"><div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{editing ? 'Edit' : 'New'} Order</h5>
                                <button className="btn-close" onClick={() => setShowModal(false)} />
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">
                                        Product
                                        {form.id_product && (() => {
                                            const p = products.find(p => p.id == form.id_product);
                                            return p ? <span className="text-muted small ms-2">(max: {p.stock})</span> : null;
                                        })()}
                                    </label>
                                    <select className="form-select" value={form.id_product} onChange={e => setForm({ ...form, id_product: e.target.value })}>
                                        <option value="">Select...</option>
                                        {products.map(p => <option key={p.id} value={p.id}>{p.name} (stock: {p.stock})</option>)}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Amount</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={form.amount}
                                        min={1}
                                        max={products.find(p => p.id == form.id_product)?.stock ?? undefined}
                                        onChange={e => setForm({ ...form, amount: e.target.value })}
                                    />
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
            </AuthenticatedLayout>
        </>
    );
}