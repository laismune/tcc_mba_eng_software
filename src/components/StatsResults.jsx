const COLUMN_LABELS = {
  dap: "DAP (cm)",
  altura: "Altura (m)",
  vol: "Volume (m³)",
};

const METRICS = [
  ["n", "N° de dados", ""],
  ["mean", "Média", ""],
  ["median", "Mediana", ""],
  ["min", "Mínimo", ""],
  ["max", "Máximo", ""],
  ["amplitude", "Amplitude", ""],
  ["stdDev", "Desvio-padrão", ""],
  ["cv", "Coef. de Variação", "%"],
];

export function StatsResults({ stats }) {
  const columns = Object.keys(stats);
  if (columns.length === 0) return null;

  return (
    <div className="ff-stats-grid">
      {columns.map((col) => (
        <table key={col} className="ff-stats-table">
          <thead>
            <tr>
              <th colSpan={2}>{COLUMN_LABELS[col] ?? col}</th>
            </tr>
          </thead>
          <tbody>
            {METRICS.map(([key, label, suffix]) => {
              const value = stats[col][key];
              const formatted = key === "n" ? value : value.toFixed(2);
              return (
                <tr key={key}>
                  <td>{label}</td>
                  <td>{formatted}{suffix}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ))}
    </div>
  );
}
