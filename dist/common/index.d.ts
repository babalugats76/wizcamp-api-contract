/**
 * Generic utilities shared across all domains.
 * These types are domain-agnostic and have no surface-specific meaning.
 */
import { Temporal } from 'temporal-polyfill';
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
    durationSeconds?: number;
};
/** Difficulty level number — 1 (beginner) through 5 (advanced). */
export type CampLevelNumber = 1 | 2 | 3 | 4 | 5;
export declare const CampLevelColor: {
    readonly EMERALD: "emerald";
    readonly SKY: "sky";
    readonly AMBER: "amber";
    readonly ROSE: "rose";
    readonly VIOLET: "violet";
};
export type CampLevelColor = (typeof CampLevelColor)[keyof typeof CampLevelColor];
/**
 * Structured camp difficulty level — serializable, no React component references.
 * The display icon is resolved client-side from the `level` number and is never
 * stored or transmitted.
 */
export type CampLevel = {
    level: CampLevelNumber;
    name: string;
    tagline: string;
    color: CampLevelColor;
};
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
export declare const CampStatus: {
    readonly UPCOMING: "upcoming";
    readonly IN_PROGRESS: "in-progress";
    readonly CONCLUDED: "concluded";
};
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
export declare function getCampPhase(startDate: string | undefined, endDate: string | undefined, now: Temporal.Instant, tz: string): CampPhase;
/** How far before start the Join button activates. */
export declare const IMMINENT_MS: number;
/** How long past meeting end the grace window lasts (recording link visible). */
export declare const GRACE_MS: number;
export type MeetingStatus = 'upcoming' | 'imminent' | 'live' | 'grace' | 'past';
export type MeetingPhase = {
    status: MeetingStatus;
    label: string;
    canJoin: boolean;
    showRecording: boolean;
};
/**
 * Computes the end time of a meeting.
 */
export declare function meetingEndTime(startTime: Temporal.Instant, durationMinutes: number): Temporal.Instant;
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
export declare function getMeetingPhase(startTime: Temporal.Instant, durationMinutes: number, hasRecording: boolean, now: Temporal.Instant, displayTz: string): MeetingPhase;
export declare const CohortFormat: {
    readonly FLEX: "flex";
    readonly BOOT: "boot";
    readonly SELF_PACED: "self-paced";
};
export type CohortFormat = (typeof CohortFormat)[keyof typeof CohortFormat];
//# sourceMappingURL=index.d.ts.map