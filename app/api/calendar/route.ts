import { NextResponse } from 'next/server';
import ical from 'ical-generator';

export const runtime = 'nodejs';

export async function GET() {
  // Create a new calendar instance
  const calendar = ical({ name: 'VoterNexus Election Reminders' });
  
  // Example hardcoded event (In production, this would be dynamic based on user's constituency phase)
  calendar.createEvent({
    start: new Date('2024-05-20T07:00:00+05:30'),
    end: new Date('2024-05-20T18:00:00+05:30'),
    summary: 'Election Polling Day',
    description: 'It is your designated polling day. Remember to carry your Voter ID (EPIC) or alternate approved identification document.',
    location: 'Your designated polling booth',
    url: 'https://voters.eci.gov.in/'
  });

  return new NextResponse(calendar.toString(), {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'attachment; filename="election-reminders.ics"',
    },
  });
}
