import { useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';

const ICONS = {
    success: <CheckCircle size={18} />,
    error:   <XCircle size={18} />,
    warning: <AlertTriangle size={18} />,
    info:    <Info size={18} />,
};

const COLORS = {
    success: '#198754',
    error:   '#dc3545',
    warning: '#fd7e14',
    info:    '#0d6efd',
};

export function ToastItem({ toast, remove }) {
    const bg   = COLORS[toast.type] ?? COLORS.info;
    const icon = ICONS[toast.type]  ?? ICONS.info;

    useEffect(() => {
        const t = setTimeout(() => remove(toast.id), 5000);
        return () => clearTimeout(t);
    }, []);

    return (
        <div style={{
            background: bg, color: '#fff',
            padding: '10px 16px', borderRadius: 10,
            boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
            display: 'flex', alignItems: 'center', gap: 10,
            minWidth: 220, maxWidth: 320,
            animation: 'slideIn 0.25s ease',
            fontSize: 14,
        }}>
            {icon}
            <span>{toast.message}</span>
        </div>
    );
}

export default function ToastContainer({ toasts, remove }) {
    return (
        <div style={{
            position: 'fixed', bottom: 24, right: 24,
            zIndex: 9999, display: 'flex', flexDirection: 'column',
            gap: 10, alignItems: 'flex-end',
        }}>
            {toasts.map(t => <ToastItem key={t.id} toast={t} remove={remove} />)}
        </div>
    );
}