import * as XLSX from "xlsx";

export function downloadVolumeResultsXlsx(rows, hasAgregador, filename = "resultado_quickvol.xlsx") {
  const data = rows.map((r) => {
    const row = { id: r.id };
    if (hasAgregador) row.agregador = r.agregador;
    row.dap = Number(r.dap.toFixed(2));
    row.altura = Number(r.altura.toFixed(2));
    row.volume = Number(r.volume.toFixed(4));
    return row;
  });

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Resultado");

  XLSX.writeFile(workbook, filename);
}
