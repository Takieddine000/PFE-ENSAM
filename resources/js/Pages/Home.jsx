import { Link } from '@inertiajs/react';
import { Tag, Truck, Package, ShoppingCart } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Head } from '@inertiajs/react';

export default function Home() {
    return (
        <><Head title="Home" />
        <div className="min-vh-100 d-flex flex-column" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
            {/* Navbar */}
            

            {/* Hero */}
            <div className="flex-grow-1 d-flex align-items-center justify-content-center text-center px-3">
                <div>
                    <h1 className="text-white fw-bold display-5 mb-3">Stock Management</h1>
                    <p className="text-white-50 fs-5 mb-4" style={{ maxWidth: 480, margin: '0 auto' }}>
                        Manage your inventory, orders, categories and providers — all in one place.
                    </p>
                    <div className="d-flex gap-3 justify-content-center">
                        <Link href="/login" className="btn btn-primary btn-lg px-4">Get Started</Link>
                        <Link href="/register" className="btn btn-outline-light btn-lg px-4">Create Account</Link>
                    </div>
                </div>
            </div>

            {/* Feature Cards */}
            <div className="container pb-5">
                <div className="row g-3 justify-content-center">
                    {[
                    { icon: <Tag size={28} />,          title: 'Categories', desc: 'Organize products by category' },
                    { icon: <Truck size={28} />,        title: 'Providers',  desc: 'Track your suppliers easily' },
                    { icon: <Package size={28} />,      title: 'Products',   desc: 'Monitor stock levels in real time' },
                    { icon: <ShoppingCart size={28} />, title: 'Orders',     desc: 'Place and review orders fast' },
                ].map(f => (
                    <div className="col-sm-6 col-md-3" key={f.title}>
                        <div className="card border-0 text-center p-3 h-100" style={{
                            background: 'rgba(255,255,255,0.05)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.1) !important',
                        }}>
                            <div className="d-flex justify-content-center mb-2" style={{ color: '#3b82f6' }}>{f.icon}</div>
                            <div style={{ color: 'var(--navbar-text)', fontWeight: 600 }}>{f.title}</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{f.desc}</div>
                        </div>
                    </div>
                ))}
                </div>
            </div>

            <footer className="text-center text-white-50 small pb-3">© 2025 StockApp</footer>
        </div></>
    );
}