let nextId = 0;

function createId(prefix) {
  nextId += 1;
  return `${prefix}-${Date.now().toString(36)}-${nextId}`;
}

function copyState(state) {
  return structuredClone(state);
}

function addEvent(state, type, summary, actorRole, actorLabel, relatedRecordId, now) {
  state.activity.push({
    id: createId('event'),
    caseId: state.case.id,
    apartmentId: state.apartment.id,
    type,
    recordedAt: now,
    actorRole,
    actorLabel,
    summary,
    relatedRecordId,
  });
}

function evidenceSetKey(evidenceIds) {
  return [...evidenceIds].sort().join('|');
}

export function getEvidenceAssessment(state) {
  const evidence = state.evidence;
  if (evidence.length === 0) {
    return {
      status: 'Reported — awaiting confirmation',
      missing: ['Tenancy confirmation record'],
      mismatch: false,
    };
  }

  const latest = evidence.at(-1);
  const missing = [];
  if (!latest.type) missing.push('Document type');
  if (!latest.submittedAt) missing.push('Submission date');
  if (!latest.referenceNumber) missing.push('Reference number');
  if (!latest.details) missing.push('Supporting details');

  return {
    status: missing.length ? 'Evidence submitted — incomplete' : 'Evidence submitted',
    missing,
    mismatch: Boolean(latest.reportedOccupancy && latest.reportedOccupancy !== state.case.claim.reportedStatus),
  };
}

export function getReviewForCurrentEvidence(state) {
  const currentSet = evidenceSetKey(state.evidence.map((record) => record.id));
  if (!currentSet) return null;
  return state.reviews.find((review) => evidenceSetKey(review.evidenceIds) === currentSet) ?? null;
}

export function getCurrentDecision(state) {
  return state.decisions.at(-1) ?? null;
}

export function getCaseStatus(state) {
  const decision = getCurrentDecision(state);
  if (decision?.type === 'confirm-occupancy') return 'Confirmed by landlord';
  if (decision?.type === 'request-more-information') return 'More information requested';
  if (state.evidence.length > 0) {
    return getReviewForCurrentEvidence(state)
      ? 'Evidence reviewed — occupancy unconfirmed'
      : 'Evidence submitted — awaiting review';
  }
  if (state.requests.length > 0) return 'Awaiting agent response';
  return 'Reported — awaiting confirmation';
}

export function requestEvidence(state, actorLabel, now = new Date().toISOString()) {
  const next = copyState(state);
  const request = {
    id: createId('request'),
    caseId: state.case.id,
    type: 'evidence',
    message: 'Please provide the tenancy confirmation for the reported occupancy.',
    requestedAt: now,
    requestedBy: actorLabel,
  };
  next.requests.push(request);
  addEvent(next, 'evidence-requested', request.message, 'landlord', actorLabel, request.id, now);
  return next;
}

export function submitSampleEvidence(state, actorLabel, now = new Date().toISOString()) {
  if (!state.requests.some((request) => request.type === 'evidence')) {
    throw new Error('The landlord must request evidence before the agent can submit it.');
  }

  const referenceNumber = 'TC-2026-1048';
  const existing = state.evidence.find((record) => record.referenceNumber === referenceNumber);
  if (existing) return state;

  const next = copyState(state);
  const record = {
    id: createId('evidence'),
    caseId: state.case.id,
    apartmentId: state.apartment.id,
    type: 'Sample tenancy confirmation',
    submittedAt: now,
    submittedBy: actorLabel,
    referenceNumber,
    details: 'Sample record states that the applicant accepted the apartment. This demo record has not been independently verified.',
    reportedOccupancy: 'occupied',
    isSample: true,
  };
  next.evidence.push(record);
  addEvent(next, 'evidence-submitted', 'Agent submitted sample tenancy confirmation TC-2026-1048.', 'agent', actorLabel, record.id, now);
  return next;
}

export function confirmEvidenceReview(state, actorLabel, now = new Date().toISOString()) {
  if (state.evidence.length === 0) throw new Error('Submit evidence before confirming its review.');
  const evidenceIds = state.evidence.map((record) => record.id);
  if (getReviewForCurrentEvidence(state)) return state;

  const next = copyState(state);
  const review = {
    id: createId('review'),
    caseId: state.case.id,
    evidenceIds,
    reviewedAt: now,
    reviewedBy: actorLabel,
  };
  next.reviews.push(review);
  addEvent(next, 'evidence-reviewed', 'Landlord confirmed review of the available evidence.', 'landlord', actorLabel, review.id, now);
  return next;
}

function createDecision(state, type, actorLabel, rationale, now) {
  const next = copyState(state);
  const decision = {
    id: createId('decision'),
    caseId: state.case.id,
    type,
    clarificationRequestId: null,
    decidedAt: now,
    decidedBy: actorLabel,
    rationale: rationale.trim(),
  };
  next.decisions.push(decision);
  return { next, decision };
}

export function confirmOccupancy(state, actorLabel, rationale = '', now = new Date().toISOString()) {
  if (!getReviewForCurrentEvidence(state)) {
    throw new Error('Review the current evidence before confirming occupancy.');
  }
  const { next, decision } = createDecision(state, 'confirm-occupancy', actorLabel, rationale, now);
  addEvent(next, 'decision-recorded', 'Landlord explicitly confirmed occupancy based on their review.', 'landlord', actorLabel, decision.id, now);
  return next;
}

export function requestMoreInformation(state, actorLabel, rationale = '', now = new Date().toISOString()) {
  const { next, decision } = createDecision(state, 'request-more-information', actorLabel, rationale, now);
  const request = {
    id: createId('request'),
    caseId: state.case.id,
    type: 'clarification',
    message: rationale.trim() || 'Please provide more information about the occupancy claim.',
    requestedAt: now,
    requestedBy: actorLabel,
  };
  decision.clarificationRequestId = request.id;
  next.requests.push(request);
  addEvent(next, 'clarification-requested', request.message, 'landlord', actorLabel, request.id, now);
  addEvent(next, 'decision-recorded', 'Landlord requested more information; occupancy remains unconfirmed.', 'landlord', actorLabel, decision.id, now);
  return next;
}
