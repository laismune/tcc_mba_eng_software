import { VOLUME_EQUATIONS } from "../utils/volumeEquations";

export function VolumeResult({ value, count, sum, regionKey }) {
  const eq = VOLUME_EQUATIONS[regionKey];

  console.log(count);

  return (
    <div className="ff-volume-result" >
      <div className="ff-volume-result__text">
        <p>
          O volume médio de cada árvore processada é <strong>{value.toFixed(2)} m³</strong> <br></br>
          Para <strong>{count} </strong> árvores, o volume total de madeira é {" "}
          <strong>{sum.toFixed(2)} m³</strong>
          <br/>
        </p>
      </div>

      {eq && (
        <p className="ff-volume-result__caption">
          Volume estimado pela equação volumétrica da região{" "}
          <strong>{eq.label}</strong>.
          <br />
          <span className="ff-volume-result__caption">
            Equação de Schumacher e Hall (1933): Volume = β₀ × DAP<sup>β₁</sup> × H<sup>β₂</sup>
          </span>
          <br />
          <span className="ff-volume-result__caption">
            Coeficientes utilizados: β₀ = {eq.coef}, β₁ = {eq.dapExp} e β₂ = {eq.hExp}.
          </span>
        </p>
      )}
    </div>
  );
}
