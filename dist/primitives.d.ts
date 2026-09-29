/** How a cohort is delivered. */
export declare const CohortFormat: {
    readonly FLEX: "flex";
    readonly BOOT: "boot";
    readonly SELF_PACED: "self-paced";
};
export type CohortFormat = (typeof CohortFormat)[keyof typeof CohortFormat];
/** Cohort lifecycle. */
export declare const CohortStatus: {
    readonly DRAFT: "draft";
    readonly ACTIVE: "active";
    readonly CONCLUDED: "concluded";
};
export type CohortStatus = (typeof CohortStatus)[keyof typeof CohortStatus];
//# sourceMappingURL=primitives.d.ts.map