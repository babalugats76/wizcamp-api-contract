"use strict";
// src/meeting.ts
// LMS / operational domain — meeting types.
Object.defineProperty(exports, "__esModule", { value: true });
exports.MEETING_AUDIENCE_LABEL = exports.MEETING_TYPE_ORDER = exports.MEETING_TYPE_META = exports.MeetingAudience = exports.MeetingSource = exports.MeetingType = exports.GRACE_MS = exports.IMMINENT_MS = void 0;
exports.getMeetingPhase = getMeetingPhase;
const MIN_MS = 60000;
const HOUR_MS = 3600000;
const DAY_MS = 86400000;
/** How far before start the Join button activates. */
exports.IMMINENT_MS = 15 * MIN_MS;
/** How long past meeting end the grace window lasts (recording link visible). */
exports.GRACE_MS = 24 * HOUR_MS;
function meetingEndTime(startTime, durationMinutes) {
    return startTime.add({ minutes: durationMinutes });
}
const pluralize = (n, unit) => `${n} ${unit}${n === 1 ? '' : 's'}`;
/**
 * Computes temporal display state for a meeting.
 * `now` is required — never default it.
 */
function getMeetingPhase(startTime, durationMinutes, hasRecording, now, displayTz) {
    const nowMs = now.epochMilliseconds;
    const startMs = startTime.epochMilliseconds;
    const endMs = startMs + durationMinutes * MIN_MS;
    const graceEndMs = endMs + exports.GRACE_MS;
    let status;
    if (nowMs < startMs - exports.IMMINENT_MS)
        status = 'upcoming';
    else if (nowMs < startMs)
        status = 'imminent';
    else if (nowMs < endMs)
        status = 'live';
    else if (nowMs < graceEndMs)
        status = 'grace';
    else
        status = 'past';
    let label;
    if (status === 'live') {
        label = 'happening now';
    }
    else if (status === 'grace') {
        const agoMs = nowMs - endMs;
        label = agoMs < HOUR_MS
            ? `ended ${pluralize(Math.max(1, Math.floor(agoMs / MIN_MS)), 'min')} ago`
            : `ended ${pluralize(Math.floor(agoMs / HOUR_MS), 'hour')} ago`;
    }
    else if (status === 'past') {
        label = `${pluralize(Math.floor((nowMs - endMs) / DAY_MS), 'day')} ago`;
    }
    else {
        const diffMs = startMs - nowMs;
        if (diffMs < HOUR_MS) {
            label = `in ${pluralize(Math.max(1, Math.floor(diffMs / MIN_MS)), 'min')}`;
        }
        else if (diffMs < 48 * HOUR_MS) {
            const hours = Math.floor(diffMs / HOUR_MS);
            const mins = Math.floor((diffMs % HOUR_MS) / MIN_MS);
            label = mins > 0
                ? `in ${pluralize(hours, 'hour')} ${pluralize(mins, 'min')}`
                : `in ${pluralize(hours, 'hour')}`;
        }
        else if (diffMs < 7 * DAY_MS) {
            label = `in ${pluralize(Math.floor(diffMs / DAY_MS), 'day')}`;
        }
        else {
            label = startTime.toZonedDateTimeISO(displayTz).toPlainDate().toLocaleString('en-US', { month: 'short', day: 'numeric' });
        }
    }
    return {
        status,
        label,
        canJoin: status === 'live' || status === 'imminent',
        showRecording: status === 'grace' && hasRecording,
    };
}
// ─── Meeting enums ────────────────────────────────────────────────────────────
exports.MeetingType = {
    CLASS: 'class',
    FLEX: 'flex',
    OFFICE_HOURS: 'office_hours',
    COACHING: 'coaching',
    WORKSHOP: 'workshop',
    EVENT: 'event',
    WEBINAR: 'webinar',
};
exports.MeetingSource = {
    ZOOM_API: 'zoom_api',
    MANUAL_LINK: 'manual_link',
};
exports.MeetingAudience = {
    WIZCAMPERS: 'WIZCAMPERS',
    FAMILIES: 'FAMILIES',
    COMMUNITY: 'COMMUNITY',
};
exports.MEETING_TYPE_META = {
    [exports.MeetingType.CLASS]: { label: 'Class', tone: 'indigo' },
    [exports.MeetingType.FLEX]: { label: 'Flex Class', tone: 'violet' },
    [exports.MeetingType.OFFICE_HOURS]: { label: 'Office Hours', tone: 'sky' },
    [exports.MeetingType.COACHING]: { label: 'Coaching', tone: 'amber' },
    [exports.MeetingType.WORKSHOP]: { label: 'Workshop', tone: 'orange' },
    [exports.MeetingType.EVENT]: { label: 'Event', tone: 'emerald' },
    [exports.MeetingType.WEBINAR]: { label: 'Webinar', tone: 'teal' },
};
exports.MEETING_TYPE_ORDER = [
    exports.MeetingType.CLASS,
    exports.MeetingType.FLEX,
    exports.MeetingType.OFFICE_HOURS,
    exports.MeetingType.COACHING,
    exports.MeetingType.WORKSHOP,
    exports.MeetingType.EVENT,
    exports.MeetingType.WEBINAR,
];
exports.MEETING_AUDIENCE_LABEL = {
    [exports.MeetingAudience.WIZCAMPERS]: 'Wizcampers',
    [exports.MeetingAudience.FAMILIES]: 'Families',
    [exports.MeetingAudience.COMMUNITY]: 'Community',
};
//# sourceMappingURL=meeting.js.map