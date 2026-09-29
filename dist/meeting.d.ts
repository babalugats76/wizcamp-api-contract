import { Temporal } from 'temporal-polyfill';
import type { CohortStatus } from './cohort';
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
 * Computes temporal display state for a meeting.
 * `now` is required — never default it.
 */
export declare function getMeetingPhase(startTime: Temporal.Instant, durationMinutes: number, hasRecording: boolean, now: Temporal.Instant, displayTz: string): MeetingPhase;
export declare const MeetingType: {
    readonly CLASS: "class";
    readonly FLEX: "flex";
    readonly OFFICE_HOURS: "office_hours";
    readonly COACHING: "coaching";
    readonly WORKSHOP: "workshop";
    readonly EVENT: "event";
    readonly WEBINAR: "webinar";
};
export type MeetingType = (typeof MeetingType)[keyof typeof MeetingType];
export declare const MeetingSource: {
    readonly ZOOM_API: "zoom_api";
    readonly MANUAL_LINK: "manual_link";
};
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
export declare const MeetingAudience: {
    readonly WIZCAMPERS: "WIZCAMPERS";
    readonly FAMILIES: "FAMILIES";
    readonly COMMUNITY: "COMMUNITY";
};
export type MeetingTypeTone = 'indigo' | 'violet' | 'sky' | 'amber' | 'orange' | 'emerald' | 'teal';
export type MeetingTypeMeta = {
    label: string;
    tone: MeetingTypeTone;
};
export declare const MEETING_TYPE_META: Record<MeetingType, MeetingTypeMeta>;
export declare const MEETING_TYPE_ORDER: MeetingType[];
export declare const MEETING_AUDIENCE_LABEL: Record<typeof MeetingAudience[keyof typeof MeetingAudience], string>;
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
export type MeetingSlot = Pick<Meeting, 'meetingId' | 'joinUrl' | 'startTime' | 'durationMinutes' | 'title' | 'agenda' | 'meetingType' | 'recordingUrl' | 'recordingPasscode'> & {
    cohortSlug: string | null;
    campName: string | null;
};
/** Public-facing calendar meeting shape — no join/recording/provider fields. */
export type CalendarMeeting = {
    meetingId: string;
    title: string;
    agenda: string | null;
    startTime: string;
    durationMinutes: number;
    meetingType: MeetingType;
    audiences: MeetingAudience[];
};
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
    from?: string;
    to?: string;
    audienceId?: string;
};
export type UpdateMeetingInput = {
    meetingId: string;
    editScope: MeetingEditScope;
    title?: string;
    meetingType?: MeetingType;
    startTime?: string;
    durationMinutes?: number;
    zoomLink?: string;
    recordingUrl?: string;
    description?: string;
};
/** Always an array — uniform shape regardless of editScope. */
export type UpdateMeetingResponse = {
    editScope: MeetingEditScope;
    meetings: Meeting[];
};
export type RemoveAudienceResponse = {
    deleted: false;
    meeting: Meeting;
} | {
    deleted: true;
};
export type AssignAudiencesResponse = {
    meeting: Meeting;
};
//# sourceMappingURL=meeting.d.ts.map