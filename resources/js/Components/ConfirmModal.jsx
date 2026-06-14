export default function ConfirmModal({ show, title, message, onConfirm, onCancel, confirmText = 'Delete', confirmClass = 'btn-danger' }) {
    if (!show) return null;

    return (
        <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{title}</h5>
                        <button className="btn-close" onClick={onCancel} />
                    </div>
                    <div className="modal-body">
                        <p className="mb-0">{message}</p>
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
                        <button className={`btn ${confirmClass}`} onClick={onConfirm}>{confirmText}</button>
                    </div>
                </div>
            </div>
        </div>
    );
}