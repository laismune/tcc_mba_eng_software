import { useEffect } from "react";

export function Modal({ isOpen, onClose, title, children, onNavigate, linkLabel = "Ir para o produto" }) {
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="ff-modal-overlay" onClick={onClose}>
      <div
        className="ff-modal ff-modal--product"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="ff-modal__close"
          onClick={onClose}
          aria-label="Fechar"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round" />
            <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round" />
          </svg>
        </button>

        <div className="ff-modal__body">
          {title && <h2 className="ff-modal__title">{title}</h2>}
          {children}
        </div>

        <button type="button" className="ff-modal__link" onClick={onNavigate}>
          {linkLabel}
        </button>
      </div>
    </div>
  );
}
