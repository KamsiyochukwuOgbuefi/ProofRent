---
doc: prd
status: approved
---

# ProofRent — Product Requirements
A landlord-facing evidence workspace that shows what an agent reported, what supporting records exist, and how the landlord decides whether an apartment status is confirmed or still needs follow-up.
Source: `scope.md > The Unique Kernel`, `Who It's For`, `The Core Loop`, and `The POC Boundary`.

## The Core Journey

1. The landlord opens the dashboard and sees the apartments in their portfolio, plus a short summary of any cases that need review.
2. The landlord selects an apartment and sees its current status, the active inquiry, the inspection history, and the recent activity related to that apartment.
3. The landlord opens the inquiry timeline and sees the original inquiry, the inspection entry, and the agent's reported status change to `Occupied`.
4. The landlord compares the claim with the supporting record list and notices that no tenancy confirmation or evidence record is attached yet. The app marks this situation as `Reported — awaiting confirmation`, not as a confirmed fact.
5. The landlord clicks `Request evidence` and records the follow-up action in the timeline. The agent replies through a simple agent-side evidence submission screen or panel.
6. The agent adds a sample tenancy confirmation or supporting record with metadata and notes. The landlord opens the evidence details, reviews the record, and chooses to `Confirm review` or `Request more information`.
7. The app records the original claim, the request, the submitted evidence, the landlord’s decision, and the updated status. The final state is clear: the claim is supported by evidence or still incomplete, without the app inventing the real-world fact.

## Screens and Layout

- **Dashboard:** A single top-level view showing apartment cards, the portfolio summary, and a `Needs review` list for apartments whose agent report is missing evidence or still needs confirmation.
- **Apartment detail:** Shows the apartment status, the active inquiry, the inquiry timeline, the inspection history, and a compact evidence summary. It keeps the landlord focused on one apartment and one issue at a time.
- **Inquiry detail:** Shows the inquiry's timeline, the agent's reported claim, the supporting evidence records, and the decision actions available to the landlord.
- **Evidence panel / details screen:** Shows a sample record with metadata such as document type, submission date, apartment, reference or case number, and a short note. The landlord can read it without needing a real document upload.
- **Agent submission flow:** A lightweight panel or view where an agent can attach or submit the sample evidence after the landlord requests it.

## Look and Feel

A premium but restrained “evidence room” rather than a generic property dashboard. Use charcoal or deep navy as the base, warm off-white surfaces, and one sharp accent color such as amber or lime for emphasis. Keep the experience calm, readable, and investigative: the report, evidence, and missing record should be easy to compare at a glance. Avoid decorative charts, dashboard clutter, and generic AI app styling. The hierarchy should answer three questions immediately: what was reported, what is supported, and what still needs confirmation.

## Features and Behavior

### Dashboard and apartment overview

- Landlords can see each apartment card with its name, status, the latest recorded activity, and whether one of its reports needs evidence confirmation.
- The dashboard highlights `Needs review` apartments before showing standard portfolio detail.
- The case summary indicates whether an apartment claim is `Reported`, `Awaiting evidence`, `Evidence submitted`, or `Confirmed by landlord review`.
- Selecting an apartment opens the apartment record and the relevant inquiry timeline.

- As a landlord, I want to see which apartments need attention so that I can focus on unresolved status changes first.
  - [ ] Acceptance criterion — the dashboard lists apartments with reported occupancy changes that are missing supporting evidence.
  - [ ] Acceptance criterion — the apartment card or summary clearly distinguishes a reported claim from a confirmed status.

### Claim and evidence comparison

- Each inquiry has a timeline of activity entries: inquiry received, inspection scheduled or completed, agent-reported status change, evidence request, evidence submission, and landlord decision.
- The app presents the agent report alongside supporting evidence records and clearly labels what is missing.
- If no confirmation record exists, the case reads as `Reported — awaiting confirmation` rather than as a confirmed occupancy status.
- Evidence entries include at least a label, associated apartment, reference or record number, submission date, and short explanation.
- The landlord can open the evidence details and review the supporting record without leaving the inquiry view.

- As a landlord, I want to compare what the agent reported with what evidence exists so that I can decide whether the record is still uncertain.
  - [ ] Acceptance criterion — the inquiry timeline shows the original claim and any evidence records in the same view.
  - [ ] Acceptance criterion — when supporting evidence is absent, the app visibly marks the claim as awaiting confirmation instead of confirming it.

### Request for evidence and agent response

- The landlord can click `Request evidence` from the claim details view.
- This creates a follow-up event in the timeline and marks the claim as `Awaiting evidence`.
- The agent can open a simple evidence-submission view to add a sample record with metadata.
- The evidence submission is shown as a separate event in the timeline and is clearly tied to the apartment and inquiry.

- As a landlord, I want to request proof and keep the record of that request so that the agent's follow-up is visible and attributable.
  - [ ] Acceptance criterion — a request for evidence is logged in the activity history with the actor and timestamp.
  - [ ] Acceptance criterion — the agent can submit a sample evidence record in a lightweight submission flow.

### Landlord resolution and final decision

- After reviewing evidence, the landlord can choose to `Confirm review` or `Request more information`.
- Confirming review updates the claim state to `Evidence reviewed` without automatically converting the apartment status into a real-world fact outside the app.
- If the landlord asks for more information, the timeline is updated and the claim remains unresolved.
- The final decision is recorded with the actor, timestamp, and short note.

- As a landlord, I want to decide what has been sufficiently supported so that I can act without the app assuming the fact for me.
  - [ ] Acceptance criterion — the review action is explicit and recorded in the history.
  - [ ] Acceptance criterion — the app stores the original claim, the request for evidence, the evidence, and the landlord decision as separate timeline events.

### Activity history and attribution

- Every important action is kept in a newest-first activity timeline with actor, time, and a brief description.
- Timeline events include the claim report, inspection details, evidence request, submitted evidence, and the landlord’s final decision.
- The history remains visible even after the landlord confirms the review.

- As a landlord, I want a complete record of what happened so that I can understand the timeline later without having to rely on memory or verbal summaries.
  - [ ] Acceptance criterion — the case history shows the original claim and each later action in order.
  - [ ] Acceptance criterion — the app identifies the actor responsible for each event.

## States and Boundaries

- **No saved data yet** — the demo loads seeded sample apartments, inquiries, and records into the interface.
- **Reported claim** — the agent's status change is visible and linked to the inquiry and inspection record, but not treated as confirmed until review.
- **Awaiting evidence** — the app shows the missing record and invites the landlord to request it.
- **Evidence submitted** — the agent has added a sample supporting record and the landlord can review it.
- **Reviewed** — the landlord has either confirmed the evidence or asked for more information; the final decision is stored in the history.
- **Persistence** — the app remains in the same browser session and keeps the seeded record available after refresh, but does not imply production-grade security or sync.

## Product Decisions

- Keep the product focused on one apartment case with one inquiry and one disputed status: the demo proves the evidence workflow without becoming a full property-management platform.
- Treat the agent report and the evidence record as separate things: the app should explain missing evidence without assuming dishonesty.
- Make the landlord’s decision explicit: the interface should never silently confirm a claim or real-world fact.
- Use a simple sample evidence submission rather than real document uploads: the proof point is the evidence workflow, not storage or verification infrastructure.
- Keep the app clearly local and sample-data driven, so the product stays focused on the review process.

## What We're Building

A fast proof-of-concept demo in which a landlord can open a property, inspect the inquiry and inspection timeline, notice that an agent’s occupancy claim lacks supporting evidence, request evidence, review a sample record submitted by the agent, and then record a final decision. The app must preserve each action in the activity history and make the difference between a reported claim, supporting evidence, and a confirmed review clear.

## Deferred From the POC

- Full real-estate management, including rent collection, maintenance, and longer-term leasing operations.
- Real agent or landlord accounts and permissions.
- Real messaging or live external communications.
- Real document uploads, storage, or verification workflows.
- AI-driven judgments about whether someone is being dishonest.

## Possible Later Enhancements

Support real user roles, richer evidence metadata, real document management, automated follow-up reminders, and a more complete audit trail for multiple properties.

## Non-Goals

- Do not build a full property-management system.
- Do not present the app as a verified source of truth about a real tenancy.
- Do not silently turn a reported claim into a confirmed fact.
- Do not add generic KPI dashboards, charts, or unrelated admin features.

## Open Questions

- None blocking the PRD; the core scenario and proof-of-success are clear enough to proceed to technical specification.
