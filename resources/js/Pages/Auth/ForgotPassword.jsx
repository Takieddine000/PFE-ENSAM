import { useForm, Link } from '@inertiajs/react';
import { KeyRound } from 'lucide-react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({ email: '' });

    const submit = (e) => { e.preventDefault(); post(route('password.email')); };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center"
            style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
            <div className="card border-0 shadow-lg p-4" style={{ width: '100%', maxWidth: 420 }}>
                <div className="text-center mb-4">
                    <KeyRound size={40} color="#3b82f6" />
                    <h4 className="fw-bold">Forgot Password</h4>
                    <p className="text-muted small">Enter your email and we'll send you a reset link.</p>
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

                <button className="btn btn-primary w-100" onClick={submit} disabled={processing}>
                    {processing ? 'Sending...' : 'Send Reset Link'}
                </button>

                <p className="text-center text-muted small mt-3 mb-0">
                    <Link href="/login" className="text-decoration-none">← Back to login</Link>
                </p>
            </div>
        </div>
    );
}