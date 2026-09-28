import { CohortFormat } from '../common';
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
    bookable: boolean;
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
    id: string;
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