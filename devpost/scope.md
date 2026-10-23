---
doc: scope
status: approved
---

# ProofRent
A rental-activity evidence workspace that helps remote landlords see what an agent reported, what records support it, and what remains unconfirmed.

## The Unique Kernel
ProofRent separates an agent's claim from the evidence on record and the landlord's own decision. A missing or incomplete record is shown as uncertainty—not proof of dishonesty—and reviewing evidence never silently confirms a real-world fact.

## Who It's For
A landlord who relies on agents to manage apartment inquiries and inspections, and can be left unsure what happened when an agent reports an apartment occupied. They need to follow the recorded events and supporting information without relying entirely on a verbal update.

## The Core Loop
The landlord opens an apartment's activity, follows an inquiry from first contact through inspection to an agent's status report, and checks what evidence is present or missing. If confirmation is missing, the landlord requests evidence; the agent submits a sample record; then the landlord reviews it and explicitly confirms the occupancy status or asks for more information. Each action is added to the history.

## Inspiration & Identity
The proposed direction is an evidence room rather than a generic property dashboard: make the reported claim, supporting record, and remaining uncertainty easy to compare. A suggested palette is charcoal, warm white, and a sharp amber or lime accent. Visual references and the final look remain to be decided in PRD.

## Why This Matters to the Learner
The learner has experienced an agent saying an apartment was occupied after an inspection without making it clear what happened. They want landlords to have enough visibility to understand the recorded story and make an informed decision.

## What "Working" Looks Like
In a short demo, a landlord opens one apartment marked occupied, follows its inquiry and inspection history, and sees that an agent's occupancy report has no supporting tenancy confirmation yet. The landlord requests evidence; an agent switches to a simple agent view and submits a clearly labeled sample tenancy-confirmation record. The landlord opens and reviews it, then explicitly confirms occupancy or requests more information. The timeline preserves the original report and shows who took each later action. The app does not claim to independently verify the sample or make the landlord's decision.

## The POC Boundary
One apartment, one inquiry, one agent-reported occupancy change, a visible activity timeline, and deterministic checks for whether a supporting record has been submitted. Include a landlord request for evidence, a simple agent-side submission of a pre-prepared sample record, an evidence-details view, and landlord actions to mark it reviewed and either confirm occupancy or request more information. Keep the request, submission, review, and decision in an attributable activity history. Use sample data; no real file upload is needed.

## Later
Validate the workflow with landlords and agents; consider real accounts, permissions, persistence, notifications, and real document uploads only if the proof of concept demonstrates a need.

## Explicitly Cut
- Full property management, including rent collection, payments, maintenance, and leasing automation: these are not needed to demonstrate claim-to-evidence review.
- Live messaging or external communication integrations: the demo only needs its simple agent-side evidence submission.
- AI chatbot or AI judgment: the record checks are ordinary application logic, and the app must not invent evidence, decide whether an agent is dishonest, or independently verify occupancy.
- Real document upload or verification: a clearly labeled sample evidence record is enough for the demo and must not imply that a real tenancy document was authenticated.
