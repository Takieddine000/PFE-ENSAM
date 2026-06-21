import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import {
    LayoutDashboard, Tag, Truck, Package,
    ShoppingCart, Users, LogOut, ChevronLeft,
    ChevronRight, Moon, Sun
} from 'lucide-react';
import api from '@/api';
import 'bootstrap/dist/css/bootstrap.min.css';
import NotificationBell from '@/Components/NotificationBell';

const navItems = [
    { href: '/dashboard',  label: 'Dashboard',  icon: LayoutDashboard },
    { href: '/categories', label: 'Categories',  icon: Tag },
    { href: '/providers',  label: 'Providers',   icon: Truck },
    { href: '/products',   label: 'Products',    icon: Package },
    { href: '/orders',     label: 'Orders',      icon: ShoppingCart },
    { href: '/users',      label: 'Users',       icon: Users },
];

export default function AuthenticatedLayout({ children }) {
    const { auth } = usePage().props;
    const role = auth.user?.role;
    const [darkMode, setDarkMode] = useState(auth.user?.dark_mode ?? false);
    const [collapsed, setCollapsed] = useState(() => {
        return localStorage.getItem('sidebar_collapsed') === 'true';
    });
    const current = window.location.pathname;
    const [logoutHover, setLogoutHover] = useState(false);

    useEffect(() => {
        applyTheme(auth.user?.dark_mode ?? false);
    }, []);

    const applyTheme = (isDark) => {
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    };

    const toggleDark = async () => {
        const next = !darkMode;
        setDarkMode(next);
        applyTheme(next);
        try { await api.put('/theme', { dark_mode: next }); }
        catch (e) { console.error(e); }
    };

    const toggleCollapse = () => {
        const next = !collapsed;
        setCollapsed(next);
        localStorage.setItem('sidebar_collapsed', String(next));
    };

    const sidebarWidth = collapsed ? 64 : 220;

    const sidebarStyle = {
        width: sidebarWidth,
        minHeight: '100vh',
        background: 'var(--navbar-bg)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0, left: 0, bottom: 0,
        zIndex: 100,
        transition: 'width 0.25s ease',
        overflow: 'hidden',
    };

    const navLinkStyle = (active) => ({
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: collapsed ? '12px 0' : '10px 16px',
        justifyContent: collapsed ? 'center' : 'flex-start',
        textDecoration: 'none',
        color: active ? '#3b82f6' : 'var(--navbar-text)',
        background: active ? 'rgba(59,130,246,0.08)' : 'transparent',
        borderLeft: active ? '3px solid #3b82f6' : '3px solid transparent',
        transition: 'all 0.15s',
        whiteSpace: 'nowrap',
        fontSize: 14,
        fontWeight: active ? 600 : 400,
    });

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>

            {/* Sidebar */}
            <div style={sidebarStyle}>

                {/* Logo + collapse button */}
                <div style={{
                    display: 'flex', alignItems: 'center',
                    justifyContent: collapsed ? 'center' : 'space-between',
                    padding: '18px 16px',
                    borderBottom: '1px solid var(--border)',
                    flexShrink: 0,
                }}>
                    {!collapsed && (
                        <span style={{ color: 'var(--navbar-text)', fontWeight: 700, fontSize: 16, whiteSpace: 'nowrap' }}>
                            StockApp
                        </span>
                    )}
                    <div className="d-flex align-items-center gap-1">
                        {!collapsed && <NotificationBell />}
                        <button onClick={toggleCollapse} style={{
                            background: 'transparent', border: 'none',
                            color: 'var(--navbar-text)', cursor: 'pointer',
                            padding: 4, display: 'flex', alignItems: 'center', flexShrink: 0,
                        }}>
                            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                        </button>
                    </div>
                </div>

                {/* Nav links */}
                <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
                    {navItems.map(({ href, label, icon: Icon }) => {
                        const active = current === href;
                        return (
                            <Link key={href} href={href} style={navLinkStyle(active)}>
                                <Icon size={18} style={{ flexShrink: 0, color: active ? '#3b82f6' : 'var(--navbar-text)' }} />
                                {!collapsed && <span style={{ color: active ? '#3b82f6' : 'var(--navbar-text)' }}>{label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom */}
                <div style={{
                    borderTop: '1px solid var(--border)',
                    padding: '12px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                    flexShrink: 0,
                }}>
                    {/* Dark mode */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: collapsed ? 'center' : 'space-between',
                        gap: 8,
                    }}>
                        {!collapsed && (
                            <span style={{ color: 'var(--navbar-text)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                                {darkMode ? <Moon size={14} /> : <Sun size={14} />}
                                {darkMode ? 'Dark' : 'Light'}
                            </span>
                        )}
                        <button onClick={toggleDark} title="Toggle dark mode" style={{
                            width: 44, height: 24, borderRadius: 12,
                            border: 'none', cursor: 'pointer',
                            background: darkMode ? '#3b82f6' : '#cbd5e1',
                            position: 'relative',
                            transition: 'background 0.3s',
                            flexShrink: 0, padding: 0,
                        }}>
                            <span style={{
                                position: 'absolute', top: 3,
                                left: darkMode ? 23 : 3,
                                width: 18, height: 18,
                                borderRadius: '50%',
                                background: '#ffffff',
                                transition: 'left 0.3s',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                {darkMode
                                    ? <Moon size={10} color="#1a1a2e" />
                                    : <Sun size={10} color="#f59e0b" />
                                }
                            </span>
                        </button>
                    </div>

                    {/* User info */}
                    {!collapsed && (
                        <div style={{
                            fontSize: 12,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            color: 'var(--navbar-text)',
                        }}>
                            {auth.user.name}
                            <span style={{
                                marginLeft: 6,
                                background: role === 'admin' ? '#dc3545' : '#6c757d',
                                color: '#fff',
                                borderRadius: 4,
                                padding: '1px 6px',
                                fontSize: 10,
                            }}>
                                {role}
                            </span>
                        </div>
                    )}

                    {/* Logout */}
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        onMouseEnter={() => setLogoutHover(true)}
                        onMouseLeave={() => setLogoutHover(false)}
                        style={{
                            background: logoutHover ? '#dc3545' : 'transparent',
                            border: `1px solid ${logoutHover ? '#dc3545' : 'var(--border)'}`,
                            color: logoutHover ? '#ffffff' : 'var(--navbar-text)',
                            borderRadius: 6,
                            padding: collapsed ? '6px 0' : '6px 12px',
                            cursor: 'pointer',
                            fontSize: 13,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 8,
                            whiteSpace: 'nowrap',
                            textDecoration: 'none',
                            transition: 'all 0.2s',
                        }}
                    >
                        <LogOut size={15} color={logoutHover ? '#ffffff' : 'var(--navbar-text)'} />
                        {!collapsed && <span style={{ color: logoutHover ? '#ffffff' : 'var(--navbar-text)' }}>Logout</span>}
                    </Link>
                </div>
            </div>

            {/* Main content */}
            <main style={{
                marginLeft: sidebarWidth,
                flex: 1,
                padding: '32px 28px',
                transition: 'margin-left 0.25s ease',
                minWidth: 0,
            }}>
                {children}
            </main>
        </div>
    );
}