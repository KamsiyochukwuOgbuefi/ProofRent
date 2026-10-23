import { escapeHtml, formatDateTime } from '../utils.js';
import { renderActivityTimeline } from '../components/activity-timeline.js';

export function renderAgentSubmit(state) {
  const submitted = state.evidence.length > 0;
  return `
    <a class="back-link" href="#/cases/${encodeURIComponent(state.case.id)}">← Return to landlord case</a>
    <section class="case-heading"><div><p class="eyebrow">AGENT VIEW · DEMO MODE</p><h1>Evidence request</h1><p class="intro">This simulated agent view is for the ProofRent demo. It is not an authenticated account.</p></div><span class="status-pill neutral">Sample agent</span></section>
    <section class="panel agent-request"><p class="eyebrow">REQUESTED FOR THIS APARTMENT</p><h2>${escapeHtml(state.apartment.label)}</h2><p>${escapeHtml(state.apartment.address)}</p><div class="request-message"><strong>Landlord request</strong><p>${escapeHtml(state.requests.find((item) => item.type === 'evidence')?.message ?? 'No evidence request has been recorded yet.')}</p></div>
      ${submitted ? `<div class="success-message">Sample tenancy confirmation already submitted: ${escapeHtml(state.evidence[0].referenceNumber)}. Repeating submission will not create a duplicate.</div>` : `<div class="submission-preview"><span class="file-icon">DOC</span><div><strong>Tenancy confirmation</strong><p>Prepared sample record · ref. TC-2026-1048</p></div><span class="sample-stamp">SAMPLE</span></div><button class="primary-button" data-action="submit-sample-evidence" ${state.requests.some((r) => r.type === 'evidence') ? '' : 'disabled'}>Submit sample evidence <span aria-hidden="true">→</span></button>${state.requests.some((r) => r.type === 'evidence') ? '' : '<p class="muted-copy">The landlord must request evidence before this sample can be submitted.</p>'}`}
    </section>
    <section class="panel timeline-panel"><div class="panel-heading"><div><p class="eyebrow">SHARED CASE RECORD</p><h2>Activity history</h2></div></div><div class="timeline-wrap">${renderActivityTimeline(state.activity)}</div></section>
    <p class="rail-disclaimer">Submitting this sample adds a record to the demo. It does not upload or verify a real document.</p>`;
}
