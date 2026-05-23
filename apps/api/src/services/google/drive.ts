import { google } from "googleapis";

export class DriveService {
  private drive;

  constructor(auth: any) {
    this.drive = google.drive({ version: "v3", auth });
  }

  async listFiles(query = "") {
    const res = await this.drive.files.list({
      q: query,
      pageSize: 10,
      fields: "nextPageToken, files(id, name, mimeType)",
    });
    return res.data.files || [];
  }

  async getFileInfo(fileId: string) {
    const res = await this.drive.files.get({ fileId, fields: "id, name, mimeType, webViewLink" });
    return res.data;
  }
}
