"use strict";
// Commerce / public domain: the Square-backed camp catalog (Camp, CampSession) and client-side camp phase display.
// CampSession is the public sales listing of a cohort, distinct from cohort.ts's Cohort (the LMS operational entity).
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampStatus = void 0;
exports.getCampPhase = getCampPhase;
const temporal_polyfill_1 = require("temporal-polyfill");
// ─── Constants ────────────────────────────────────────────────────────────────
exports.CampStatus = {
    UPCOMING: 'upcoming',
    IN_PROGRESS: 'in-progress',
    CONCLUDED: 'concluded',
};
// ─── Functions ────────────────────────────────────────────────────────────────
// intentionally private — returns a Temporal.PlainDate that never crosses the wire (fails admission clause 1)
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
//# sourceMappingURL=camp.js.map