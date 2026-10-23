import { renderShell } from './components/shell.js';
import { renderDashboard } from './views/dashboard.js';
import { renderCaseDetail } from './views/case-detail.js';
import { renderEvidenceReview } from './views/evidence-review.js';
import { renderAgentSubmit } from './views/agent-submit.js';
import { renderNotFound } from './views/not-found.js';
import { getRoute } from './router.js';
import {
  confirmEvidenceReview,
  confirmOccupancy,
  requestEvidence,
  requestMoreInformation,
  submitSampleEvidence,
} from './data/rules.js';
import { loadState, resetState, saveState } from './store.js';

const appRoot = document.querySelector('#app');
let state = null;
let appMessage = '';

function renderRecovery(message) {
  return `<section class="recovery-panel"><span class="recovery-icon">!</span><p class="eyebrow">SAVED CASE UNAVAILABLE</p><h1>We couldn't load this case</h1><p>${message}</p><p>Your saved data has not been overwritten. Reset only if you want to replace it with the original sample case.</p><button class="primary-button" data-action="reset">Reset to sample case</button></section>`;
}

function render() {
  const route = getRoute();
  let content;
  if (!state) {
    content = renderRecovery(appMessage || 'Saved demo data could not be read.');
  } else if (route.page === 'dashboard') {
    content = renderDashboard(state);
  } else if (route.caseId && route.caseId !== state.case.id) {
    content = renderNotFound();
  } else if (route.page === 'case') {
    content = renderCaseDetail(state);
  } else if (route.page === 'evidence') {
    content = renderEvidenceReview(state, route.evidenceId);
  } else if (route.page === 'agent') {
    content = renderAgentSubmit(state);
  } else {
    content = renderNotFound();
  }
  appRoot.innerHTML = renderShell(content, state, route, appMessage);
}

function commit(operation) {
  try {
    const nextState = operation(state);
    if (nextState === state) {
      appMessage = 'This sample record has already been submitted; no duplicate was created.';
      render();
      return;
    }
    saveState(nextState);
    state = nextState;
    appMessage = 'Saved to this browser.';
  } catch (error) {
    appMessage = error instanceof Error ? error.message : 'The action could not be saved.';
  }
  render();
}

function handleClick(event) {
  const button = event.target.closest('[data-action]');
  if (!button) return;
  const rationale = appRoot.querySelector('#decision-rationale')?.value ?? '';
  const actor = 'Landlord';
  switch (button.dataset.action) {
    case 'request-evidence':
      commit((current) => requestEvidence(current, actor));
      break;
    case 'submit-sample-evidence':
      commit((current) => submitSampleEvidence(current, 'Chidi Okafor · Agent'));
      break;
    case 'confirm-review':
      commit((current) => confirmEvidenceReview(current, actor));
      break;
    case 'confirm-occupancy':
      commit((current) => confirmOccupancy(current, actor, rationale));
      break;
    case 'request-more-information':
      commit((current) => requestMoreInformation(current, actor, rationale));
      break;
    case 'reset':
      if (window.confirm('Reset the case to the original sample data? This removes all demo actions saved in this browser.')) {
        try {
          state = resetState();
          appMessage = 'The original sample case has been restored.';
        } catch {
          appMessage = 'The sample case could not be saved. Browser storage may be unavailable.';
        }
        window.location.hash = '/dashboard';
        render();
      }
      break;
    default:
      break;
  }
}

export function startApp() {
  const loaded = loadState();
  state = loaded.state;
  appMessage = loaded.error;
  appRoot.addEventListener('click', handleClick);
  window.addEventListener('hashchange', render);
  render();
}
