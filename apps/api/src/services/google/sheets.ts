import { google } from "googleapis";

export class SheetsService {
  private sheets;

  constructor(auth: any) {
    this.sheets = google.sheets({ version: "v4", auth });
  }

  async readSheet(spreadsheetId: string, range: string) {
    const res = await this.sheets.spreadsheets.values.get({ spreadsheetId, range });
    return res.data.values || [];
  }

  async writeCells(spreadsheetId: string, range: string, values: any[][]) {
    const res = await this.sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: "USER_ENTERED",
      requestBody: { values }
    });
    return res.data;
  }
}
