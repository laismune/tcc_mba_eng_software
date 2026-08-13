import { mean } from "./statistics";

/**
 * rows: [{ id, agregador, dap, altura, volume }, ...]  (já com volume calculado)
 * Retorna { total: number, byAggregator: { [agregador]: number } }
 */
export function computeVolumeByScope(rows, hasAgregador) {
  const total = mean(rows.map((r) => r.volume));

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
    });
  }

  return { total, byAggregator };
}
