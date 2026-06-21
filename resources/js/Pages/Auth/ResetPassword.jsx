import { useEffect } from 'react';
import { useForm, Link } from '@inertiajs/react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Lock } from 'lucide-react';
import { Head } from '@inertiajs/react';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token,
        email,
        password: '',
        password_confirmation: '',
    });

    useEffect(() => () => reset('password', 'password_confirmation'), []);

    const submit = (e) => { e.preventDefault(); post(route('password.store')); };

    return (
        <>
        <Head title="Reset Password" />
        <div className="min-vh-100 d-flex align-items-center justify-content-center"
            style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
            <div className="card border-0 shadow-lg p-4" style={{ width: '100%', maxWidth: 420 }}>
                <div className="text-center mb-4">
                    <Lock size={40} color="#3b82f6" />
                    <h4 className="fw-bold">Reset Password</h4>
                    <p className="text-muted small">Enter your new password below.</p>
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
                    <label className="form-label">New Password</label>
                    <input
                        type="password"
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                        value={data.password}
                        onChange={e => setData('password', e.target.value)}
                        autoFocus
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
                    {processing ? 'Resetting...' : 'Reset Password'}
                </button>

                <p className="text-center text-muted small mt-3 mb-0">
                    <Link href="/login" className="text-decoration-none">← Back to login</Link>
                </p>
            </div>
        </div></>
    );
}