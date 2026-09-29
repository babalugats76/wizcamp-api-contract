import type { CohortFormat } from './cohort';
import type { MediaImage, MediaVideo } from './media';
import type { CampLevel } from './camp';
import type { UnitLabel, CohortStatus } from './cohort';
import type { Student } from './auth';
export type OnboardingMode = 'activation' | 'access';
export declare const EnrollmentStatus: {
    readonly PENDING_ONBOARDING: "pending_onboarding";
    readonly ACTIVE: "active";
    readonly REMOVED: "removed";
};
export type EnrollmentStatus = (typeof EnrollmentStatus)[keyof typeof EnrollmentStatus];
/**
 * Valid status transitions for an enrollment.
 * Mirrors the server-side ALLOWED_TRANSITIONS in wizcamp-backend.
 */
export declare const ENROLLMENT_TRANSITIONS: Record<EnrollmentStatus, EnrollmentStatus[]>;
export type EnrollmentCounts = {
    active: number;
    pendingOnboarding: number;
    removed: number;
    total: number;
};
/**
 * Flat compound join type — enrollment row + cohort context + coalesced student identity.
 */
export type Enrollment = {
    enrollmentId: string;
    cohortSlug: string;
    status: EnrollmentStatus;
    externalOrderId: string | null;
    externalPaymentId: string | null;
    enrolledAt: string;
    onboardedAt: string | null;
    removedAt: string | null;
    updatedAt: string;
    campName: string;
    cohortName: string;
    unitLabel: UnitLabel;
    format: CohortFormat;
    description: string | null;
    startDate: string;
    endDate: string;
    image: MediaImage | null;
    video: MediaVideo | null;
    level: CampLevel | null;
    cohortStatus: CohortStatus;
    studentId: string | null;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl: string | null;
    parentEmail: string | null;
};
/** Minimal enrollment identity for student-facing surfaces. */
export type EnrollmentSummary = Pick<Enrollment, 'enrollmentId' | 'status' | 'enrolledAt' | 'cohortSlug'>;
/** POST /lms/admin/enrollments — enrollment + onboarding signal. */
export type EnrollmentCreateResponse = {
    enrollment: Enrollment;
    onboardingMode: OnboardingMode;
    tokenSent: boolean;
    emailError?: string;
};
/**
 * Student record with full enrollment history across all cohorts.
 * Admin-only.
 */
export type StudentEnrollments = Student & {
    enrollments: Enrollment[];
};
export type CreateEnrollmentInput = {
    cohortSlug: string;
    studentEmail: string;
    studentFirstName: string;
    studentLastName: string;
    parentEmail?: string;
};
//# sourceMappingURL=enrollment.d.ts.map