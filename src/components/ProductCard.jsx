import { useState } from "react";
import { useInView } from "../hooks/useInView";
import { Modal } from "./Modal";

export function ProductCard({ icon, title, desc, modalTitle, modalDesc, onNavigate }) {
  const [ref, inView] = useInView(0.2);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div ref={ref} className={`ff-card ${inView ? "is-visible" : ""}`}>
      <div className="ff-card__icon">{icon}</div>
      <h3>{title}</h3>
      <p>{desc}</p>
      <div className="ff-card__foot">
        <button
          type="button"
          className="ff-card__link"
          onClick={() => setModalOpen(true)}
        >
          Saiba Mais
        </button>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle ?? title}
        onNavigate={() => {
          setModalOpen(false);
          onNavigate?.();
        }}
      >
        <p style={{textAlign: 'justify' }}>
          {modalDesc ?? desc}
        </p>
      </Modal>
    </div>
  );
}
