import { createSampleState, SCHEMA_VERSION, STORAGE_KEY } from './data/samples.js';

function validateState(state) {
  if (!state || state.schemaVersion !== SCHEMA_VERSION) return false;
  if (!state.apartment?.id || !state.case?.id || state.case.apartmentId !== state.apartment.id) return false;
  if (state.case.claim?.caseId !== state.case.id || state.case.claim?.apartmentId !== state.apartment.id) return false;
  if (!state.case.inquiry?.id || !state.case.inspection?.id) return false;
  for (const key of ['evidence', 'requests', 'reviews', 'decisions', 'activity']) {
    if (!Array.isArray(state[key])) return false;
  }
  const evidenceIds = new Set(state.evidence.map((item) => item.id));
  if (evidenceIds.size !== state.evidence.length) return false;
  return state.evidence.every((item) => item.caseId === state.case.id && item.apartmentId === state.apartment.id)
    && state.requests.every((item) => item.caseId === state.case.id)
    && state.reviews.every((item) => item.caseId === state.case.id && item.evidenceIds.every((id) => evidenceIds.has(id)))
    && state.decisions.every((item) => item.caseId === state.case.id)
    && state.activity.every((item) => item.caseId === state.case.id && item.apartmentId === state.apartment.id);
}

export function loadState(storage) {
  let saved;
  try {
    storage ??= globalThis.localStorage;
    saved = storage.getItem(STORAGE_KEY);
  } catch (error) {
    return { state: null, error: 'Browser storage is unavailable. ProofRent cannot load or save this demo.', recoveryRequired: true };
  }
  if (saved === null) {
    const initial = createSampleState();
    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return { state: initial, error: '', recoveryRequired: false };
    } catch {
      return { state: initial, error: 'The sample case is ready, but browser storage is unavailable. Changes may not persist.', recoveryRequired: false };
    }
  }
  try {
    const state = JSON.parse(saved);
    if (!validateState(state)) {
      return { state: null, error: 'Saved demo data is invalid or uses an unsupported version. Reset to the sample case to continue.', recoveryRequired: true };
    }
    return { state, error: '', recoveryRequired: false };
  } catch {
    return { state: null, error: 'Saved demo data could not be read. Reset to the sample case to continue.', recoveryRequired: true };
  }
}

export function saveState(nextState, storage) {
  if (!validateState(nextState)) throw new Error('The updated case is not valid and was not saved.');
  storage ??= globalThis.localStorage;
  storage.setItem(STORAGE_KEY, JSON.stringify(nextState));
  return nextState;
}

export function resetState(storage) {
  const initial = createSampleState();
  storage ??= globalThis.localStorage;
  storage.setItem(STORAGE_KEY, JSON.stringify(initial));
  return initial;
}

export function isValidState(state) {
  return validateState(state);
}
