export declare const UserRole: {
    readonly STUDENT: "student";
    readonly ADMIN: "admin";
};
export type UserRole = (typeof UserRole)[keyof typeof UserRole];
export type OAuthProvider = 'google' | 'github';
export declare const StudentStatus: {
    readonly ACTIVE: "active";
    readonly SUSPENDED: "suspended";
};
export type StudentStatus = (typeof StudentStatus)[keyof typeof StudentStatus];
export declare const UserTheme: {
    readonly LIGHT: "light";
    readonly DARK: "dark";
    readonly SYSTEM: "system";
};
export type UserTheme = (typeof UserTheme)[keyof typeof UserTheme];
export declare const OpenRouterKeyLimitReset: {
    readonly NONE: "none";
    readonly DAILY: "daily";
    readonly WEEKLY: "weekly";
    readonly MONTHLY: "monthly";
};
export type OpenRouterKeyLimitReset = (typeof OpenRouterKeyLimitReset)[keyof typeof OpenRouterKeyLimitReset];
/** Fields any authenticated user can read via GET /lms/students/me/settings */
export type UserSettings = {
    openRouterKey?: string;
    theme?: UserTheme;
};
export type Student = {
    studentId: string;
    email: string;
    firstName: string;
    lastName: string;
    avatarUrl: string;
    avatarSourceUrl: string | null;
    oauthProvider: OAuthProvider;
    oauthProviderId: string;
    role: UserRole;
    status: StudentStatus;
    createdAt: string;
    updatedAt: string;
    lastLoginAt: string | null;
    settings?: UserSettings;
};
export type AuthUser = {
    studentId: string;
    email: string;
    firstName: string;
    lastName: string;
    avatarUrl: string;
    oauthProvider: OAuthProvider;
    role: UserRole;
    settings?: UserSettings;
    /** Present only during ephemeral student impersonation. */
    impersonation?: {
        adminStudentId: string;
        adminEmail: string;
        targetStudentId: string;
        targetEmail: string;
    };
};
export type MagicLinkValidation = {
    valid: true;
    returning: boolean;
    contactEmail: string;
    cohortSlug: string;
    campName: string;
    cohortName: string;
    enrollmentId: string;
};
/** Fields only the admin endpoint returns */
export type AdminOnlySettings = {
    aiModel?: string;
    aiSystemPrompt?: string;
    editorAutoSave?: 'live' | 'auto' | 'manual';
    editorValidateOnType?: boolean;
};
/** Full map — what GET /lms/admin/settings returns */
export type AdminSettings = UserSettings & AdminOnlySettings;
/**
 * Complete AI API key metadata — SDK-verified against OpenRouter GetKeyData.
 * Field names match the SDK's camelCase exactly (limit, not limitUsd).
 */
export type OpenRouterKeyMetadata = {
    hash: string;
    name: string;
    label: string;
    usage: number;
    usageDaily: number;
    usageWeekly: number;
    usageMonthly: number;
    limit: number | null;
    limitRemaining: number | null;
    limitReset: OpenRouterKeyLimitReset;
    expiresAt: string | null;
    createdAt: string;
    updatedAt: string;
    disabled: boolean;
};
/** PATCH /lms/admin/students/:studentId/settings/api-key */
export type OpenRouterKeyUpdateInput = {
    name?: string;
    limit?: number | null;
    limitReset?: OpenRouterKeyLimitReset;
    disabled?: boolean;
};
/** POST /lms/admin/students/:studentId/settings/api-key */
export type OpenRouterKeyProvisionInput = {
    name?: string;
    limit?: number | null;
    limitReset?: OpenRouterKeyLimitReset;
    expiresAt?: string | null;
};
/** POST /lms/admin/students/:studentId/settings/api-key — provision response. */
export type OpenRouterKeyProvisionResult = OpenRouterKeyMetadata & {
    apiKey: string;
};
/** AI model option — used by OpenRouter to describe an available model. */
export type OpenRouterModelOption = {
    id: string;
    name: string;
};
//# sourceMappingURL=auth.d.ts.map