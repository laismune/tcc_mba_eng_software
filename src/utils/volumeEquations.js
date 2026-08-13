// Volume = coef * dap^dapExp * h^hExp  (dap em cm, h em m, volume em m³)
export const VOLUME_EQUATIONS = {
  norte: { label: "Norte", coef: 0.00007, dapExp: 1.8878, hExp: 0.86235 },
  nordeste: { label: "Nordeste", coef: 0.00007, dapExp: 1.9197, hExp: 0.88099 },
  centroOeste: { label: "Centro-Oeste", coef: 0.00004, dapExp: 1.6998, hExp: 1.2134 },
  sudeste: { label: "Sudeste", coef: 0.00005, dapExp: 2.2187, hExp: 0.66575 },
  sul: { label: "Sul", coef: 0.00004, dapExp: 1.545, hExp: 1.966 },
};

export function calculateVolume(dap, h, regionKey) {
  const eq = VOLUME_EQUATIONS[regionKey];
  if (!eq) return null;
  return eq.coef * Math.pow(dap, eq.dapExp) * Math.pow(h, eq.hExp);
}

export function calculateVolumes(dapValues, hValues, regionKey) {
  const eq = VOLUME_EQUATIONS[regionKey];
  if (!eq) return [];
  const n = Math.min(dapValues.length, hValues.length);
  const volumes = [];
  for (let i = 0; i < n; i++) {
    volumes.push(eq.coef * Math.pow(dapValues[i], eq.dapExp) * Math.pow(hValues[i], eq.hExp));
  }
  return volumes;
}
