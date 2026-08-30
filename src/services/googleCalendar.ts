import { ScheduleEvent } from '../types';

const CALENDAR_API_BASE = 'https://www.googleapis.com/calendar/v3/calendars';
const DEFAULT_TIME_ZONE = 'Asia/Seoul';
const DEFAULT_MAX_RESULTS = 50;

type GoogleCalendarDate = {
  date?: string;
  dateTime?: string;
};

type GoogleCalendarEvent = {
  id: string;
  status?: string;
  summary?: string;
  description?: string;
  location?: string;
  htmlLink?: string;
  start?: GoogleCalendarDate;
  end?: GoogleCalendarDate;
  attendees?: Array<{ responseStatus?: string }>;
  extendedProperties?: {
    shared?: Record<string, string>;
  };
};

type GoogleCalendarResponse = {
  items?: GoogleCalendarEvent[];
  error?: {
    message?: string;
  };
};

type CalendarMetadata = Record<string, string> & {
  body: string;
};

const metadataAliases: Record<string, string> = {
  type: 'type',
  유형: 'type',
  종류: 'type',
  court: 'courtDetails',
  코트: 'courtDetails',
  parking: 'parkingInfo',
  주차: 'parkingInfo',
  capacity: 'maxCapacity',
  정원: 'maxCapacity',
  rsvp: 'currentRsvp',
  신청: 'currentRsvp',
  coach: 'coach',
  코치: 'coach',
  description: 'description',
  설명: 'description',
  venue: 'location',
  장소: 'location',
  address: 'address',
  주소: 'address',
  map: 'mapUrl',
  지도: 'mapUrl',
};

const getPositiveInteger = (value?: string) => {
  if (!value) return undefined;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
};

type CalendarDateParts = {
  year: number;
  month: number;
  day: number;
};

const getDatePartsInTimeZone = (date: Date, timeZone: string): CalendarDateParts => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return {
    year: Number(values.year),
    month: Number(values.month),
    day: Number(values.day),
  };
};

const getTimeZoneOffset = (date: Date, timeZone: string) => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  const timeInUtc = Date.UTC(
    Number(values.year),
    Number(values.month) - 1,
    Number(values.day),
    Number(values.hour),
    Number(values.minute),
    Number(values.second),
  );

  return timeInUtc - date.getTime();
};

const getStartOfDayInTimeZone = (
  { year, month, day }: CalendarDateParts,
  timeZone: string,
) => {
  const midnightAsUtc = Date.UTC(year, month - 1, day);
  let instant = midnightAsUtc;

  // DST 전환이 있는 시간대도 정확한 현지 자정을 찾도록 오프셋을 재계산합니다.
  for (let attempt = 0; attempt < 2; attempt += 1) {
    instant = midnightAsUtc - getTimeZoneOffset(new Date(instant), timeZone);
  }

  return new Date(instant);
};

const getCurrentWeekRange = (timeZone: string) => {
  const today = getDatePartsInTimeZone(new Date(), timeZone);
  const todayAsUtc = Date.UTC(today.year, today.month - 1, today.day);
  const dayOfWeek = new Date(todayAsUtc).getUTCDay();
  const daysSinceMonday = (dayOfWeek + 6) % 7;
  const mondayAsUtc = new Date(todayAsUtc - daysSinceMonday * 86_400_000);
  const nextMondayAsUtc = new Date(mondayAsUtc.getTime() + 7 * 86_400_000);
  const weekStart = getStartOfDayInTimeZone(
    {
      year: mondayAsUtc.getUTCFullYear(),
      month: mondayAsUtc.getUTCMonth() + 1,
      day: mondayAsUtc.getUTCDate(),
    },
    timeZone,
  );
  const weekEnd = getStartOfDayInTimeZone(
    {
      year: nextMondayAsUtc.getUTCFullYear(),
      month: nextMondayAsUtc.getUTCMonth() + 1,
      day: nextMondayAsUtc.getUTCDate(),
    },
    timeZone,
  );

  return { weekStart, weekEnd };
};

const getCurrentAndNextMonthRange = (timeZone: string) => {
  const today = getDatePartsInTimeZone(new Date(), timeZone);
  const rangeStart = getStartOfDayInTimeZone(
    { year: today.year, month: today.month, day: 1 },
    timeZone,
  );
  const monthAfterNextAsUtc = new Date(Date.UTC(today.year, today.month + 1, 1));
  const rangeEnd = getStartOfDayInTimeZone(
    {
      year: monthAfterNextAsUtc.getUTCFullYear(),
      month: monthAfterNextAsUtc.getUTCMonth() + 1,
      day: 1,
    },
    timeZone,
  );

  return { rangeStart, rangeEnd };
};

export const getMillisecondsUntilNextCalendarWeek = () => {
  const timeZone = import.meta.env.VITE_CALENDAR_TIME_ZONE || DEFAULT_TIME_ZONE;
  const { weekEnd } = getCurrentWeekRange(timeZone);

  // 월요일 자정 경계 직후에 조회되도록 1초의 여유를 둡니다.
  return Math.max(weekEnd.getTime() - Date.now() + 1_000, 1_000);
};

const parseDescription = (description = ''): CalendarMetadata => {
  const metadata: Record<string, string> = {};
  const bodyLines: string[] = [];

  description.split(/\r?\n/).forEach((line) => {
    const match = line.match(/^\s*([^:：]+)\s*[:：]\s*(.+?)\s*$/);
    const normalizedKey = match?.[1]?.trim().toLowerCase();
    const key = normalizedKey ? metadataAliases[normalizedKey] : undefined;

    if (match && key) {
      metadata[key] = match[2].trim();
    } else if (line.trim()) {
      bodyLines.push(line.trim());
    }
  });

  return {
    ...metadata,
    body: bodyLines.join(' '),
  };
};

const extractGoogleFormUrl = (description = '') => {
  const match = description.match(
    /https:\/\/(?:docs\.google\.com\/forms\/d\/(?:e\/)?[\w-]+\/viewform|forms\.gle\/[\w-]+)(?:\?[^\s<>"']*)?/i,
  );

  return match?.[0].replace(/[),.]+$/, '');
};

const inferScheduleType = (
  title: string,
  description: string,
  explicitType?: string,
): ScheduleEvent['type'] => {
  const value = `${explicitType ?? ''} ${title} ${description}`.toLowerCase();

  if (/beginner|입문|초보/.test(value)) return 'beginner';
  if (/scrimmage|match|게임|경기|매치|자체전/.test(value)) return 'scrimmage';
  if (/tactics|training|전술|훈련|트레이닝/.test(value)) return 'tactics';
  return 'regular';
};

const formatDateLabel = (start: GoogleCalendarDate, timeZone: string) => {
  const value = start.dateTime ?? `${start.date}T00:00:00`;
  const date = new Date(value);

  return new Intl.DateTimeFormat('ko-KR', {
    timeZone,
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  }).format(date);
};

const formatTimeRange = (
  start: GoogleCalendarDate,
  end: GoogleCalendarDate | undefined,
  timeZone: string,
) => {
  if (!start.dateTime) return '종일';

  const formatter = new Intl.DateTimeFormat('ko-KR', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const startText = formatter.format(new Date(start.dateTime));
  const endText = end?.dateTime ? formatter.format(new Date(end.dateTime)) : undefined;

  return endText ? `${startText} - ${endText}` : startText;
};

const getIsoDate = (start: GoogleCalendarDate, timeZone: string) => {
  if (start.date) return start.date;

  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(start.dateTime!));
};

const mapCalendarEvent = (
  event: GoogleCalendarEvent,
  timeZone: string,
): ScheduleEvent | null => {
  if (!event.start?.dateTime && !event.start?.date) return null;

  const parsed = parseDescription(event.description);
  const shared = event.extendedProperties?.shared ?? {};
  const metadata = { ...parsed, ...shared };
  const title = event.summary?.trim() || '한늬 일정';
  const location = metadata.location || event.location?.trim() || '장소 미정';
  const acceptedAttendees = event.attendees?.filter(
    (attendee) => attendee.responseStatus === 'accepted',
  ).length;

  return {
    id: `google-${event.id}`,
    title,
    type: inferScheduleType(title, event.description ?? '', metadata.type),
    date: getIsoDate(event.start, timeZone),
    dayOfWeek: formatDateLabel(event.start, timeZone),
    time: formatTimeRange(event.start, event.end, timeZone),
    startDateTime: event.start.dateTime ?? event.start.date,
    location,
    address: metadata.address || event.location?.trim() || location,
    courtDetails: metadata.courtDetails,
    parkingInfo: metadata.parkingInfo,
    mapUrl: metadata.mapUrl,
    maxCapacity: getPositiveInteger(metadata.maxCapacity),
    currentRsvp: getPositiveInteger(metadata.currentRsvp) ?? acceptedAttendees,
    description:
      metadata.description ||
      parsed.body ||
      '자세한 내용은 Google Calendar 일정을 확인해주세요.',
    coach: metadata.coach,
    sourceUrl: event.htmlLink,
    rsvpUrl: extractGoogleFormUrl(event.description),
  };
};

export const isGoogleCalendarConfigured = () =>
  Boolean(
    import.meta.env.VITE_GOOGLE_CALENDAR_ID &&
      import.meta.env.VITE_GOOGLE_CALENDAR_API_KEY,
  );

export const fetchGoogleCalendarSchedules = async (): Promise<ScheduleEvent[]> => {
  const calendarId = import.meta.env.VITE_GOOGLE_CALENDAR_ID;
  const apiKey = import.meta.env.VITE_GOOGLE_CALENDAR_API_KEY;
  const timeZone = import.meta.env.VITE_CALENDAR_TIME_ZONE || DEFAULT_TIME_ZONE;

  if (!calendarId || !apiKey) {
    throw new Error('Google Calendar 환경 변수가 설정되지 않았습니다.');
  }

  const maxResults =
    getPositiveInteger(import.meta.env.VITE_GOOGLE_CALENDAR_MAX_RESULTS) ||
    DEFAULT_MAX_RESULTS;
  const { rangeStart, rangeEnd } = getCurrentAndNextMonthRange(timeZone);

  const query = new URLSearchParams({
    key: apiKey,
    singleEvents: 'true',
    orderBy: 'startTime',
    showDeleted: 'false',
    timeMin: rangeStart.toISOString(),
    timeMax: rangeEnd.toISOString(),
    maxResults: String(maxResults),
    timeZone,
  });
  const response = await fetch(
    `${CALENDAR_API_BASE}/${encodeURIComponent(calendarId)}/events?${query}`,
  );
  const payload = (await response.json()) as GoogleCalendarResponse;

  if (!response.ok) {
    throw new Error(payload.error?.message || 'Google Calendar 일정을 불러오지 못했습니다.');
  }

  return (payload.items ?? [])
    .filter((event) => event.status !== 'cancelled')
    .map((event) => mapCalendarEvent(event, timeZone))
    .filter((event): event is ScheduleEvent => event !== null);
};
