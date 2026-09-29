// src/meeting.ts
// LMS / operational domain — meeting types.

import { Temporal } from 'temporal-polyfill';
import type { CohortStatus } from './cohort';

const MIN_MS  = 60_000;
const HOUR_MS = 3_600_000;
const DAY_MS  = 86_400_000;

/** How far before start the Join button activates. */
export const IMMINENT_MS = 15 * MIN_MS;
/** How long past meeting end the grace window lasts (recording link visible). */
export const GRACE_MS    = 24 * HOUR_MS;

export type MeetingStatus = 'upcoming' | 'imminent' | 'live' | 'grace' | 'past';

export type MeetingPhase = {
  status:        MeetingStatus;
  label:         string;
  canJoin:       boolean;
  showRecording: boolean;
};

function meetingEndTime(startTime: Temporal.Instant, durationMinutes: number): Temporal.Instant {
  return startTime.add({ minutes: durationMinutes });
}

const pluralize = (n: number, unit: string) => `${n} ${unit}${n === 1 ? '' : 's'}`;

/**
 * Computes temporal display state for a meeting.
 * `now` is required — never default it.
 */
export function getMeetingPhase(
  startTime:       Temporal.Instant,
  durationMinutes: number,
  hasRecording:    boolean,
  now:             Temporal.Instant,
  displayTz:       string,
): MeetingPhase {
  const nowMs      = now.epochMilliseconds;
  const startMs    = startTime.epochMilliseconds;
  const endMs      = startMs + durationMinutes * MIN_MS;
  const graceEndMs = endMs + GRACE_MS;

  let status: MeetingStatus;
  if (nowMs < startMs - IMMINENT_MS) status = 'upcoming';
  else if (nowMs < startMs)          status = 'imminent';
  else if (nowMs < endMs)            status = 'live';
  else if (nowMs < graceEndMs)       status = 'grace';
  else                               status = 'past';

  let label: string;
  if (status === 'live') {
    label = 'happening now';
  } else if (status === 'grace') {
    const agoMs = nowMs - endMs;
    label = agoMs < HOUR_MS
      ? `ended ${pluralize(Math.max(1, Math.floor(agoMs / MIN_MS)), 'min')} ago`
      : `ended ${pluralize(Math.floor(agoMs / HOUR_MS), 'hour')} ago`;
  } else if (status === 'past') {
    label = `${pluralize(Math.floor((nowMs - endMs) / DAY_MS), 'day')} ago`;
  } else {
    const diffMs = startMs - nowMs;
    if (diffMs < HOUR_MS) {
      label = `in ${pluralize(Math.max(1, Math.floor(diffMs / MIN_MS)), 'min')}`;
    } else if (diffMs < 48 * HOUR_MS) {
      const hours = Math.floor(diffMs / HOUR_MS);
      const mins  = Math.floor((diffMs % HOUR_MS) / MIN_MS);
      label = mins > 0
        ? `in ${pluralize(hours, 'hour')} ${pluralize(mins, 'min')}`
        : `in ${pluralize(hours, 'hour')}`;
    } else if (diffMs < 7 * DAY_MS) {
      label = `in ${pluralize(Math.floor(diffMs / DAY_MS), 'day')}`;
    } else {
      label = startTime.toZonedDateTimeISO(displayTz).toPlainDate().toLocaleString('en-US', { month: 'short', day: 'numeric' });
    }
  }

  return {
    status,
    label,
    canJoin:       status === 'live' || status === 'imminent',
    showRecording: status === 'grace' && hasRecording,
  };
}

// ─── Meeting enums ────────────────────────────────────────────────────────────

export const MeetingType = {
  CLASS:        'class',
  FLEX:         'flex',
  OFFICE_HOURS: 'office_hours',
  COACHING:     'coaching',
  WORKSHOP:     'workshop',
  EVENT:        'event',
  WEBINAR:      'webinar',
} as const;
export type MeetingType = (typeof MeetingType)[keyof typeof MeetingType];

export const MeetingSource = {
  ZOOM_API:    'zoom_api',
  MANUAL_LINK: 'manual_link',
} as const;
export type MeetingSource = (typeof MeetingSource)[keyof typeof MeetingSource];

/**
 * Scope of a meeting edit operation.
 * - 'this'               — update only this occurrence
 * - 'this-and-following' — update this occurrence and all future ones in the series
 *
 * Note: 'all' has been removed — the backend treated it identically to
 * 'this-and-following'. The Zod schema in meetings.router.ts has been updated to match.
 */
export type MeetingEditScope = 'this' | 'this-and-following';

export const MeetingAudience = {
  WIZCAMPERS: 'WIZCAMPERS',
  FAMILIES:   'FAMILIES',
  COMMUNITY:  'COMMUNITY',
} as const;

// ─── Meeting meta ─────────────────────────────────────────────────────────────

export type MeetingTypeTone =
  | 'indigo'
  | 'violet'
  | 'sky'
  | 'amber'
  | 'orange'
  | 'emerald'
  | 'teal';

export type MeetingTypeMeta = {
  label: string;
  tone:  MeetingTypeTone;
};

export const MEETING_TYPE_META: Record<MeetingType, MeetingTypeMeta> = {
  [MeetingType.CLASS]:        { label: 'Class',        tone: 'indigo'  },
  [MeetingType.FLEX]:         { label: 'Flex Class',   tone: 'violet'  },
  [MeetingType.OFFICE_HOURS]: { label: 'Office Hours', tone: 'sky'     },
  [MeetingType.COACHING]:     { label: 'Coaching',     tone: 'amber'   },
  [MeetingType.WORKSHOP]:     { label: 'Workshop',     tone: 'orange'  },
  [MeetingType.EVENT]:        { label: 'Event',        tone: 'emerald' },
  [MeetingType.WEBINAR]:      { label: 'Webinar',      tone: 'teal'    },
};

export const MEETING_TYPE_ORDER: MeetingType[] = [
  MeetingType.CLASS,
  MeetingType.FLEX,
  MeetingType.OFFICE_HOURS,
  MeetingType.COACHING,
  MeetingType.WORKSHOP,
  MeetingType.EVENT,
  MeetingType.WEBINAR,
];

export const MEETING_AUDIENCE_LABEL: Record<typeof MeetingAudience[keyof typeof MeetingAudience], string> = {
  [MeetingAudience.WIZCAMPERS]: 'Wizcampers',
  [MeetingAudience.FAMILIES]:   'Families',
  [MeetingAudience.COMMUNITY]:  'Community',
};

// ─── Meeting entity types ─────────────────────────────────────────────────────

export type MeetingCohort = {
  cohortSlug: string;
  campName: string;
  name: string;
  status: CohortStatus;
  startDate: string;
  endDate: string;
};

export type MeetingAudience = typeof MeetingAudience[keyof typeof MeetingAudience] | MeetingCohort;

export type Meeting = {
  meetingId: string;
  title: string;
  agenda: string | null;
  joinUrl: string;
  passcode: string | null;
  startTime: string;
  durationMinutes: number;
  meetingType: MeetingType;
  source: MeetingSource;
  providerMeetingId: string | null;
  occurrenceId: string | null;
  recordingUrl: string | null;
  recordingPasscode: string | null;
  audiences: MeetingAudience[];
  createdAt: string;
  updatedAt: string;
};

export type MeetingSlot = Pick<Meeting,
  | 'meetingId'
  | 'joinUrl'
  | 'startTime'
  | 'durationMinutes'
  | 'title'
  | 'agenda'
  | 'meetingType'
  | 'recordingUrl'
  | 'recordingPasscode'
> & {
  cohortSlug: string | null;
  campName:   string | null;
};

/** Public-facing calendar meeting shape — no join/recording/provider fields. */
export type CalendarMeeting = {
  meetingId:       string;
  title:           string;
  agenda:          string | null;
  startTime:       string;
  durationMinutes: number;
  meetingType:     MeetingType;
  audiences:       MeetingAudience[];
};

// ─── Meeting mutations ────────────────────────────────────────────────────────

export type CreateMeetingInput = {
  title: string;
  agenda?: string;
  meetingType: MeetingType;
  source: MeetingSource;
  startTime: string;
  durationMinutes: number;
  joinUrl?: string;
  passcode?: string;
  audiences: string[];
};

export type CreateRecurringMeetingInput = CreateMeetingInput & {
  recurrence: {
    type: 1 | 2 | 3;
    repeatInterval: number;
    weeklyDays?: string;
    endTimes?: number;
    endDateTime?: string;
  };
};

export type CreateRecurringMeetingResponse = {
  meetings: Meeting[];
  seriesId: string;
};

export type MeetingListParams = {
  from?:       string;
  to?:         string;
  audienceId?: string;
};

export type UpdateMeetingInput = {
  meetingId:        string;
  editScope:        MeetingEditScope;
  title?:           string;
  meetingType?:     MeetingType;
  startTime?:       string;
  durationMinutes?: number;
  zoomLink?:        string;
  recordingUrl?:    string;
  description?:     string;
};

/** Always an array — uniform shape regardless of editScope. */
export type UpdateMeetingResponse = {
  editScope: MeetingEditScope;
  meetings:  Meeting[];
};

export type RemoveAudienceResponse =
  | { deleted: false; meeting: Meeting }
  | { deleted: true };

export type AssignAudiencesResponse = {
  meeting: Meeting;
};
