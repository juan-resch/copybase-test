export default function convertExcelDateToJSDate(excelDate: number): Date {
  // Ajuste para a diferença entre as épocas do Excel e do JavaScript (1900-01-01)
  const epochDiff = 25569;

  // Converta para milissegundos e crie a data
  const jsDate = new Date((excelDate - epochDiff) * 86400 * 1000);

  return jsDate;
}
