import type { ScheduleEvent } from '../types';

export function calendarDateKey(now: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone, year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(now);
  const values = Object.fromEntries(parts.map(part => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

export function calendarWeek(now: Date, timeZone: string) {
  const day = new Date(`${calendarDateKey(now, timeZone)}T00:00:00Z`);
  day.setUTCDate(day.getUTCDate() - (day.getUTCDay() + 6) % 7);
  const startDate = day.toISOString().slice(0, 10);
  day.setUTCDate(day.getUTCDate() + 7);
  return { startDate, endDateExclusive: day.toISOString().slice(0, 10) };
}

export function nextSchedule(events: ScheduleEvent[], now: Date, timeZone: string) {
  const today = calendarDateKey(now, timeZone);
  return events.filter(event => event.startDateTime?.includes('T')
    ? new Date(event.startDateTime).getTime() > now.getTime()
    : event.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date)
      || (a.startDateTime?.includes('T') ? new Date(a.startDateTime).getTime() : -Infinity)
        - (b.startDateTime?.includes('T') ? new Date(b.startDateTime).getTime() : -Infinity))[0];
}
