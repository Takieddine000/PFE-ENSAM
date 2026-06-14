import { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { usePage } from '@inertiajs/react';
import api from '@/api';
import useToast from '@/hooks/useToast';
import useConfirm from '@/hooks/useConfirm';
import ToastContainer from '@/Components/Toast';
import ConfirmModal from '@/Components/ConfirmModal';
import SearchBar from '@/Components/SearchBar';
import { Pencil, Activity, Trash2 } from 'lucide-react';

const emptyProfile = { name: '', email: '', current_password: '', password: '', password_confirmation: '' };

export default function Users() {
    const { auth } = usePage().props;
    const isAdmin = auth.user.role === 'admin';
    const { toasts, toast, removeToast } = useToast();
    const { confirmState, confirm, closeConfirm, handleConfirm } = useConfirm();

    const [users, setUsers] = useState([]);
    const [logs, setLogs] = useState([]);
    const [search, setSearch] = useState('');
    const [idSearch, setIdSearch] = useState('');
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editUser, setEditUser] = useState(null);
    const [editForm, setEditForm] = useState({ name: '', email: '', password: '', password_confirmation: '' });
    const [profile, setProfile] = useState(emptyProfile);
    const [profileError, setProfileError] = useState('');
    const [profileSuccess, setProfileSuccess] = useState('');

    // Log filters
    const [logId, setLogId] = useState('');
    const [logUser, setLogUser] = useState('');
    const [logAction, setLogAction] = useState('');
    const [logDate, setLogDate] = useState('');

    const load = () => api.get('/users').then(r => setUsers(Array.isArray(r.data) ? r.data : r.data.data ?? []));
    const loadLogs = () => isAdmin && api.get('/activity-logs').then(r => setLogs(Array.isArray(r.data) ? r.data : []));

    useEffect(() => {
        load().catch(console.error);
        loadLogs();
    }, []);

    const openProfile = () => {
        setProfile({ name: auth.user.name, email: auth.user.email, current_password: '', password: '', password_confirmation: '' });
        setProfileError(''); setProfileSuccess('');
        setShowProfileModal(true);
    };

    const openEdit = (u) => {
        setEditUser(u);
        setEditForm({ name: u.name, email: u.email, password: '', password_confirmation: '' });
        setShowEditModal(true);
    };

    const saveEdit = async () => {
        try {
            await api.put(`/users/${editUser.id}/info`, editForm);
            toast.success(`${editUser.name} updated.`);
            setShowEditModal(false);
            load(); loadLogs();
        } catch (e) {
            const errors = e.response?.data?.errors;
            const msg = errors
                ? Object.values(errors).flat().join(' ')
                : (e.response?.data?.message ?? 'Could not update user.');
            toast.error(msg);
        }
    };

    const saveProfile = async () => {
        setProfileError(''); setProfileSuccess('');
        try {
            await api.put('/profile', profile);
            toast.success('Profile updated successfully.');
            setProfile(prev => ({ ...prev, current_password: '', password: '', password_confirmation: '' }));
        } catch (e) {
            const errors = e.response?.data?.errors;
            const msg = errors ? Object.values(errors).flat().join(' ') : (e.response?.data?.message ?? 'Something went wrong.');
            setProfileError(msg);
            toast.error(msg);
        }
    };

    const changeRole = async (user, role) => {
        try {
            await api.put(`/users/${user.id}`, { role });
            toast.success(`${user.name} is now ${role}.`);
            load(); loadLogs();
        } catch (e) { toast.error('Could not change role.'); }
    };

    const deleteUser = (user) => {
        confirm('Delete User', `Delete user "${user.name}"? This cannot be undone.`, async () => {
            try {
                await api.delete(`/users/${user.id}`);
                toast.success(`${user.name} deleted.`);
                load(); loadLogs();
            } catch (e) {
                toast.error(e.response?.data?.message ?? 'Could not delete user.');
            }
        });
    };

    const clearLogs = () => {
        confirm('Clear All Logs', 'Clear all activity logs? This cannot be undone.', async () => {
            await api.delete('/activity-logs');
            setLogs([]);
            toast.success('All logs cleared.');
        });
    };

    const deleteLog = (id) => {
        confirm('Delete Log Entry', 'Delete this log entry?', async () => {
            await api.delete(`/activity-logs/${id}`);
            setLogs(prev => prev.filter(l => l.id !== id));
            toast.success('Log entry deleted.');
        });
    };

    const p = (k, v) => setProfile(prev => ({ ...prev, [k]: v }));

    const filteredUsers = users.filter(u => {
        const matchId = !idSearch || String(u.id) === String(idSearch);
        const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase());
        return matchId && matchSearch;
    });

    const filteredLogs = logs.filter(l => {
        const matchId     = !logId     || String(l.user_id) === logId;
        const matchUser   = !logUser   || l.user?.name.toLowerCase().includes(logUser.toLowerCase());
        const matchAction = !logAction || l.action === logAction;
        const matchDate   = !logDate   || l.created_at?.startsWith(logDate);
        return matchId && matchUser && matchAction && matchDate;
    });

    return (
        <AuthenticatedLayout>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>Users</h3>
                <button className="btn btn-outline-primary btn-sm d-flex align-items-center gap-2" onClick={openProfile}>
                    <Pencil size={15} /> Edit My Profile
                </button>
            </div>

            <SearchBar
                search={search} setSearch={setSearch}
                idSearch={idSearch} setIdSearch={setIdSearch}
                placeholder="Search by name or email..."
            />

            <table className="table table-bordered table-hover mb-5">
                <thead className="table-dark">
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Joined</th>
                        {isAdmin && <th>Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map(u => (
                        <tr key={u.id}>
                            <td>{u.id}</td>
                            <td>{u.name}</td>
                            <td>{u.email}</td>
                            <td>
                                <span className={`badge ${u.role === 'admin' ? 'bg-danger' : 'bg-secondary'}`}>
                                    {u.role}
                                </span>
                            </td>
                            <td className="text-muted small">{new Date(u.created_at).toLocaleDateString()}</td>
                            {isAdmin && (
                                <td className="d-flex gap-2">
                                    {u.is_protected ? (
                                        <span className="text-muted small">Protected</span>
                                    ) : (
                                        <>
                                            <button className="btn btn-sm btn-outline-primary" onClick={() => openEdit(u)}>
                                                Edit
                                            </button>
                                            {u.role === 'employee'
                                                ? <button className="btn btn-sm btn-outline-danger" onClick={() => changeRole(u, 'admin')}>Make Admin</button>
                                                : <button className="btn btn-sm btn-outline-secondary" onClick={() => changeRole(u, 'employee')}>Make Employee</button>
                                            }
                                            <button className="btn btn-sm btn-danger" onClick={() => deleteUser(u)}>Delete</button>
                                        </>
                                    )}
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Activity Log — admin only */}
            {isAdmin && (
                <div className="card border-0 shadow-sm mt-2">
                    <div className="card-header fw-semibold d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center gap-2">
                            <Activity size={16} color="#6f42c1" /> Activity Log
                        </div>
                        <button className="btn btn-sm btn-outline-danger" onClick={clearLogs}>
                            Clear All
                        </button>
                    </div>

                    <div className="card-body border-bottom">
                        <div className="row g-2 align-items-end">
                            <div className="col-md-1">
                                <label className="form-label small mb-1">User ID</label>
                                <input type="number" className="form-control form-control-sm" placeholder="ID"
                                    value={logId} onChange={e => setLogId(e.target.value)} />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label small mb-1">User</label>
                                <input className="form-control form-control-sm" placeholder="Search by user..."
                                    value={logUser} onChange={e => setLogUser(e.target.value)} />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label small mb-1">Action</label>
                                <select className="form-select form-select-sm" value={logAction} onChange={e => setLogAction(e.target.value)}>
                                    <option value="">All Actions</option>
                                    <option value="created">Created</option>
                                    <option value="updated">Updated</option>
                                    <option value="deleted">Deleted</option>
                                </select>
                            </div>
                            <div className="col-md-2">
                                <label className="form-label small mb-1">Date</label>
                                <input type="date" className="form-control form-control-sm"
                                    value={logDate} onChange={e => setLogDate(e.target.value)} />
                            </div>
                            <div className="col-md-2 d-flex align-items-end">
                                <button className="btn btn-sm btn-outline-secondary w-100" onClick={() => {
                                    setLogId(''); setLogUser(''); setLogAction(''); setLogDate('');
                                }}>Reset</button>
                            </div>
                        </div>
                    </div>

                    <div className="card-body p-0">
                        {filteredLogs.length === 0 ? (
                            <div className="p-3 text-muted small">No activity yet.</div>
                        ) : (
                            <table className="table table-hover mb-0">
                                <thead className="table-dark">
                                    <tr><th>#</th><th>User</th><th>Action</th><th>Details</th><th>Date</th><th></th></tr>
                                </thead>
                                <tbody>
                                    {filteredLogs.map(log => (
                                        <tr key={log.id}>
                                            <td className="small text-muted">{log.id}</td>
                                            <td className="small">{log.user?.name ?? '—'}</td>
                                            <td>
                                                <span className={`badge ${
                                                    log.action === 'created' ? 'bg-success' :
                                                    log.action === 'updated' ? 'bg-warning text-white' :
                                                    'bg-danger'
                                                }`}>{log.action}</span>
                                            </td>
                                            <td className="small">{log.details}</td>
                                            <td className="small text-muted">{new Date(log.created_at).toLocaleString()}</td>
                                            <td>
                                                <button className="btn btn-sm btn-outline-danger" onClick={() => deleteLog(log.id)}>
                                                    <Trash2 size={13} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            )}

            {/* Edit User Modal */}
            {showEditModal && (
                <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit User — {editUser?.name}</h5>
                                <button className="btn-close" onClick={() => setShowEditModal(false)} />
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Name</label>
                                    <input className="form-control" value={editForm.name}
                                        onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input type="email" className="form-control" value={editForm.email}
                                        onChange={e => setEditForm({ ...editForm, email: e.target.value })} />
                                </div>
                                <hr />
                                <p className="text-muted small mb-2">Leave blank to keep current password.</p>
                                <div className="mb-3">
                                    <label className="form-label">New Password</label>
                                    <input type="password" className="form-control" value={editForm.password}
                                        onChange={e => setEditForm({ ...editForm, password: e.target.value })} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Confirm New Password</label>
                                    <input type="password" className="form-control" value={editForm.password_confirmation}
                                        onChange={e => setEditForm({ ...editForm, password_confirmation: e.target.value })} />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
                                <button className="btn btn-primary" onClick={saveEdit}>Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Profile Modal */}
            {showProfileModal && (
                <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit My Profile</h5>
                                <button className="btn-close" onClick={() => setShowProfileModal(false)} />
                            </div>
                            <div className="modal-body">
                                {profileError   && <div className="alert alert-danger small">{profileError}</div>}
                                {profileSuccess && <div className="alert alert-success small">{profileSuccess}</div>}
                                <div className="mb-3">
                                    <label className="form-label">Name</label>
                                    <input className="form-control" value={profile.name} onChange={e => p('name', e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input type="email" className="form-control" value={profile.email} onChange={e => p('email', e.target.value)} />
                                </div>
                                <hr />
                                <p className="text-muted small mb-2">Leave new password blank to keep current password.</p>
                                <div className="mb-3">
                                    <label className="form-label">Current Password <span className="text-danger">*</span></label>
                                    <input type="password" className="form-control" value={profile.current_password} onChange={e => p('current_password', e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">New Password</label>
                                    <input type="password" className="form-control" value={profile.password} onChange={e => p('password', e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Confirm New Password</label>
                                    <input type="password" className="form-control" value={profile.password_confirmation} onChange={e => p('password_confirmation', e.target.value)} />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowProfileModal(false)}>Cancel</button>
                                <button className="btn btn-primary" onClick={saveProfile}>Save Changes</button>
                            </div>
                        </div>
                    </div>
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