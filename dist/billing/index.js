"use strict";
// packages/api-contract/src/billing/index.ts
//
// Wizcamp billing domain types — Anti-Corruption Layer for Square.
// All types express Wizcamp business concepts; no Square terminology leaks through.
// The backend payment handler is responsible for mapping these types to Square's API.
//
// Conceptual model:
//   A Registrant (parent/guardian) registers an Enrollee (the student attending camp).
//   Payment is one aspect of that registration, not the primary concept.
Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=index.js.map