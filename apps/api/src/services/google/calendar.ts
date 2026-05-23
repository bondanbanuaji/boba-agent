import { google } from "googleapis";

export class CalendarService {
  private calendar;

  constructor(auth: any) {
    this.calendar = google.calendar({ version: "v3", auth });
  }

  async listEvents(timeMin?: string, timeMax?: string) {
    const res = await this.calendar.events.list({
      calendarId: "primary",
      timeMin: timeMin || new Date().toISOString(),
      timeMax: timeMax,
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime"
    });
    return res.data.items || [];
  }

  async createEvent(title: string, startTime: string, endTime: string) {
    const res = await this.calendar.events.insert({
      calendarId: "primary",
      requestBody: {
        summary: title,
        start: { dateTime: startTime },
        end: { dateTime: endTime }
      }
    });
    return res.data;
  }
}
