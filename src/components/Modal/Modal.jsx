import './Modal.css';
export default function Modal({ open, onClose, title, children }){
  if(!open) return null;
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label={title} onClick={onClose}>
      <div className="modal" onClick={e=> e.stopPropagation()}>
        <div className="modal-head">
          <h3 style={{margin:0}}>{title}</h3>
          <button className="btn btn-ghost btn-sm" onClick={onClose} aria-label="Đóng">✕</button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
