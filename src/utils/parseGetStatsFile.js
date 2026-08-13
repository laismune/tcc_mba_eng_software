import { readWorkbookFromFile } from "./readWorkbookFromFile";
import { toNumber } from "./toNumber";
import * as XLSX from "xlsx";

const COLUMNS = ["dap", "altura", "vol"];

export async function parseGetStatsFile(file) {
  const workbook = await readWorkbookFromFile(file);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rawRows = XLSX.utils.sheet_to_json(sheet, { defval: null });

  const hasAgregador = rawRows.some(
    (row) => row.agregador !== null && row.agregador !== undefined && row.agregador !== ""
  );

  const rows = rawRows.map((row, index) => {
    const parsed = {
      id: row.id ?? index + 1,
      agregador: hasAgregador ? row.agregador ?? "Sem agregador" : null,
    };
    COLUMNS.forEach((col) => {
      parsed[col] = toNumber(row[col]);
    });
    return parsed;
  });

  return { rows, hasAgregador };
}
