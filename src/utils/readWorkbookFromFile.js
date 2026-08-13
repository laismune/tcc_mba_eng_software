import * as XLSX from "xlsx";


function detectDelimiter(text) {
  const firstLine = text.split(/\r?\n/)[0] || "";
  const semicolons = (firstLine.match(/;/g) || []).length;
  const commas = (firstLine.match(/,/g) || []).length;
  return semicolons > commas ? ";" : ",";
}


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
