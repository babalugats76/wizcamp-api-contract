/**
 * Generic utilities shared across all domains.
 * These types are domain-agnostic and have no surface-specific meaning.
 */
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
//# sourceMappingURL=index.d.ts.map