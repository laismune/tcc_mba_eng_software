import { useEffect, useRef } from "react";
import { VOLUME_EQUATIONS } from "../utils/volumeEquations";

export function RegionDropdown({ onSelect, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <div className="ff-region-dropdown" ref={ref}>
      <p className="ff-region-dropdown__label">Selecione a região:</p>
      <div className="ff-region-dropdown__menu">
        {Object.entries(VOLUME_EQUATIONS).map(([key, eq]) => (
          <button
            key={key}
            type="button"
            className="ff-region-dropdown__item"
            onClick={() => onSelect(key)}
          >
            {eq.label}
          </button>
        ))}
      </div>
    </div>
  );
}
