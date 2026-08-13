import { mean } from "./statistics";

export function computeVolumeByScope(rows, hasAgregador) {
  const volumes = rows.map((r) => Number(r.volume || 0));

  const sum = volumes.reduce(
    (total, volume) => total + volume,
    0
  );

  const average = mean(volumes);
  const count = volumes.length;

  const byAggregator = {};
  const sumByAggregator = {};
  const averageByAggregator = {};
  const countByAggregator = {};

  if (hasAgregador) {
    const groups = {};

    rows.forEach((r) => {
      const key = r.agregador ?? "Sem agregador";

      if (!groups[key]) {
        groups[key] = [];
      }

      groups[key].push(Number(r.volume || 0));
    });

    Object.entries(groups).forEach(([key, volumes]) => {
      const aggregatorSum = volumes.reduce(
        (total, volume) => total + volume,
        0
      );

      const aggregatorAverage = mean(volumes);
      const aggregatorCount = volumes.length;

      // Mantém compatibilidade com seu código antigo
      byAggregator[key] = aggregatorSum;

      // Novos valores
      sumByAggregator[key] = aggregatorSum;
      averageByAggregator[key] = aggregatorAverage;
      countByAggregator[key] = aggregatorCount;
    });
  }

  return {
    sum,
    average,
    count,
    byAggregator,
    sumByAggregator,
    averageByAggregator,
    countByAggregator,
  };
}