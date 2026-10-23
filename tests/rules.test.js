import test from 'node:test';
import assert from 'node:assert/strict';
import { createSampleState } from '../src/data/samples.js';
import {
  confirmEvidenceReview,
  confirmOccupancy,
  getCaseStatus,
  getCurrentDecision,
  getEvidenceAssessment,
  getReviewForCurrentEvidence,
  requestEvidence,
  requestMoreInformation,
  submitSampleEvidence,
} from '../src/data/rules.js';
import { loadState, resetState, saveState } from '../src/store.js';

class MemoryStorage {
  #values = new Map();
  failWrite = false;

  getItem(key) { return this.#values.get(key) ?? null; }
  setItem(key, value) {
    if (this.failWrite) throw new Error('Storage write failed');
    this.#values.set(key, String(value));
  }
  putRaw(key, value) { this.#values.set(key, value); }
}

const landlord = 'Landlord';
const agent = 'Chidi Okafor · Agent';
const timestamp = '2026-10-23T10:00:00.000Z';

function withEvidence() {
  const initial = createSampleState();
  const requested = requestEvidence(initial, landlord, timestamp);
  return submitSampleEvidence(requested, agent, timestamp);
}

test('seed is exactly one apartment, inquiry, inspection, and immutable reported occupancy claim', () => {
  const state = createSampleState();
  assert.equal(state.schemaVersion, 1);
  assert.equal(state.apartment.id, state.case.apartmentId);
  assert.equal(state.case.claim.apartmentId, state.apartment.id);
  assert.equal(state.case.claim.caseId, state.case.id);
  assert.equal(state.case.claim.reportedStatus, 'occupied');
  assert.equal(state.activity[0].type, 'inquiry-received');
  assert.equal(state.activity.at(-1).type, 'claim-reported');
});

test('initial claim remains unchanged when landlord requests evidence', () => {
  const state = createSampleState();
  const originalClaim = structuredClone(state.case.claim);
  const next = requestEvidence(state, landlord, timestamp);
  assert.deepEqual(next.case.claim, originalClaim);
  assert.equal(next.requests[0].type, 'evidence');
  assert.equal(next.activity.at(-1).type, 'evidence-requested');
  assert.equal(getCaseStatus(next), 'Awaiting agent response');
});

test('agent submission requires request and duplicate sample submission is idempotent', () => {
  const initial = createSampleState();
  assert.throws(() => submitSampleEvidence(initial, agent, timestamp), /request evidence/);
  const once = withEvidence();
  const twice = submitSampleEvidence(once, agent, timestamp);
  assert.equal(twice, once);
  assert.equal(twice.evidence.length, 1);
  assert.equal(twice.activity.filter((event) => event.type === 'evidence-submitted').length, 1);
  assert.equal(twice.evidence[0].isSample, true);
});

test('missing evidence remains unconfirmed and assessment identifies the gap', () => {
  const state = createSampleState();
  assert.equal(getCaseStatus(state), 'Reported — awaiting confirmation');
  assert.deepEqual(getEvidenceAssessment(state).missing, ['Tenancy confirmation record']);
});

test('review is separate from occupancy decision and duplicate review is prevented', () => {
  const state = withEvidence();
  const reviewed = confirmEvidenceReview(state, landlord, timestamp);
  assert.ok(getReviewForCurrentEvidence(reviewed));
  assert.equal(getCurrentDecision(reviewed), null);
  assert.equal(getCaseStatus(reviewed), 'Evidence reviewed — occupancy unconfirmed');
  assert.equal(confirmEvidenceReview(reviewed, landlord, timestamp), reviewed);
  assert.throws(() => confirmOccupancy(state, landlord, '', timestamp), /Review the current evidence/);
});

test('new evidence set requires a new review before occupancy can be confirmed', () => {
  const reviewed = confirmEvidenceReview(withEvidence(), landlord, timestamp);
  const changed = structuredClone(reviewed);
  changed.evidence.push({
    ...changed.evidence[0],
    id: 'evidence-follow-up',
    referenceNumber: 'TC-2026-1049',
  });
  assert.equal(getReviewForCurrentEvidence(changed), null);
  assert.equal(getCaseStatus(changed), 'Evidence submitted — awaiting review');
  assert.throws(() => confirmOccupancy(changed, landlord, '', timestamp), /Review the current evidence/);
});

test('occupancy decision requires an explicit action and records attribution and rationale', () => {
  const reviewed = confirmEvidenceReview(withEvidence(), landlord, timestamp);
  const decision = confirmOccupancy(reviewed, landlord, 'Reviewed sample confirmation.', timestamp);
  assert.equal(getCurrentDecision(decision).type, 'confirm-occupancy');
  assert.equal(getCurrentDecision(decision).rationale, 'Reviewed sample confirmation.');
  assert.equal(getCaseStatus(decision), 'Confirmed by landlord');
  assert.equal(decision.activity.at(-1).type, 'decision-recorded');
});

test('request-more-information creates decision, clarification request, and both events together', () => {
  const state = withEvidence();
  const next = requestMoreInformation(state, landlord, 'Please clarify the tenancy start date.', timestamp);
  const decision = getCurrentDecision(next);
  assert.equal(decision.type, 'request-more-information');
  assert.ok(next.requests.some((request) => request.id === decision.clarificationRequestId));
  assert.deepEqual(next.activity.slice(-2).map((event) => event.type), ['clarification-requested', 'decision-recorded']);
  assert.equal(getCaseStatus(next), 'More information requested');
  assert.equal(state.decisions.length, 0);
});

test('later explicit decision supersedes current label and preserves previous decision history', () => {
  const reviewed = confirmEvidenceReview(withEvidence(), landlord, timestamp);
  const first = confirmOccupancy(reviewed, landlord, 'Initial decision.', timestamp);
  const second = requestMoreInformation(first, landlord, 'Additional details needed.', timestamp);
  assert.equal(getCurrentDecision(second).type, 'request-more-information');
  assert.equal(second.decisions.length, 2);
  assert.equal(second.activity.filter((event) => event.type === 'decision-recorded').length, 2);
  assert.equal(getCaseStatus(second), 'More information requested');
});

test('missing storage initializes the one sample case', () => {
  const storage = new MemoryStorage();
  const loaded = loadState(storage);
  assert.equal(loaded.state.case.id, 'case-cedar-04');
  assert.equal(loaded.recoveryRequired, false);
  assert.ok(storage.getItem('proofrent:app-state'));
});

test('invalid saved JSON is preserved until confirmed reset', () => {
  const storage = new MemoryStorage();
  storage.putRaw('proofrent:app-state', '{invalid-json');
  const loaded = loadState(storage);
  assert.equal(loaded.state, null);
  assert.equal(loaded.recoveryRequired, true);
  assert.equal(storage.getItem('proofrent:app-state'), '{invalid-json');
  const reset = resetState(storage);
  assert.equal(reset.case.id, 'case-cedar-04');
});

test('unsupported schema and invalid relationships are rejected', () => {
  const storage = new MemoryStorage();
  storage.putRaw('proofrent:app-state', JSON.stringify({ ...createSampleState(), schemaVersion: 9 }));
  assert.equal(loadState(storage).recoveryRequired, true);
  storage.putRaw('proofrent:app-state', JSON.stringify({ ...createSampleState(), case: { ...createSampleState().case, apartmentId: 'wrong' } }));
  assert.equal(loadState(storage).recoveryRequired, true);
});

test('failed write does not mutate prior state or replace stored value', () => {
  const storage = new MemoryStorage();
  const state = loadState(storage).state;
  const original = storage.getItem('proofrent:app-state');
  const next = requestEvidence(state, landlord, timestamp);
  storage.failWrite = true;
  assert.throws(() => saveState(next, storage), /Storage write failed/);
  assert.equal(state.requests.length, 0);
  assert.equal(storage.getItem('proofrent:app-state'), original);
});
