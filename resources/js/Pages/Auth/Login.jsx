import { useEffect } from 'react';
import { Link, useForm } from '@inertiajs/react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Package } from 'lucide-react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({ email: '', password: '', remember: false });

    useEffect(() => () => reset('password'), []);

    const submit = (e) => { e.preventDefault(); post(route('login')); };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
            <div className="card border-0 shadow-lg p-4" style={{ width: '100%', maxWidth: 420 }}>
                <div className="text-center mb-4">
                    <div className="d-flex justify-content-center mb-2" style={{ color: '#3b82f6' }}>
                        <Package size={40} />
                    </div>
                    <h4 className="fw-bold">Welcome back</h4>
                    <p className="text-muted small">Sign in to your StockApp account</p>
                </div>

                {status && <div className="alert alert-success small">{status}</div>}

                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        value={data.email}
                        onChange={e => setData('email', e.target.value)}
                        autoFocus
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>

                <div className="mb-3">
                    <div className="d-flex justify-content-between">
                        <label className="form-label">Password</label>
                        {canResetPassword && <Link href={route('password.request')} className="small text-decoration-none">Forgot password?</Link>}
                    </div>
                    <input
                        type="password"
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                        value={data.password}
                        onChange={e => setData('password', e.target.value)}
                    />
                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                </div>

                <div className="form-check mb-4">
                    <input className="form-check-input" type="checkbox" checked={data.remember} onChange={e => setData('remember', e.target.checked)} id="remember" />
                    <label className="form-check-label small" htmlFor="remember">Remember me</label>
                </div>

                <button className="btn btn-primary w-100" onClick={submit} disabled={processing}>
                    {processing ? 'Signing in...' : 'Sign In'}
                </button>

                <p className="text-center text-muted small mt-3 mb-0">
                    Don't have an account? <Link href="/register" className="text-decoration-none">Sign up</Link>
                </p>
            </div>
        </div>
    );
}