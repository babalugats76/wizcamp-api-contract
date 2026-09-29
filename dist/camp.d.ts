import { Temporal } from 'temporal-polyfill';
import type { CohortFormat } from './primitives';
export declare const CampLevelColor: {
    readonly EMERALD: "emerald";
    readonly SKY: "sky";
    readonly AMBER: "amber";
    readonly ROSE: "rose";
    readonly VIOLET: "violet";
};
export type CampLevelColor = (typeof CampLevelColor)[keyof typeof CampLevelColor];
export declare const CampStatus: {
    readonly UPCOMING: "upcoming";
    readonly IN_PROGRESS: "in-progress";
    readonly CONCLUDED: "concluded";
};
export type CampStatus = (typeof CampStatus)[keyof typeof CampStatus];
/** Difficulty level number — 1 (beginner) through 5 (advanced). */
export type CampLevelNumber = 1 | 2 | 3 | 4 | 5;
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
 * The public sales listing of a cohort, as represented by a Square ITEM_VARIATION.
 * Distinct from cohort.ts's `Cohort` (the LMS operational entity).
 */
export type CampSession = {
    id: string;
    sku: string;
    name: string;
    amount: number;
    price: string;
    displayPrice: string;
    currency: string;
    imageUrls: string[];
    bookable: boolean;
    startDate?: string;
    endDate?: string;
    meetingTimes?: string[];
    format?: CohortFormat;
    instructor?: string;
    resourceIds: string[];
    emailImageUrl?: string;
};
/** A camp with its available sessions, as returned by the /camps endpoint. */
export type Camp = {
    id: string;
    name: string;
    category: string;
    rootCategory: string;
    descriptionHtml: string;
    imageUrls: string[];
    emailImageUrl?: string;
    sessions: CampSession[];
    program?: string;
    track?: string;
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
//# sourceMappingURL=camp.d.ts.map