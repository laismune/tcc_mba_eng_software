export function mean(values) {
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

export function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

export function min(values) {
  return Math.min(...values);
}

export function max(values) {
  return Math.max(...values);
}

export function amplitude(values) {
  return max(values) - min(values);
}

export function standardDeviation(values) {
  if (values.length < 2) return 0;
  const m = mean(values);
  const variance = values.reduce((acc, v) => acc + (v - m) ** 2, 0) / (values.length - 1);
  return Math.sqrt(variance);
}

export function coefficientOfVariation(values) {
  const m = mean(values);
  if (m === 0) return 0;
  return (standardDeviation(values) / m) * 100;
}

export function computeColumnStats(values) {
  return {
    n: values.length,
    mean: mean(values),
    median: median(values),
    min: min(values),
    max: max(values),
    amplitude: amplitude(values),
    stdDev: standardDeviation(values),
    cv: coefficientOfVariation(values),
  };
}
