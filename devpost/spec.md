---
doc: spec
status: approved
---

# ProofRent — Technical Spec

Implements the approved ProofRent `prd.md`, with the one-case boundary in `scope.md`. This spec replaces the previously approved Property Activity Tracker spec.

## How This Works, In Plain Language

ProofRent is one browser app with four focused stops: a dashboard, one apartment case, an evidence review, and a simple agent submission view. Vite serves the app locally while it is being built. Plain JavaScript reads the part of the web address after `#` to select a view, and the browser's `localStorage` keeps the sample case and later actions on this device.

The case starts with an agent's original occupancy report, an inquiry, and an inspection in its history. The report itself is kept unchanged. When the landlord requests evidence, the agent can switch to the sample agent view and submit the prepared sample record. ProofRent saves that record separately, shows what it contains and what is missing or inconsistent, and adds an activity entry for each action.

Reviewing evidence and deciding about occupancy are different actions. `Confirm review` records only that the landlord examined the available record. The landlord must separately choose `Confirm occupancy` to record that judgment, or `Request more information` to leave the claim unresolved and ask for follow-up. ProofRent never verifies the underlying real-world facts.

The app saves one versioned record in this browser. It has no accounts, server, live messaging, real file upload, or AI service. This makes the demo small and runnable locally; it is not a secure or independently verified audit system.

## The Core Journey Through the System

PRD ref: `prd.md > The Core Journey`.

1. The app reads and checks its saved record. If none exists, it creates the clearly labeled one-apartment sample case and opens the dashboard.
2. The landlord selects the apartment or its `Needs review` summary. The router changes the URL hash and shows the apartment's disputed case.
3. The case view displays the inquiry, inspection, immutable agent claim, evidence state, and attributed activity timeline. With no evidence submitted, it says `Reported — awaiting confirmation`; it does not present occupancy as confirmed.
4. The landlord requests evidence. A domain operation creates a request and timeline event; the store saves the new record before the interface shows success.
5. The landlord opens the agent view. The agent submits the prepared sample tenancy-confirmation record, which is saved as a separate evidence record and activity event.
6. The landlord returns to the case and opens the evidence details. ProofRent displays its sample label, source, metadata, missing information, and any explicit inconsistency found by the defined data rules.
7. The landlord chooses `Confirm review`, then separately chooses `Confirm occupancy` or `Request more information`. Each action is saved as its own event. The final status says `Confirmed by landlord` or `More information requested`, never `Verified`.
8. The landlord can return to the dashboard or use browser Back. Refreshing the same local address reloads the saved case, current view, and full history.

## Stack

- **Vite** — already in the project; serves the app locally and creates the production build. [Vite guide](https://vite.dev/guide/).
- **HTML, CSS, and plain JavaScript modules** — already used by the project; no UI framework is needed for this single-case demo.
- **Tailwind CSS 4 with the Vite plugin** — already listed in `package.json` and configured for local use. Use it for layout and utility styling; keep a small set of theme tokens and any necessary component styles in `src/style.css`. [Tailwind CSS with Vite](https://tailwindcss.com/docs/installation/using-vite).
- **Browser `localStorage`** — one versioned JSON record for this app on this browser origin. It is local demo persistence, not authentication or secure evidence storage. [MDN: `localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).
- **Node.js built-in test runner** — already used by the project for business-rule tests; no additional test framework is needed. [Node.js test runner](https://nodejs.org/api/test.html).

The repository currently has Vite, Tailwind CSS, and the test runner declared in its package setup. The observed environment has Node.js 26.5.0 and npm 10.9.1. No additional runtime dependency, API key, database, or external service is required.

## Where It Runs and How Someone Tries It

- **Runtime:** local Vite development server in a desktop browser. Node.js and npm are required; no environment variables or secrets are needed.
- **Start:** from the repository root, run `npm install`, then `npm run dev`.
- **Open:** visit the local URL Vite prints, normally `http://localhost:5173/`. Keep the same scheme, host, and port while demonstrating; browser storage is scoped to that origin.
- **Check:** run `npm test` for business-rule tests and `npm run build` for the production build.
- **Record:** record the short demo video from the local app. Deployment is optional and does not replace the required video or public GitHub repository.

## Look and Feel

Implements `prd.md > Look and Feel` and `scope.md > Inspiration & Identity`. Create a desktop-first, responsive “evidence room”: deep charcoal or navy framing, warm off-white reading surfaces, and amber for attention or uncertainty. Use lime only as a limited accent if needed. On the evidence review view, place the agent's claim beside the submitted record on wider screens; reflow them into a clear vertical comparison on narrow screens. Missing information and any explicit mismatch must remain visible and readable without relying on color alone. Give the activity timeline clear actor and timestamp labels. Keep the dashboard focused on the single apartment and case; avoid generic KPI cards, charts, decorative AI summaries, and unnecessary screens. The current Tailwind setup can implement this direction without a remote styling service.

## Components

### App Shell and View Switching

`src/app.js` provides the shared page frame, sample-data disclosure, landlord/agent mode switch, view rendering, and action wiring. It renders the active view from route and store state; it does not own business rules or write directly to browser storage.

Implements `prd.md > Screens and Layout` and `Features and Behavior > Dashboard and apartment overview`.

### Hash Router

`src/router.js` parses and updates these small set of routes:

- `#/dashboard`
- `#/cases/{caseId}`
- `#/cases/{caseId}/evidence/{evidenceId}`
- `#/agent/cases/{caseId}`

It listens for hash changes and supports browser Back. It validates known IDs and their relationships. An unknown path or missing record shows an in-app not-found/recovery message with a link to the dashboard or case; it must not silently show a different case.

Implements `prd.md > The Core Journey` and `Screens and Layout`.

### Dashboard View

`src/views/dashboard.js` renders the single sample apartment, its reported occupancy status, and a prominent `Needs review` summary with a direct link to the disputed case. Use `Reported — awaiting confirmation` until the landlord explicitly records a decision. The card is not a claim of independently verified occupancy.

Implements `prd.md > Screens and Layout > Dashboard` and `Features and Behavior > Dashboard and apartment overview`.

### Apartment and Case Detail View

`src/views/case-detail.js` shows the apartment and inquiry identifiers, the agent's original claim and report time, inspection details, current case state, evidence summary, and a link to the evidence review and activity history. Present the agent's report separately from the current landlord decision.

Implements `prd.md > Screens and Layout > Apartment detail` and `Inquiry detail`, and `Features and Behavior > Claim and evidence comparison`.

### Evidence Review View

`src/views/evidence-review.js` displays the agent's claim beside the selected sample record's type, submission time, associated apartment and claim, reference number, and supplied details. Clearly label the record as agent-submitted sample data; do not portray it as an uploaded or authenticated document. Show deterministic missing-field and explicit status-mismatch notices, if applicable, as observations about the stored record—not conclusions about what happened in reality. Provide a return link to the case and a distinct `Confirm review` action.

Implements `prd.md > Features and Behavior > Claim and evidence comparison` and `Landlord resolution and final decision`.

### Agent Evidence Submission View

`src/views/agent-submit.js` provides a lightweight agent-side view reached after a landlord evidence or clarification request. It shows the requested apartment and claim, all outstanding clarification questions with their exact text, request time, and response status, and offers a form to answer each question. It also offers one action to submit the prepared sample tenancy-confirmation record. A submitted answer is linked to its request and case, attributed to the sample agent, and shown in the landlord's case history. The demo role switch is only a view change; it is not login, identity verification, or real agent access control. The sample evidence is associated with the active case and added to activity as submitted by the sample agent.

Implements `prd.md > Screens and Layout > Agent submission flow` and `Features and Behavior > Request for evidence and agent response`.

### Activity Timeline

`src/components/activity-timeline.js` renders the case's events newest first, with event text, sample actor label, and timestamp. It must retain and display the original claim event along with later request, submission, review, clarification, and decision events. New actions append events; they do not rewrite prior entries.

Implements `prd.md > Features and Behavior > Activity history and attribution`.

### Versioned State Store

`src/store.js` loads, validates, saves, and resets the single app record in `localStorage`. For each action, build and validate the complete next state in memory, serialize it, then save it with one `localStorage.setItem()` call for the single app key. Only after that call succeeds may the store replace its in-memory state and notify the app to render success. If writing fails, keep the prior in-memory state and show the error; do not show a partial success. This is a single-key write, not a multi-key storage transaction.

Implements `prd.md > States and Boundaries` and `Features and Behavior > Activity history and attribution`.

### Domain Rules and Case Status

`src/data/rules.js` contains storage-independent operations for requesting evidence, submitting the sample record, recording evidence review, requesting more information, and confirming occupancy. It appends activity and decision records, validates links and allowed transitions, and derives display status from the claim, evidence, requests, reviews, and decisions. It does not establish real-world truth.

Implements `prd.md > Features and Behavior > Claim and evidence comparison`, `Request for evidence and agent response`, and `Landlord resolution and final decision`.

### Seed Case Data

`src/data/samples.js` provides one clearly labeled apartment, one inquiry, one completed inspection, one immutable agent-reported occupancy claim, no initial supporting record, and the initial claim activity event. The pre-prepared sample evidence is submitted only through the agent action; it is not present as landlord-confirmed evidence at first use.

Implements `prd.md > The Core Journey`, `States and Boundaries`, and `What We're Building`.

### Business-Rule Tests

`tests/rules.test.js` uses Node's built-in runner to check pure domain operations and case-status derivation. Browser acceptance checks are performed manually; no browser-automation dependency is present or required for this proof of concept.

Implements `prd.md > Features and Behavior` and `States and Boundaries`.

## Data Model

Persist one JSON object under the namespaced key `proofrent:app-state`. Include `schemaVersion: 1`. Use stable string IDs and ISO timestamps. Store the original report, later evidence, requests, reviews, decisions, and activity separately so one action cannot overwrite another.

```text
AppState
  schemaVersion: 1
  apartment: Apartment
  case: RentalCase
  evidence: EvidenceRecord[]
  requests: FollowUpRequest[]
  responses: AgentResponse[]
  reviews: EvidenceReview[]
  decisions: LandlordDecision[]
  activity: ActivityEvent[]

Apartment
  id, label, address

RentalCase
  id, apartmentId, inquiry: Inquiry, inspection: Inspection, claim: OccupancyClaim

Inquiry
  id, receivedAt, applicantLabel

Inspection
  id, completedAt, outcome, recordedBy

OccupancyClaim
  id, caseId, apartmentId
  reportedStatus: "occupied"
  reportedAt, reportedBy, reason
  (Created in seed data; no edit operation exists.)

EvidenceRecord
  id, caseId, apartmentId, type, submittedAt, submittedBy
  referenceNumber, details, reportedOccupancy, isSample: true

FollowUpRequest
  id, caseId, type: "evidence" | "clarification"
  message, requestedAt, requestedBy
  responseStatus: "awaiting-response" | "response-received"

AgentResponse
  id, caseId, requestId, responseText, respondedAt, respondedBy

EvidenceReview
  id, caseId, evidenceIds[], reviewedAt, reviewedBy

LandlordDecision
  id, caseId
  type: "confirm-occupancy" | "request-more-information"
  clarificationRequestId: string | null
  decidedAt, decidedBy, rationale

ActivityEvent
  id, caseId, apartmentId, type, recordedAt, actorRole, actorLabel
  summary, relatedRecordId
```

The inquiry, inspection, claim, and all related records must point to the same single case and apartment. The seeded claim is immutable through app actions. Evidence is a separate agent-submitted record; its presence, completeness, and stated occupancy can be shown or compared with the claim, but do not independently verify it. Each clarification request tracks whether an agent response is outstanding or has been received. An `AgentResponse` references exactly one clarification request in the same case. A review entry records that the landlord examined the complete current set of evidence IDs and is not a decision. Compare evidence sets by their sorted, unique record IDs. Only one review is accepted for an unchanged set; adding a distinct record creates a new set that must be reviewed again before an occupancy-confirmation decision. Repeating the review action for the same set must not create a duplicate review.

Every meaningful action appends an `ActivityEvent` with its actor label and timestamp. Decision history is append-only. A later explicit decision may supersede an earlier one; the last decision in append order is the current decision shown in the case summary, while all earlier decisions remain in the timeline. The recorded timestamp is for display and is not used to break ties. Sort activity newest first only for display; retain event timestamps and entries in stored order.

## Business Rules

- **Claim versus fact:** the initial agent report is displayed as a report. No evidence or UI action changes the original claim record.
- **Evidence versus verification:** missing evidence is uncertainty, not proof of wrongdoing. A submitted sample record is not independently authenticated.
- **Evidence completeness:** check only the required record fields and explicit reported occupancy value. If a required field is absent, show exactly what is missing. If a record's explicit occupancy value conflicts with the agent claim, label it as a record mismatch for the landlord to assess; do not infer which value is true.
- **Request evidence:** only the landlord can create the initial request in this demo. The request and its activity event are included in one validated next state and one storage write before success is shown. Agent submission is available after a request.
- **Submit evidence:** the sample agent action adds a new evidence record and activity event; it never edits the claim. The record must reference the current case and apartment. Reject a duplicate for the same case and reference number; a repeated click shows the already-submitted record and must not append another record or event. The initial scenario uses one prepared sample record, not a general upload/editor.
- **Confirm review:** available after evidence exists and applies to the complete current evidence-ID set. It appends a review entry and event only. Repeating the action for an already reviewed set is prevented. If a distinct evidence record is later added, the new set requires a fresh review. Review alone leaves the case unconfirmed.
- **Confirm occupancy:** available only after the current evidence set has been reviewed. It is a separate explicit landlord action and appends a `confirm-occupancy` decision with timestamp, actor, and optional rationale. The visible state becomes `Confirmed by landlord`; this is not external verification.
- **Request more information:** one domain operation creates the `request-more-information` decision, linked clarification request, and two activity events (`clarification-requested` and `decision-recorded`) in the same validated next state. The store commits that whole state with one `localStorage.setItem()` call; on failure, none of it is shown as successful. It leaves the case unresolved and does not clear earlier records.
- **Agent clarification response:** the agent view lists every clarification request with its exact message, request time, and response status. A single domain operation accepts a non-empty response, appends a response record linked to the request/case and an attributed timeline event, and changes that request to `response-received` in the same next state. Empty or repeated submissions are rejected without writing or adding a duplicate response. The landlord can read the response in the case history and must still make a separate explicit decision; a response never confirms occupancy.
- **Decision changes:** after a decision, the landlord may make a new explicit decision if the workflow permits it (for example, after a new evidence set is reviewed). Append the new decision and its event; show it as the current decision and retain prior decisions in the timeline. Never silently change a decision because evidence was submitted or reviewed.
- **History:** requests, submissions, reviews, and decisions are additive and attributed. No action may erase or rewrite the original claim or prior activity.
- **Status derivation:** keep the evidence-review state separate from the current landlord-decision label. Before evidence, show `Reported — awaiting confirmation`; after request but before submission, show `Awaiting agent response`; after submission, show `Evidence submitted — awaiting review`; after review, show `Evidence reviewed — occupancy unconfirmed`. The current decision label is the last appended decision: `More information requested` or `Confirmed by landlord`. A new evidence set returns the review state to `Evidence submitted — awaiting review` while preserving the last decision label until the landlord explicitly records another decision. The exact evidence view may also show missing or conflicting field details.
- **Clarification status:** a clarification request starts as `Awaiting agent response`; a successful linked response changes it to `Response received`. This is a communication status only and does not change the landlord-decision label or evidence-review state.

## State, Persistence, and Recovery

- **Missing saved value:** initialize the exact seed case and write it to storage. Show a `Sample data` label.
- **Valid version 1 value:** validate required fields and relationships before rendering. Continue from the saved state.
- **Malformed JSON, invalid relationships, or unsupported schema version:** show a clear recovery view explaining that saved demo data could not be read. Do not silently replace it. Offer a confirmed `Reset to sample case` action; preserve the unreadable value until the user confirms the reset.
- **Reset:** after confirmation, replace the state with the original sample case and initial claim event. No other cases or previous demo actions are retained.
- **Storage unavailable or write failure:** show an explicit error and do not report the action as saved. Keep the prior in-memory state; do not advance it as if persistence succeeded. Provide a retry or reset/reload path where possible.
- **Refresh and navigation:** after a successful write, refreshing at the same origin reloads the same case and activity. Hash routes determine which case view is open.
- **Sample attribution:** `Landlord` and `Agent` are demo labels chosen by the current view, not authenticated identities. Do not describe this local history as tamper-proof.

## Focused Verification

Automated tests in `tests/rules.test.js` should cover:

- seed contains exactly one apartment, one inquiry, one inspection, and one immutable occupancy claim;
- requesting evidence appends a request and activity event without changing the claim;
- agent evidence submission is blocked until the request exists and appends a separate record and event;
- repeated submission of the same sample reference does not create a duplicate record or event;
- agent view lists the clarification question, requested time, and response status;
- an empty clarification response is rejected; a non-empty response appends one linked record/event and marks the request `response-received`;
- a repeated clarification response submission cannot create a duplicate, and the response does not confirm occupancy;
- evidence completeness and an explicit occupancy mismatch produce the right explanatory labels without asserting truth;
- `Confirm review` appends one review for the current evidence-ID set but does not create a landlord decision or mark occupancy confirmed; a repeat review of the unchanged set is prevented;
- adding a distinct evidence record makes the new evidence set require a fresh review before confirmation;
- `Confirm occupancy` requires an explicit landlord action and records actor, timestamp, rationale, and activity;
- `Request more information` creates its decision, clarification request, and activity events as one next state; a failed storage write leaves the prior in-memory state visible and unchanged;
- a new explicit decision supersedes the current decision label while prior decisions remain in the timeline;
- activity history keeps the original event and all later events;
- absent, malformed, unsupported, and storage-write-failure paths produce the specified initialization or recovery behavior.

Manual browser acceptance checks should cover:

1. Start on the dashboard and find the single apartment and `Needs review` case.
2. Open the case and verify the inquiry, inspection, original claim, missing-evidence message, and original activity event.
3. Request evidence; verify the status and timeline update.
4. Switch to the agent view and submit the sample record; verify its label, apartment, case, type, date, reference, and details.
5. Return to the landlord view, open the record, and verify the review state. Confirm review alone must leave occupancy unconfirmed.
6. Record `Confirm occupancy` and verify the result reads `Confirmed by landlord`, or choose `Request more information` and verify it remains unresolved.
7. Refresh and verify the saved state, original claim, and every activity entry remain visible.
8. Reset and verify the exact original sample case returns. Check unknown routes, malformed storage recovery, and visible errors rather than silent success.

## File Structure

```text
project/
├── index.html                     # Browser entry point
├── package.json                   # Existing Vite, Tailwind, dev/build/test scripts
├── vite.config.js                 # Existing Vite and Tailwind CSS plugin configuration
├── src/
│   ├── main.js                    # Existing startup; load store and start the app
│   ├── app.js                     # Existing shell; adapt rendering and action wiring
│   ├── router.js                  # Existing router; adapt to the ProofRent hash routes
│   ├── store.js                   # Existing store; add versioned state and single-key commits
│   ├── utils.js                   # Existing shared helpers; reuse only where appropriate
│   ├── data/
│   │   ├── samples.js             # Replace old seed with one sample apartment/case
│   │   └── rules.js               # Add pure business rules and derived case status
│   ├── components/
│   │   ├── shell.js               # Existing shell; adapt to landlord/agent view switch
│   │   ├── timeline.js            # Existing timeline; adapt to case activity
│   │   └── evidence-record.js     # Add evidence metadata and provenance display
│   ├── views/
│   │   ├── dashboard.js           # Existing view; adapt to one apartment and Needs review
│   │   ├── case-detail.js         # Adapt existing apartment/inquiry detail as needed
│   │   ├── evidence-review.js     # Add evidence details, review, and decision actions
│   │   ├── agent-submit.js        # Add sample agent evidence submission
│   │   └── not-found.js           # Existing route fallback; adapt recovery links
│   └── style.css                  # Existing Tailwind setup and ProofRent theme styles
├── tests/
│   └── rules.test.js              # Node built-in tests for business rules
└── devpost/                       # Learning plan and submission documents
```

The repository was inspected before drafting: it already contains `main.js`, `app.js`, `router.js`, `store.js`, `utils.js`, the shell/timeline components, sample data, dashboard/apartment/inquiry/not-found views, and `tests/rules.test.js`. Its existing npm scripts are `dev`, `build`, and `test`, and `vite.config.js` already loads the Tailwind Vite plugin. `5-build` should verify those filenames and scripts at the start, adapt the working entry point, store, router, test runner, and Vite/Tailwind setup, and add only the missing ProofRent-specific modules. The tree is a guide, not a reason to rebuild working infrastructure or create a parallel app.

## External Services and Dependencies

- **Vite and Tailwind CSS:** existing npm development dependencies. No hosted runtime assets are required. See [Vite documentation](https://vite.dev/guide/) and [Tailwind CSS with Vite](https://tailwindcss.com/docs/installation/using-vite).
- **Browser storage:** `localStorage` only, with no account or key. See [MDN `localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).
- **Tests:** Node.js built-in runner; see [Node.js test runner](https://nodejs.org/api/test.html).
- **AI, messaging, database, uploads, hosting:** none. The approved PRD does not include AI, and the scope excludes real messaging, uploads, and verification services. Do not add an external AI service for this build.

## Important Failure Modes

- **No stored case** → seed the one labeled sample case.
- **Unreadable or incompatible stored case** → explain the problem and require confirmation before resetting; never silently overwrite.
- **Storage read/write unavailable** → show a clear error and do not claim an action was saved.
- **Invalid/mismatched route ID** → show a not-found state and a route back to the dashboard.
- **Evidence missing or incomplete** → show the specific missing record or field as unresolved, not as evidence of dishonesty.
- **Evidence explicitly conflicts with the claim** → show the conflicting values side by side for the landlord; do not decide which is correct.
- **Sample evidence** → label it as sample and agent-submitted; do not imply a real file was uploaded or verified.

## What Was Simplified and Why

- **One apartment, inquiry, and occupancy case** instead of a property-management system — this is the complete scenario approved in `scope.md > The POC Boundary`.
- **One local browser record** instead of accounts, a server, and cloud synchronization — enough to demonstrate one landlord/agent flow without setup or deployment dependencies.
- **A sample evidence record with a details view** instead of real file uploads — the PRD tests visibility and review, not document storage or authentication.
- **A view switch for the agent** instead of real accounts and permissions — it demonstrates both sides without pretending to authenticate either person.
- **Deterministic field and status comparisons** instead of AI summaries or judgments — the PRD and scope do not approve an AI feature or external AI service.
- **Manual browser acceptance checks** instead of a browser automation framework — the repo already has Node's built-in test runner, and the focused workflow can be verified in the local browser without adding tooling.

## Decisions and Open Issues

- **Learner-provided technical direction:** use the existing Vite, plain HTML/CSS/JavaScript, and local Tailwind setup; hash navigation; one case in versioned `localStorage`; sample evidence; and focused business-rule and browser checks. Tradeoff: local data and role switching demonstrate the workflow but provide no real authentication, collaboration, or durable audit guarantee.
- **Learner decision:** `Confirm review` and `Confirm occupancy` are separate. Review records examination of the current evidence set only; confirmation records the landlord's judgment with timestamp and optional rationale. One review is accepted per unchanged evidence set; a new set needs a new review.
- **Learner decision:** `Request more information` records a clarification request and keeps the case unresolved when evidence is insufficient or conflicting. The request, decision, and both activity events are committed together as one complete app-state write.
- **Learner decision:** a later explicit decision can supersede the currently displayed decision, while all earlier decisions remain visible in the timeline.
- **Implementation detail derived from the single-record design:** build and validate the whole next state, make one `localStorage.setItem()` call, then replace in-memory state only after success. Browser storage does not provide a multi-key transaction.
- **AI boundary:** AI is not in the approved PRD or scope and is not part of this spec. No uncertainty around an AI dependency needs resolving for this PoC.
- **Technical uncertainty:** no separate technical uncertainty was raised in the planning conversation. The versioned storage recovery and business rules will be verified with focused tests during `5-build`.
- **PRD wording clarification:** `scope.md > What "Working" Looks Like` and the learner's decision specify a separate, explicit `Confirm occupancy` action. `prd.md > Features and Behavior > Landlord resolution and final decision` describes `Confirm review` and `Request more information` but is less explicit about that separate action. This spec records the resolved distinction; per the learner's instruction, the PRD remains unchanged. `5-build` should follow the spec's clarified separate actions.
- **Learner feedback after slice-one review:** include a simple agent response for clarification requests, including the exact request, request time, response status, linked response record, attribution, timestamp, and activity event. Keep it within the existing agent view and local case state; it adds no messaging, identity, AI, or external service.
- **No external dependency blocker identified:** the required packages and local runtime are already present. Deployment remains optional.
