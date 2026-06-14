import { useState } from 'react';

export default function useConfirm() {
    const [state, setState] = useState({ show: false, title: '', message: '', onConfirm: null });

    const confirm = (title, message, onConfirm) => {
        setState({ show: true, title, message, onConfirm });
    };

    const close = () => setState(prev => ({ ...prev, show: false }));

    const handleConfirm = () => {
        state.onConfirm?.();
        close();
    };

    return { confirmState: state, confirm, closeConfirm: close, handleConfirm };
}