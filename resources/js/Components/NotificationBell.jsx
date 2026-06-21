import { useEffect, useState, useRef } from 'react';
import { Bell, Package, ShoppingCart, X } from 'lucide-react';
import api from '@/api';

const ICONS = {
    low_stock: <Package size={16} color="#dc3545" />,
    order_placed: <ShoppingCart size={16} color="#0d6efd" />,
};

export default function NotificationBell() {
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const btnRef = useRef(null);
    const dropdownRef = useRef(null);

    const load = () => {
        api.get('/notifications').then(r => setNotifications(r.data));
        api.get('/notifications/unread-count').then(r => setUnreadCount(r.data.count));
    };

    useEffect(() => {
        load();
        const interval = setInterval(load, 30000); // poll every 30s
        return () => clearInterval(interval);
    }, []);

    // Allow other components to trigger an instant refresh
    useEffect(() => {
        const handler = () => load();
        window.addEventListener('notifications:refresh', handler);
        return () => window.removeEventListener('notifications:refresh', handler);
    }, []);

    useEffect(() => {
        const handler = (e) => {
            if (
                dropdownRef.current && !dropdownRef.current.contains(e.target) &&
                btnRef.current && !btnRef.current.contains(e.target)
            ) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const toggle = () => {
        if (!open && btnRef.current) {
            const rect = btnRef.current.getBoundingClientRect();
            setPosition({ top: rect.bottom + 8, left: Math.max(8, rect.right - 320) });
        }
        setOpen(v => !v);
        if (!open && unreadCount > 0) {
            api.put('/notifications/read-all').then(() => {
                setUnreadCount(0);
                setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            });
        }
    };

    const remove = async (id) => {
        await api.delete(`/notifications/${id}`);
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    return (
        <>
            <button ref={btnRef} onClick={toggle} style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                position: 'relative', color: 'var(--navbar-text)', padding: 6,
                display: 'flex', alignItems: 'center',
            }}>
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span style={{
                        position: 'absolute', top: 0, right: 0,
                        background: '#dc3545', color: '#fff',
                        borderRadius: '50%', fontSize: 10,
                        width: 16, height: 16,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div ref={dropdownRef} style={{
                    position: 'fixed',
                    top: position.top,
                    left: position.left,
                    width: 320,
                    maxHeight: 400,
                    overflowY: 'auto',
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                    zIndex: 9999,
                }}>
                    <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', fontWeight: 600, color: 'var(--text)' }}>
                        Notifications
                    </div>
                    {notifications.length === 0 ? (
                        <div style={{ padding: 16, color: 'var(--text-muted)', fontSize: 13 }}>
                            No notifications yet.
                        </div>
                    ) : (
                        notifications.map(n => (
                            <div key={n.id} style={{
                                padding: '10px 14px',
                                borderBottom: '1px solid var(--border)',
                                display: 'flex', gap: 10, alignItems: 'flex-start',
                                background: n.read ? 'transparent' : 'rgba(59,130,246,0.06)',
                            }}>
                                <div style={{ marginTop: 2 }}>{ICONS[n.type] ?? <Bell size={16} />}</div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{n.title}</div>
                                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{n.message}</div>
                                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                                        {new Date(n.created_at).toLocaleString()}
                                    </div>
                                </div>
                                <button onClick={() => remove(n.id)} style={{
                                    background: 'transparent', border: 'none', cursor: 'pointer',
                                    color: 'var(--text-muted)', flexShrink: 0,
                                }}>
                                    <X size={14} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            )}
        </>
    );
}