import * as XLSX from "xlsx";

export async function parseQuickVolFile(file) {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rawRows = XLSX.utils.sheet_to_json(sheet, { defval: null });

  const hasAgregador = rawRows.some(
    (row) => row.agregador !== null && row.agregador !== undefined && row.agregador !== ""
  );

  const rows = rawRows
    .filter((row) => typeof row.dap === "number" && typeof row.altura === "number")
    .map((row, index) => ({
      id: row.id ?? index + 1,
      agregador: hasAgregador ? row.agregador ?? "Sem agregador" : null,
      dap: row.dap,
      altura: row.altura,
    }));

  return { rows, hasAgregador };
}
