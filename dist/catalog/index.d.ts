export declare const CohortFormat: {
    readonly Flex: "flex";
    readonly Boot: "boot";
};
export type CohortFormat = (typeof CohortFormat)[keyof typeof CohortFormat];
export declare const CohortStatus: {
    readonly Completed: "completed";
    readonly InProgress: "in-progress";
    readonly Upcoming: "upcoming";
    readonly Inactive: "inactive";
};
export type CohortStatus = (typeof CohortStatus)[keyof typeof CohortStatus];
export declare const CampStatus: {
    readonly UPCOMING: "upcoming";
    readonly IN_PROGRESS: "in-progress";
    readonly CONCLUDED: "concluded";
};
export type CampStatus = (typeof CampStatus)[keyof typeof CampStatus];
/**
 * Client-computed display state for a camp cohort.
 * Returned by getCampPhase() in lib/date.ts.
 * Never sent over the wire — computed in the browser from startDate/endDate.
 */
export type CampPhase = {
    status: CampStatus;
    label: string;
    isActive: boolean;
};
/** A single cohort (session/run) of a camp, as returned by the /camps endpoint. */
export type Cohort = {
    id: string;
    name: string;
    sku: string;
    amount: number;
    price: string;
    displayPrice: string;
    currency: string;
    imageUrls: string[];
    status: CohortStatus;
    active?: boolean;
    startDate?: string;
    endDate?: string;
    meetingTimes?: string[];
    format?: CohortFormat;
    instructor?: string;
    resourceIds: string[];
    emailImageUrl?: string;
};
/** A camp with its available cohorts, as returned by the /camps endpoint. */
export type Camp = {
    name: string;
    category: string;
    rootCategory: string;
    descriptionHtml: string;
    imageUrls: string[];
    emailImageUrl?: string;
    cohorts: Cohort[];
    program?: string;
    track?: string;
};
//# sourceMappingURL=index.d.ts.map