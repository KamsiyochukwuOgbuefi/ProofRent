---
doc: checklist
status: approved
---

# Build Checklist

Build mode: fast

## Slices

- [ ] **1. Complete the end-to-end proof of concept**
  Becomes usable: A landlord can open the one seeded apartment and disputed case, see the agent's original claim beside the inspection and missing evidence, request evidence, switch to the agent view to submit the sample record, review it, and explicitly confirm occupancy or request more information. Every action appears in the timeline and the correct decision and history survive refresh. Missing saved data initializes the seed, invalid saved data offers recovery without silently overwriting it, and failed storage writes do not show success.
  Why now: This puts the distinctive claim → evidence → landlord decision workflow in the first usable slice, so the main product story and visual hierarchy can get learner feedback before hardening less common states.
  PRD ref: `prd.md > The Core Journey`, `Screens and Layout`, `Look and Feel`, `Features and Behavior > Dashboard and apartment overview`, `Claim and evidence comparison`, `Request for evidence and agent response`, `Landlord resolution and final decision`, `Activity history and attribution`, `States and Boundaries`
  Spec ref: `spec.md > The Core Journey Through the System`, `Stack`, `Where It Runs and How Someone Tries It`, `Look and Feel`, `Components > App Shell and View Switching`, `Hash Router`, `Dashboard View`, `Apartment and Case Detail View`, `Evidence Review View`, `Agent Evidence Submission View`, `Activity Timeline`, `Versioned State Store`, `Domain Rules and Case Status`, `Seed Case Data`, `Data Model`, `Business Rules`, `File Structure`
  Build: First verify the actual existing filenames and npm scripts. Reuse the existing Vite/Tailwind setup and app shell, router, store, seed, timeline, dashboard, and test runner where practical. Implement the one-case dashboard and hash navigation; immutable claim and inquiry/inspection context; evidence request; agent-side sample submission; claim/evidence comparison; separate review and occupancy decision actions; append-only activity; current decision display with prior decisions retained; and the evidence-room visual direction. Include basic recovery in this slice: initialize missing saved data, preserve invalid saved data until confirmed reset, and keep the prior in-memory state if a storage write fails. Ensure request-more-information creates its decision, clarification request, and both activity events in one validated next state and one storage write.
  Verify (mechanical): Run `npm test` for the complete central journey's business rules, basic missing/invalid state recovery, failed storage write behavior, and immutable claims; run `npm run build`; start the app and verify the local route responds without a startup error.
  Learner check: Open the dashboard and follow the full case, request, agent submission, evidence review, and explicit occupancy decision; refresh and confirm the correct decision and full history remain. Try the `Request more information` branch after resetting. Review the comparison, uncertainty labels, timeline, and decision actions for immediate clarity and share any changes before hardening.
  Commit: `Build ProofRent evidence-review journey`

- [ ] **2. Harden the case and close the browser acceptance pass**
  Becomes usable: The complete demo recovers safely from missing, malformed, unsupported, or unavailable browser storage; prevents duplicate review/submission events; requires review of each new evidence set; and consistently shows later decisions as current while preserving previous decisions.
  Why now: Once the complete story is visible and the learner has given early UI feedback, prioritize remaining risks that could corrupt case history or falsely imply verification. Then verify the final demo end to end; defer cosmetic edge cases if time is tight.
  PRD ref: `prd.md > Features and Behavior > Claim and evidence comparison`, `Request for evidence and agent response`, `Landlord resolution and final decision`, `Activity history and attribution`, `States and Boundaries`, `What We're Building`, `Non-Goals`
  Spec ref: `spec.md > Components > Versioned State Store`, `Domain Rules and Case Status`, `Data Model`, `Business Rules`, `State, Persistence, and Recovery`, `Focused Verification`, `Important Failure Modes`, `Decisions and Open Issues`
  Build: Add or complete deeper validation for unsupported schema versions and invalid relationships, confirmed reset-to-seed, one review per unchanged evidence-ID set, fresh review after a distinct evidence set, idempotent repeated sample submission, and explicit decision supersession while preserving prior decisions. Refine responsive layout, visible status/provenance, and useful error copy based on slice-one feedback. Prioritize issues that could corrupt the case or misrepresent its status; defer cosmetic edge cases if time is running out. Reuse existing scripts and config; do not add dependencies or restore old property-management features.
  Verify (mechanical): Run `npm test` for all specified transitions, duplicate prevention, recovery, and failed-write behavior; run `npm run build`; run the app locally and verify both decision branches, refresh persistence, confirmed reset, and error/recovery displays.
  Learner check: Start the app and try the full landlord-to-agent-to-landlord story, including a refresh. Reset and try the request-more-information path. Try the visible recovery/reset case if practical, then report anything confusing, broken, or worth one final refinement.
  Commit: `Harden ProofRent demo recovery and review rules`

## Hands-on Checkpoints

- [ ] Early usable behavior and UI explored — after slice 1; learner feedback informs within-scope refinements in slice 2.
- [ ] Final kick-the-tires exploration and feedback completed — after slice 2; learner tries both decision paths and reports issues before readiness is confirmed.

## Final Review

- [ ] Final review complete — feedback resolved and learner confirms the proof of concept is ready to ship.

## Code Tour and App Map

- [ ] Learning activity complete — guided route, focused alternative, prior practice connected, or brief recap.
- [ ] Optional edit and transfer reflection addressed — offered, declined, already covered, or not applicable as appropriate.
- [ ] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse.

Activity and evidence: [record actual activity and code/test references after the wrap-up]
Route and stops: [record actual code paths and symbols after the tour]
Edit outcome: [record tried, kept, reverted, declined, or not applicable, with verification if changed]
Reflection: [record offered, answered, declined, or already covered; personal answer belongs only in ignored learner profile]
Activity mode: [record live app/editor, focused alternative, prior practice, or recap]

## Revisions

- Added an agent response flow for clarification requests to slice two after the learner's slice-one feedback — a clarification request now has an exact question and response status; the agent can answer it in the existing local demo view, and the answer is appended to case history without changing the claim or decision.
