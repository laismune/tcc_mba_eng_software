import { computeColumnStats } from "./statistics";

const COLUMNS = ["dap", "altura", "vol"];

function buildStats(rows) {
  const result = {};
  COLUMNS.forEach((col) => {
    const values = rows
      .map((r) => r[col])
      .filter((v) => v !== null && v !== undefined);
    if (values.length > 0) result[col] = computeColumnStats(values);
  });
  return result;
}

export function computeStatsByScope(rows, hasAgregador) {
  const total = buildStats(rows);

  const byAggregator = {};
  if (hasAgregador) {
    const groups = {};
    rows.forEach((r) => {
      const key = r.agregador ?? "Sem agregador";
      if (!groups[key]) groups[key] = [];
      groups[key].push(r);
    });
    Object.entries(groups).forEach(([key, groupRows]) => {
      byAggregator[key] = buildStats(groupRows);
    });
  }

  return { total, byAggregator };
}
