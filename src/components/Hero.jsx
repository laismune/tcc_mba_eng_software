export function Hero({ topRef, scrollTo, produtosRef }) {
  return (
    <section ref={topRef} className="ff-hero">
      <svg className="ff-tree" viewBox="0 0 120 150">
        {/* copa do eucalipto */}
        <path
          d="M52 24 C44 20, 37 25, 39 33 C30 31, 26 39, 32 45 C24 50, 26 59, 34 62 C29 70, 35 78, 44 76 C46 84, 55 87, 61 80 C69 86, 77 80, 73 72 C82 73, 87 65, 80 59 C87 53, 84 44, 76 42 C81 34, 74 27, 66 30 C65 23, 58 21, 52 24 Z"
        />
        
        {/* fuste principal descendo além da copa */}
        <path
          className="trunk"
          d="M55 85 C52 120, 51 127, 52 140"
        />

        {/* galhos */}
        <path className="trunk" d="M52 108 C46 105, 41 101, 37 96" />
        <path className="trunk" d="M52 114 C60 110, 66 105, 72 99" />
        <path className="trunk" d="M52 121 C47 118, 43 115, 40 111" />

        {/* raízes */}
        <line className="trunk" x1="52" y1="140" x2="46" y2="146" />
        <line className="trunk" x1="52" y1="140" x2="58" y2="146" />
      </svg>

      <h1>ForestFlow</h1>
      <p className="ff-hero__sub">a visão rápida da sua floresta</p>

      <div className="ff-hero__cta">
        <button className="ff-btn ff-btn--primary" onClick={() => scrollTo(produtosRef)}>
          GetStats
        </button>
        <button className="ff-btn ff-btn--ghost" onClick={() => scrollTo(produtosRef)}>
          QuickVol
        </button>
      </div>

      <svg className="ff-hero__ridge" viewBox="0 0 1200 110" preserveAspectRatio="none">
        <path
          d="M0,90 L80,60 L160,85 L260,40 L340,80 L420,50 L520,88 L610,55 L700,90 L800,45 L900,82 L1000,58 L1100,90 L1200,65 L1200,110 L0,110 Z"
          fill="currentColor"
        />
      </svg>
    </section>
  );
}
