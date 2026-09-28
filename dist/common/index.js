"use strict";
// packages/api-contract/src/common/index.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.CohortFormat = exports.GRACE_MS = exports.IMMINENT_MS = exports.CampStatus = exports.CampLevelColor = void 0;
exports.getCampPhase = getCampPhase;
exports.meetingEndTime = meetingEndTime;
exports.getMeetingPhase = getMeetingPhase;
/**
 * Generic utilities shared across all domains.
 * These types are domain-agnostic and have no surface-specific meaning.
 */
const temporal_polyfill_1 = require("temporal-polyfill");
exports.CampLevelColor = {
    EMERALD: 'emerald',
    SKY: 'sky',
    AMBER: 'amber',
    ROSE: 'rose',
    VIOLET: 'violet',
};
// ─── Camp phase ─────────────────────────────────────────────────────────────
// Moved from catalog/index.ts — consumed by wizcamp-web for client-side phase
// derivation. Never sent over the wire.
exports.CampStatus = {
    UPCOMING: 'upcoming',
    IN_PROGRESS: 'in-progress',
    CONCLUDED: 'concluded',
};
function parseDateOrNull(raw) {
    if (!raw)
        return null;
    try {
        return temporal_polyfill_1.Temporal.PlainDate.from(raw);
    }
    catch {
        return null;
    }
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
function getCampPhase(startDate, endDate, now, tz) {
    const start = parseDateOrNull(startDate);
    const end = parseDateOrNull(endDate);
    if (!start || !end) {
        return { status: exports.CampStatus.UPCOMING, label: '', isActive: false };
    }
    const today = now.toZonedDateTimeISO(tz).toPlainDate();
    if (temporal_polyfill_1.Temporal.PlainDate.compare(today, end) >= 0) {
        return { status: exports.CampStatus.CONCLUDED, label: 'concluded', isActive: false };
    }
    if (temporal_polyfill_1.Temporal.PlainDate.compare(today, start) >= 0) {
        return { status: exports.CampStatus.IN_PROGRESS, label: 'in progress', isActive: true };
    }
    const days = today.until(start, { largestUnit: 'day' }).days;
    let label;
    if (days === 1)
        label = 'Starts Tomorrow';
    else if (days < 7)
        label = `Starts in ${days} days`;
    else if (days < 14)
        label = 'Starts in 1 week';
    else if (days < 30)
        label = `Starts in ${Math.floor(days / 7)} weeks`;
    else if (days < 60)
        label = 'Starts in 1 month';
    else
        label = `Starts in ${Math.floor(days / 30)} months`;
    return { status: exports.CampStatus.UPCOMING, label, isActive: false };
}
// ─── Meeting phase ───────────────────────────────────────────────────────────
const MIN_MS = 60000;
const HOUR_MS = 3600000;
const DAY_MS = 86400000;
/** How far before start the Join button activates. */
exports.IMMINENT_MS = 15 * MIN_MS;
/** How long past meeting end the grace window lasts (recording link visible). */
exports.GRACE_MS = 24 * HOUR_MS;
/**
 * Computes the end time of a meeting.
 */
function meetingEndTime(startTime, durationMinutes) {
    return startTime.add({ minutes: durationMinutes });
}
const pluralize = (n, unit) => `${n} ${unit}${n === 1 ? '' : 's'}`;
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
// ─── Camp phase ───────────────────────────────────────────────────────────────
exports.CohortFormat = {
    FLEX: 'flex',
    BOOT: 'boot',
    SELF_PACED: 'self-paced',
};
//# sourceMappingURL=index.js.map