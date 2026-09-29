// src/auth.ts
// Authentication and user identity types.

export const UserRole = {
  STUDENT: 'student',
  ADMIN:   'admin',
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export type OAuthProvider = 'google' | 'github';

export const StudentStatus = {
  ACTIVE:    'active',
  SUSPENDED: 'suspended',
} as const;
export type StudentStatus = (typeof StudentStatus)[keyof typeof StudentStatus];

export const UserTheme = {
  LIGHT:  'light',
  DARK:   'dark',
  SYSTEM: 'system',
} as const;
export type UserTheme = (typeof UserTheme)[keyof typeof UserTheme];

export const OpenRouterKeyLimitReset = {
  NONE:    'none',
  DAILY:   'daily',
  WEEKLY:  'weekly',
  MONTHLY: 'monthly',
} as const;
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
