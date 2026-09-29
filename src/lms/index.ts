// src/lms/index.ts — backward-compat shim
// All types have moved to flat files in src/. Import from the new locations:
//   @wizcamp/api-contract/cohort, /meeting, /enrollment, /curriculum, /auth
// This shim exists for consumer repos that haven't migrated their imports yet.
export * from '../cohort';
export * from '../meeting';
export * from '../enrollment';
export * from '../curriculum';
export * from '../auth';
