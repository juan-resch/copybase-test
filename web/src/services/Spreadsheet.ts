import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:3333/spreadsheet" });

export default class SpreadsheetService {
  static async convertSpreadsheetToChartData(spreadsheetFile: File) {
    try {
      const data = new FormData();

      data.append("file", spreadsheetFile);

      const response = await api.post("/convertSpreadsheetToChartData", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return {
        data: response.data,
        status: response.status,
        success: true,
      };
    } catch (error: any) {
      const msg = error?.response?.data?.error || "Unknown error";
      const status = error?.response?.status || 0;
      console.log(error);

      return {
        error: msg,
        status,
        success: false,
      };
    }
  }
}
