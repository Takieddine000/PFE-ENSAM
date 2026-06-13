import { useEffect } from 'react';
import { Link, useForm } from '@inertiajs/react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Package } from 'lucide-react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({ name: '', email: '', password: '', password_confirmation: '' });

    useEffect(() => () => reset('password', 'password_confirmation'), []);

    const submit = (e) => { e.preventDefault(); post(route('register')); };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center py-4" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
            <div className="card border-0 shadow-lg p-4" style={{ width: '100%', maxWidth: 420 }}>
                <div className="text-center mb-4">
                    <div className="d-flex justify-content-center mb-2" style={{ color: '#3b82f6' }}>
                        <Package size={40} />
                    </div>
                    <h4 className="fw-bold">Create account</h4>
                    <p className="text-muted small">Join StockApp today</p>
                </div>

                <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <input
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                        value={data.name}
                        onChange={e => setData('name', e.target.value)}
                        autoFocus
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>

                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        value={data.email}
                        onChange={e => setData('email', e.target.value)}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>

                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                        type="password"
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                        value={data.password}
                        onChange={e => setData('password', e.target.value)}
                    />
                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                </div>

                <div className="mb-4">
                    <label className="form-label">Confirm Password</label>
                    <input
                        type="password"
                        className={`form-control ${errors.password_confirmation ? 'is-invalid' : ''}`}
                        value={data.password_confirmation}
                        onChange={e => setData('password_confirmation', e.target.value)}
                    />
                    {errors.password_confirmation && <div className="invalid-feedback">{errors.password_confirmation}</div>}
                </div>

                <button className="btn btn-primary w-100" onClick={submit} disabled={processing}>
                    {processing ? 'Creating account...' : 'Create Account'}
                </button>

                <p className="text-center text-muted small mt-3 mb-0">
                    Already have an account? <Link href="/login" className="text-decoration-none">Sign in</Link>
                </p>
            </div>
        </div>
    );
}