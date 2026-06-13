import { useState } from 'react';

export default function useToast() {
    const [toasts, setToasts] = useState([]);

    const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

    const addToast = (message, type = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
    };

    return {
        toasts,
        removeToast,
        toast: {
            success: (msg) => addToast(msg, 'success'),
            error:   (msg) => addToast(msg, 'error'),
            warning: (msg) => addToast(msg, 'warning'),
            info:    (msg) => addToast(msg, 'info'),
        },
    };
}