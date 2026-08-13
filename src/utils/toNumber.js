/**
 * Converte um valor lido da planilha/CSV em número, aceitando tanto
 * "12.5" quanto "12,5" (vírgula decimal, comum em CSV exportado do Excel BR).
 * Retorna null se não for possível converter.
 */
export function toNumber(value) {
  if (typeof value === "number") {
    return Number.isNaN(value) ? null : value;
  }

  if (typeof value === "string") {
    const normalized = value.trim().replace(",", ".");
    if (normalized === "") return null;
    const parsed = Number(normalized);
    return Number.isNaN(parsed) ? null : parsed;
  }

  return null;
}
