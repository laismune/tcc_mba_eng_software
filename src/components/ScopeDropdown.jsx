import { useEffect, useRef, useState } from "react";

export function ScopeDropdown({ aggregatorKeys, selected, onSelect }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const label = selected === "total" ? "Total" : selected;

  return (
    <div className="ff-scope-dropdown" ref={ref}>
      <button
        type="button"
        className="ff-scope-dropdown__trigger"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
      >
        Selecione o agregador: <strong>{label}</strong>
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="ff-scope-dropdown__menu">
          <button
            type="button"
            className={`ff-scope-dropdown__item ${selected === "total" ? "is-active" : ""}`}
            onClick={() => {
              onSelect("total");
              setOpen(false);
            }}
          >
            Total
          </button>
          {aggregatorKeys.map((key) => (
            <button
              key={key}
              type="button"
              className={`ff-scope-dropdown__item ${selected === key ? "is-active" : ""}`}
              onClick={() => {
                onSelect(key);
                setOpen(false);
              }}
            >
              {key}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
