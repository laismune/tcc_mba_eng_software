import * as XLSX from "xlsx";

const TEMPLATE_COLUMNS = ["id", "agregador", "dap", "altura"];

export function downloadTemplateXlsx(productName = "forestflow") {
  const worksheet = XLSX.utils.aoa_to_sheet([TEMPLATE_COLUMNS]);

  worksheet["!cols"] = TEMPLATE_COLUMNS.map(() => ({ wch: 14 }));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Modelo");

  const safeName = productName.toLowerCase().replace(/\s+/g, "_");
  XLSX.writeFile(workbook, `modelo_${safeName}.xlsx`);
}
