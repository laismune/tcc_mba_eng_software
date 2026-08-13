import { mean } from "./statistics";

/**
 * rows: [{ id, agregador, dap, altura, volume }, ...]  (já com volume calculado)
 * Retorna { total: number, byAggregator: { [agregador]: number } }
 */
export function computeVolumeByScope(rows, hasAgregador) {
  const average = mean(rows.map((r) => r.volume));
  const count = rows.length;
  const sum = rows.reduce(
    (sum, r) => sum + Number(r.volume || 0),
    0
  );

  const byAggregator = {};
  if (hasAgregador) {
    const groups = {};
    rows.forEach((r) => {
      const key = r.agregador ?? "Sem agregador";
      if (!groups[key]) groups[key] = [];
      groups[key].push(r.volume);
    });
    Object.entries(groups).forEach(([key, volumes]) => {
      byAggregator[key] = mean(volumes);
      count =  rows.length;
      sum = rows.reduce(
        (sum, r) => sum + Number(r.volume || 0),
        0
      );
    });
  }

  return { count, average, sum, byAggregator };
}
