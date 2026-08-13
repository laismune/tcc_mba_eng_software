import { useEffect, useRef, useState } from "react";

export function Nav({
  navOpen,
  setNavOpen,
  active,
  scrollTo,
  topRef,
  produtosRef,
  onNavigate,
  onHome, 
}) {
  const [produtosOpen, setProdutosOpen] = useState(false);
  const dropdownRef = useRef(null);

  const linkClass = (id) => `ff-nav__link ${active === id ? "is-active" : ""}`;

  useEffect(() => {
    if (!produtosOpen) return;
    const onClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProdutosOpen(false);
      }
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") setProdutosOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [produtosOpen]);

  const pick = (key) => {
    setProdutosOpen(false);
    setNavOpen(false);
    onNavigate?.(key);
  };

  const goInicio = () => {
    if (topRef) scrollTo(topRef);
    else onHome?.();
    setNavOpen(false);
  };

  const goSobre = () => {
    if (produtosRef) scrollTo(produtosRef);
    else onHome?.();
    setNavOpen(false);
  };

  return (
    <nav className="ff-nav">
      <div className="ff-nav__brand">
        <span>ForestFlow</span>
      </div>

      <button
        className="ff-nav__toggle"
        onClick={() => setNavOpen((v) => !v)}
        aria-label="Abrir menu"
      >
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      <div className={`ff-nav__links ${navOpen ? "is-open" : ""}`}>
        <span onClick={goInicio} className={linkClass("top")}>Início</span>
        <span onClick={goSobre} className={linkClass("sobre")}>Sobre</span>

        <div className="ff-nav__dropdown" ref={dropdownRef}>
          <button
            type="button"
            className={`ff-nav__link ff-nav__link--dropdown ${active === "produtos" ? "is-active" : ""}`}
            onClick={() => setProdutosOpen((v) => !v)}
            aria-haspopup="true"
            aria-expanded={produtosOpen}
          >
            Produtos
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {produtosOpen && (
            <div className="ff-nav__menu">
              <button type="button" className="ff-nav__menu-item" onClick={() => pick("getstats")}>
                GetStats
              </button>
              <button type="button" className="ff-nav__menu-item" onClick={() => pick("quickvol")}>
                QuickVol
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
