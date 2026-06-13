import { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { usePage } from '@inertiajs/react';
import api from '@/api';
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
    Tag, Truck, Package, ShoppingCart, DollarSign,
    AlertTriangle, TrendingUp, Trophy, BarChart2, PieChart as PieIcon,
    ClipboardList, CheckCircle
} from 'lucide-react';

const COLORS = ['#0d6efd', '#6f42c1', '#198754', '#fd7e14', '#20c997', '#dc3545'];

function StatCard({ label, value, icon, color }) {
    return (
        <div className="col-sm-6 col-xl-4">
            <div className="card border-0 shadow-sm">
                <div className="card-body d-flex align-items-center gap-3">
                    <div className="rounded-3 d-flex align-items-center justify-content-center"
                        style={{ width: 56, height: 56, background: color + '22', color, flexShrink: 0 }}>
                        {icon}
                    </div>
                    <div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{label}</div>
                        <div style={{ color: 'var(--text)', fontWeight: 700, fontSize: '1.5rem' }}>{value ?? '—'}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function CardHeader({ icon: Icon, title, iconColor, children }) {
    return (
        <div className="card-header border-bottom fw-semibold d-flex align-items-center gap-2">
            <Icon size={16} color={iconColor ?? 'var(--text-muted)'} />
            <span>{title}</span>
            {children}
        </div>
    );
}

export default function Dashboard() {
    const { auth } = usePage().props;
    const [stats, setStats] = useState(null);

    useEffect(() => {
        api.get('/dashboard-stats').then(r => setStats(r.data));
    }, []);

    const stockByCategoryData = stats?.stock_by_category ?? [];
    const ordersTrendData     = stats?.orders_trend ?? [];
    const revenueByCategory   = stats?.revenue_by_category ?? [];
    const topProducts         = stats?.top_products ?? [];

    return (
        <AuthenticatedLayout>
            <div className="mb-4">
                <h4 className="fw-bold mb-0">Dashboard</h4>
                <span style={{ color: 'var(--text)', fontSize: '0.85rem', opacity: 0.7 }}>
                    Welcome back, {auth.user.name} · {auth.user.role}
                </span>
            </div>

            {/* Stat Cards */}
            <div className="row g-3 mb-4">
                <StatCard label="Categories"    value={stats?.total_categories}                                     icon={<Tag size={22} />}           color="#0d6efd" />
                <StatCard label="Providers"     value={stats?.total_providers}                                      icon={<Truck size={22} />}         color="#6f42c1" />
                <StatCard label="Products"      value={stats?.total_products}                                       icon={<Package size={22} />}       color="#198754" />
                <StatCard label="Orders"        value={stats?.total_orders}                                         icon={<ShoppingCart size={22} />}  color="#fd7e14" />
                <StatCard label="Total Revenue" value={stats ? `$${Number(stats.total_revenue).toFixed(2)}` : null} icon={<DollarSign size={22} />}    color="#20c997" />
                <StatCard label="Low Stock"     value={stats?.low_stock?.length}                                    icon={<AlertTriangle size={22} />} color="#dc3545" />
            </div>

            {/* Row 1: Bar + Pie */}
            <div className="row g-4 mb-4">
                <div className="col-lg-7">
                    <div className="card border-0 shadow-sm h-100">
                        <CardHeader icon={BarChart2} title="Stock by Category" iconColor="#0d6efd" />
                        <div className="card-body">
                            {stockByCategoryData.length === 0
                                ? 
                                <div className="p-3 small d-flex align-items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                                    <Tag size={15} /> No data yet.
                                </div>
                                : <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={stockByCategoryData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="category" tick={{ fontSize: 12 }} />
                                        <YAxis tick={{ fontSize: 12 }} />
                                        <Tooltip />
                                        <Bar dataKey="stock" fill="#0d6efd" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            }
                        </div>
                    </div>
                </div>

                <div className="col-lg-5">
                    <div className="card border-0 shadow-sm h-100">
                        <CardHeader icon={PieIcon} title="Revenue by Category" iconColor="#20c997" />
                        <div className="card-body d-flex align-items-center justify-content-center">
                            {revenueByCategory.length === 0
                                ? 
                                <div className="p-3 small d-flex align-items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                                    <Tag size={15} /> No data yet.
                                </div>
                                : <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie data={revenueByCategory} dataKey="revenue" nameKey="category"
                                            cx="50%" cy="50%" outerRadius={90}
                                            label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}>
                                            {revenueByCategory.map((_, i) => (
                                                <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={v => `$${Number(v).toFixed(2)}`} />
                                    </PieChart>
                                </ResponsiveContainer>
                            }
                        </div>
                    </div>
                </div>
            </div>

            {/* Row 2: Line + Top products */}
            <div className="row g-4 mb-4">
                <div className="col-lg-7">
                    <div className="card border-0 shadow-sm h-100">
                        <CardHeader icon={TrendingUp} title="Orders Trend (Last 7 Days)" iconColor="#0d6efd" />
                        <div className="card-body">
                            {ordersTrendData.length === 0
                                ? <p className="text-muted small">No data yet.</p>
                                : 
                                <ResponsiveContainer width="100%" height={250}>
                                    <LineChart data={ordersTrendData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                                        <YAxis yAxisId="left" tick={{ fontSize: 12 }} allowDecimals={false} />
                                        <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }}
                                            tickFormatter={v => `$${v}`} />
                                        <Tooltip formatter={(value, name) => name === 'revenue' ? `$${Number(value).toFixed(2)}` : value} />
                                        <Legend />
                                        <Line yAxisId="left"  type="monotone" dataKey="orders"  stroke="#0d6efd" strokeWidth={2} dot={{ r: 4 }} />
                                        <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#20c997" strokeWidth={2} dot={{ r: 4 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            }
                        </div>
                    </div>
                </div>

                <div className="col-lg-5">
                    <div className="card border-0 shadow-sm h-100">
                        <CardHeader icon={Trophy} title="Top 5 Products by Orders" iconColor="#fd7e14" />
                        <div className="card-body p-0">
                            {topProducts.length === 0
                                ? <div className="p-3 small d-flex align-items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                                    <ShoppingCart size={15} /> No data yet.
                                </div>
                                : topProducts.map((p, i) => (
                                    <div key={p.name} className="d-flex align-items-center justify-content-between px-3 py-2 border-bottom">
                                        <div className="d-flex align-items-center gap-2">
                                            <span className="badge rounded-pill" style={{ background: COLORS[i % COLORS.length] }}>#{i + 1}</span>
                                            <span className="small fw-medium">{p.name}</span>
                                        </div>
                                        <span className="badge bg-secondary">{p.orders} orders</span>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>

            {/* Row 3: Low stock + Recent orders */}
            <div className="row g-4">
                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm h-100">
                        <CardHeader icon={AlertTriangle} title="Low Stock Alerts" iconColor="#dc3545">
                            {stats?.low_stock?.length > 0 && (
                                <span className="badge bg-danger ms-auto text-white">{stats.low_stock.length}</span>
                            )}
                        </CardHeader>
                        <div className="card-body p-0">
                            {!stats && <div className="p-3 text-muted small">Loading...</div>}
                            {stats?.low_stock?.length === 0 && (
                                <div className="p-3 small d-flex align-items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                                    <Package size={15} /> No data yet.
                                </div>
                            )}
                            {stats?.low_stock?.map(p => (
                                <div key={p.id} className="d-flex align-items-center justify-content-between px-3 py-2 border-bottom">
                                    <div>
                                        <div className="fw-medium small">{p.name}</div>
                                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>{p.category?.name}</div>
                                    </div>
                                    <span className="badge bg-danger">{p.stock} left</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm h-100">
                        <CardHeader icon={ClipboardList} title="Recent Orders" iconColor="#6f42c1" />
                        <div className="card-body p-0">
                            <table className="table table-hover mb-0">
                                <thead className="table-light">
                                    <tr><th>#</th><th>Product</th><th>Amount</th><th>Date</th></tr>
                                </thead>
                                <tbody>
                                    {!stats && <tr><td colSpan={4} className="text-muted small p-3">Loading...</td></tr>}
                                    {stats?.recent_orders?.length === 0 && (
                                        <tr>
                                            <td id='td' colSpan={4}>
                                                <div  className="d-flex align-items-center gap-2 small" style={{ color: 'var(--text-muted)' }}>
                                                    <ClipboardList size={15} /> No orders yet.
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                    {stats?.recent_orders?.map(o => (
                                        <tr key={o.id}>
                                            <td className="text-muted small">#{o.id}</td>
                                            <td>{o.product?.name ?? '—'}</td>
                                            <td><span className="badge bg-secondary">{o.amount}</span></td>
                                            <td className="text-muted small">{new Date(o.created_at).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}