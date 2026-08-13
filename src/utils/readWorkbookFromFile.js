import * as XLSX from "xlsx";

/**
 * Detecta o separador de coluna do CSV olhando a primeira linha.
 * Excel em português normalmente exporta CSV com ";" quando os
 * decimais usam vírgula (ex: "12,5" em vez de "12.5").
 */
function detectDelimiter(text) {
  const firstLine = text.split(/\r?\n/)[0] || "";
  const semicolons = (firstLine.match(/;/g) || []).length;
  const commas = (firstLine.match(/,/g) || []).length;
  return semicolons > commas ? ";" : ",";
}

/**
 * Lê um arquivo .xlsx, .xls ou .csv e retorna o workbook do SheetJS.
 * CSV é lido como texto, com detecção automática do separador de coluna.
 * xlsx/xls são lidos como binário.
 */
export async function readWorkbookFromFile(file) {
  const isCsv = file.name.toLowerCase().endsWith(".csv");

  if (isCsv) {
    const text = await file.text();
    const delimiter = detectDelimiter(text);
    return XLSX.read(text, { type: "string", FS: delimiter });
  }

  const buffer = await file.arrayBuffer();
  return XLSX.read(buffer, { type: "array" });
}
