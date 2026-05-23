import { google } from "googleapis";

export class DocsService {
  private docs;

  constructor(auth: any) {
    this.docs = google.docs({ version: "v1", auth });
  }

  async readDocument(documentId: string) {
    const res = await this.docs.documents.get({ documentId });
    return res.data;
  }

  async createDocument(title: string) {
    const res = await this.docs.documents.create({
      requestBody: { title }
    });
    return res.data;
  }
}
