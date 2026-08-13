import { VOLUME_EQUATIONS } from "../utils/volumeEquations";

export function VolumeResult({ value, regionKey }) {
  const eq = VOLUME_EQUATIONS[regionKey];

  return (
    <div className="ff-volume-result">
      <div className="ff-volume-result__text">
        <p>
          O volume de madeira da floresta é{" "}
          <strong>{value.toFixed(2)} m³/ha</strong>
        </p>
      </div>

      {eq && (
        <p className="ff-volume-result__caption">
          Volume estimado pela equação volumétrica da região{" "}
          <strong>{eq.label}</strong>.
          <br />
          <span className="ff-volume-result__equation">
            Equação de Schumacher e Hall (1933): Volume = β₀ × DAP<sup>β₁</sup> × H<sup>β₂</sup>
          </span>
          <br />
          <span className="ff-volume-result__parameters">
            Coeficientes utilizados: β₀ = {eq.coef}, β₁ = {eq.dapExp} e β₂ = {eq.hExp}.
          </span>
        </p>
      )}
    </div>
  );
}
