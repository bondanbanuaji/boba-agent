import { google } from "googleapis";

export class GmailService {
  private gmail;

  constructor(auth: any) {
    this.gmail = google.gmail({ version: "v1", auth });
  }

  async listEmails(query = "") {
    const res = await this.gmail.users.messages.list({ userId: "me", q: query, maxResults: 10 });
    return res.data.messages || [];
  }

  async sendEmail(to: string, subject: string, body: string) {
    const rawMessage = Buffer.from(
      `To: ${to}\n` +
      `Subject: ${subject}\n` +
      `Content-Type: text/html; charset=utf-8\n\n` +
      `${body}`
    ).toString("base64").replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    
    return await this.gmail.users.messages.send({
      userId: "me",
      requestBody: { raw: rawMessage }
    });
  }
}
