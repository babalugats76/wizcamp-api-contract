// packages/api-contract/src/common/index.ts

/**
 * Generic utilities shared across all domains.
 * These types are domain-agnostic and have no surface-specific meaning.
 */

import { Temporal } from 'temporal-polyfill';

// ─── Base media primitives ────────────────────────────────────────────────────────────────────────────────
//
// Serializable references to public media resources. These types are shared
// across wizcamp-lms, wizcamp-backend, and wizcamp-web. They intentionally do
// NOT extend DOM interfaces (HTMLImageElement, HTMLVideoElement) which carry
// behavioral properties meaningless in a JSON payload.
//
// Naming follows the Media namespace to avoid collision with React/Next.js
// component names (Image, Video) and DOM types.

/** A serializable reference to a public image resource. */
export type MediaImage = {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
};

/** A serializable reference to a public video resource. */
export type MediaVideo = {
  url: string;
  posterUrl?: string;
  title?: string;
  durationSeconds?: number;  // always seconds — display formatting ("3:45") is a UI concern
};

// ─── Camp level ──────────────────────────────────────────────────────────────────────────────────────

/** Difficulty level number — 1 (beginner) through 5 (advanced). */
export type CampLevelNumber = 1 | 2 | 3 | 4 | 5;

export const CampLevelColor = {
  EMERALD: 'emerald',
  SKY:     'sky',
  AMBER:   'amber',
  ROSE:    'rose',
  VIOLET:  'violet',
} as const;
export type CampLevelColor = (typeof CampLevelColor)[keyof typeof CampLevelColor];

/**
 * Structured camp difficulty level — serializable, no React component references.
 * The display icon is resolved client-side from the `level` number and is never
 * stored or transmitted.
 */
export type CampLevel = {
  level: CampLevelNumber;
  name: string;    // e.g. "Builder"
  tagline: string; // e.g. "Time to create."
  color: CampLevelColor;
};

// ─── Pagination + API response wrappers ──────────────────────────────────────────────────────────────
export type Paginated<T> = {
  items: T[];
  count: number;
  lastKey?: string;
};

export type APISuccessResponse<T> = {
  success: true;
  data: T;
  statusCode: number;
  message: string;
};

export type APIErrorResponse = {
  success: false;
  message: string;
  statusCode: number;
  service?: string;
  fields?: string[];
};

export type APIResponse<T> = APISuccessResponse<T> | APIErrorResponse;

// ─── Camp phase ─────────────────────────────────────────────────────────────
// Moved from catalog/index.ts — consumed by wizcamp-web for client-side phase
// derivation. Never sent over the wire.

export const CampStatus = {
  UPCOMING:    'upcoming',
  IN_PROGRESS: 'in-progress',
  CONCLUDED:   'concluded',
} as const;
export type CampStatus = (typeof CampStatus)[keyof typeof CampStatus];

/**
 * Client-computed display state for a camp cohort.
 * Returned by getCampPhase().
 * Never sent over the wire — computed in the browser from startDate/endDate.
 */
export type CampPhase = {
  status: CampStatus;
  label: string;
  isActive: boolean;
};

function parseDateOrNull(raw: string | undefined | null): Temporal.PlainDate | null {
  if (!raw) return null;
  try { return Temporal.PlainDate.from(raw); } catch { return null; }
}

/**
 * Computes customer-facing display phase for a camp cohort.
 * `now` and `tz` are required — never default them.
 * Uses PlainDate comparison in `tz` (the "birthday rule") — consistent with
 * what customers see rendered.
 *
 * @param startDate  ISO date string or undefined
 * @param endDate    ISO date string or undefined
 * @param now        current instant (required)
 * @param tz         IANA timezone for calendar-day boundary
 */
export function getCampPhase(
  startDate: string | undefined,
  endDate:   string | undefined,
  now:       Temporal.Instant,
  tz:        string,
): CampPhase {
  const start = parseDateOrNull(startDate);
  const end   = parseDateOrNull(endDate);

  if (!start || !end) {
    return { status: CampStatus.UPCOMING, label: '', isActive: false };
  }

  const today = now.toZonedDateTimeISO(tz).toPlainDate();

  if (Temporal.PlainDate.compare(today, end) >= 0) {
    return { status: CampStatus.CONCLUDED, label: 'concluded', isActive: false };
  }

  if (Temporal.PlainDate.compare(today, start) >= 0) {
    return { status: CampStatus.IN_PROGRESS, label: 'in progress', isActive: true };
  }

  const days = today.until(start, { largestUnit: 'day' }).days;

  let label: string;
  if (days === 1) label = 'Starts Tomorrow';
  else if (days < 7) label = `Starts in ${days} days`;
  else if (days < 14) label = 'Starts in 1 week';
  else if (days < 30) label = `Starts in ${Math.floor(days / 7)} weeks`;
  else if (days < 60) label = 'Starts in 1 month';
  else label = `Starts in ${Math.floor(days / 30)} months`;

  return { status: CampStatus.UPCOMING, label, isActive: false };
}

// ─── Meeting phase ───────────────────────────────────────────────────────────

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

/**
 * Computes the end time of a meeting.
 */
export function meetingEndTime(startTime: Temporal.Instant, durationMinutes: number): Temporal.Instant {
  return startTime.add({ minutes: durationMinutes });
}

const pluralize = (n: number, unit: string) => `${n} ${unit}${n === 1 ? '' : 's'}`;

/**
 * Computes temporal display state for a meeting.
 * `now` is required — never default it. A defaulted `now` is a hydration trap
 * on SSR pages where server and client render at different instants.
 *
 * @param startTime       meeting start instant (convert strings with toInstant() at the call site)
 * @param durationMinutes scheduled duration
 * @param hasRecording    whether a recordingUrl is set on the meeting
 * @param now             current instant (required)
 * @param displayTz       timezone for far-future date display
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

// ─── Camp phase ───────────────────────────────────────────────────────────────

export const CohortFormat = {
  FLEX:       'flex',
  BOOT:       'boot',
  SELF_PACED: 'self-paced',
} as const;
export type CohortFormat = (typeof CohortFormat)[keyof typeof CohortFormat];