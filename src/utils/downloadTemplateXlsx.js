import * as XLSX from "xlsx";

const TEMPLATE_COLUMNS = ["id", "agregador", "dap", "altura"];

/**
 * productName: "GetStats" | "QuickVol" (ou qualquer texto) — usado só
 * pra montar o nome do arquivo baixado.
 */
export function downloadTemplateXlsx(productName = "forestflow") {
  const worksheet = XLSX.utils.aoa_to_sheet([TEMPLATE_COLUMNS]);

  // Deixa as colunas com uma largura confortável
  worksheet["!cols"] = TEMPLATE_COLUMNS.map(() => ({ wch: 14 }));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Modelo");

  const safeName = productName.toLowerCase().replace(/\s+/g, "_");
  XLSX.writeFile(workbook, `modelo_${safeName}.xlsx`);
}
