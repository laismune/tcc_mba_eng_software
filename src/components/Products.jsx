import { ProductCard } from "./ProductCard";

export function Products({ produtosRef, onNavigate }) {
  return (
    <section ref={produtosRef} className="ff-products">
      <div className="ff-cards">
        <ProductCard
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M4 19V9M10 19V5M16 19V12M22 19V3" strokeLinecap="round" />
            </svg>
          }
          title="GetStats"
          desc="Com apenas um clique, o GetStats permite a visualização das principais estatísticas da sua Floresta."
          modalDesc="Envie seus dados de campo (DAP, altura e volume) — geral ou por agregador. O GetStats apresenta um painel completo com média, mediana, valores mínimo e máximo, amplitude, desvio-padrão e coeficiente de variação."
          onNavigate={() => onNavigate("getstats")}
        />
        <ProductCard
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" />
            </svg>
          }
          title="QuickVol"
          desc="Estime o volume de madeira da sua floresta de forma rápida e intuitiva com apenas dados de diâmetro e altura."
          modalDesc="Envie os dados da sua floresta, escolha a região do Brasil e o QuickVol calcula o volume médio do seu ativo — total ou por agregador — usando a equação volumétrica de Schumacher e Hall (1933) ajustada para sua região."
          onNavigate={() => onNavigate("quickvol")}
        />
      </div>
    </section>
  );
}
