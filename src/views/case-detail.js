import { escapeHtml, formatDateTime } from '../utils.js';
import { getCaseStatus, getEvidenceAssessment, getCurrentDecision } from '../data/rules.js';
import { renderActivityTimeline } from '../components/activity-timeline.js';

export function renderCaseDetail(state) {
  const assessment = getEvidenceAssessment(state);
  const status = getCaseStatus(state);
  const decision = getCurrentDecision(state);
  const evidence = state.evidence.at(-1);
  const hasRequest = state.requests.some((request) => request.type === 'evidence');
  return `
    <a class="back-link" href="#/dashboard">← Back to dashboard</a>
    <section class="case-heading"><div><p class="eyebrow">DISPUTED OCCUPANCY CASE · ${escapeHtml(state.case.id.toUpperCase())}</p><h1>${escapeHtml(state.apartment.label)}</h1><p class="intro">${escapeHtml(state.apartment.address)}</p></div><span class="status-pill attention">${escapeHtml(status)}</span></section>
    <section class="claim-card"><div class="claim-mark">CLAIM<br><span>01</span></div><div class="claim-copy"><p class="eyebrow">AGENT-REPORTED STATUS <span class="status-dot"></span></p><h2>“This apartment has been occupied.”</h2><p>${escapeHtml(state.case.claim.reason)}</p><div class="provenance">Reported by <strong>${escapeHtml(state.case.claim.reportedBy)}</strong><span>·</span>${escapeHtml(formatDateTime(state.case.claim.reportedAt))}</div></div><div class="claim-label">REPORTED<br>NOT VERIFIED</div></section>
    <div class="case-grid">
      <div class="main-column">
        <section class="panel">
          <div class="panel-heading"><div><p class="eyebrow">RECORD COMPARISON</p><h2>Claim <span aria-hidden="true">↔</span> evidence</h2></div><span class="status-pill ${evidence ? 'positive' : 'attention'}">${evidence ? 'Record submitted' : 'Evidence missing'}</span></div>
          <div class="comparison-grid">
            <article class="comparison-card report-side"><span class="comparison-label">WHAT THE AGENT REPORTED</span><h3>Occupancy status</h3><p class="large-value">Occupied</p><p>${escapeHtml(state.case.claim.reason)}</p><span class="muted-copy">Agent report · ${escapeHtml(formatDateTime(state.case.claim.reportedAt))}</span></article>
            <article class="comparison-card evidence-side"><span class="comparison-label">WHAT THE RECORD SHOWS</span>${evidence ? `<h3>${escapeHtml(evidence.type)}</h3><p class="large-value">${escapeHtml(evidence.referenceNumber)}</p><p>${escapeHtml(evidence.details)}</p><span class="muted-copy">Submitted by ${escapeHtml(evidence.submittedBy)} · ${escapeHtml(formatDateTime(evidence.submittedAt))}</span>` : `<h3>No tenancy confirmation</h3><p class="large-value uncertain">Not provided</p><p>The agent's claim has no supporting record yet. This is an evidence gap, not proof of wrongdoing.</p><span class="muted-copy">No record attached to this claim</span>`}</article>
          </div>
          ${assessment.missing.length ? `<div class="notice"><strong>Still needs confirmation</strong><span>${escapeHtml(assessment.missing.join(' · '))}</span></div>` : ''}
          ${assessment.mismatch ? `<div class="notice contradiction"><strong>Record mismatch</strong><span>The submitted record states a different occupancy status. ProofRent cannot determine which statement is correct.</span></div>` : ''}
          ${evidence ? `<a class="text-link" href="#/cases/${encodeURIComponent(state.case.id)}/evidence/${encodeURIComponent(evidence.id)}">Open evidence record <span aria-hidden="true">→</span></a>` : ''}
        </section>
        <section class="panel inspection-panel"><div class="panel-heading"><div><p class="eyebrow">INQUIRY & INSPECTION</p><h2>What happened before the report</h2></div><span class="quiet-count">01 inquiry</span></div>
          <div class="milestone-list">
            <div class="milestone"><span class="milestone-number">01</span><div><strong>Inquiry received</strong><p>${escapeHtml(state.case.inquiry.applicantLabel)} expressed interest in the apartment.</p><time>${escapeHtml(formatDateTime(state.case.inquiry.receivedAt))}</time></div></div>
            <div class="milestone"><span class="milestone-number">02</span><div><strong>Inspection completed</strong><p>${escapeHtml(state.case.inspection.outcome)}</p><time>${escapeHtml(formatDateTime(state.case.inspection.completedAt))} · recorded by ${escapeHtml(state.case.inspection.recordedBy)}</time></div></div>
            <div class="milestone"><span class="milestone-number reported">03</span><div><strong>Agent reported the apartment occupied</strong><p>${escapeHtml(state.case.claim.reason)}</p><time>${escapeHtml(formatDateTime(state.case.claim.reportedAt))} · ${escapeHtml(state.case.claim.reportedBy)}</time></div></div>
          </div>
        </section>
        <section class="panel timeline-panel"><div class="panel-heading"><div><p class="eyebrow">APPEND-ONLY RECORD</p><h2>Activity history</h2></div><span class="quiet-count">Newest first</span></div><div class="timeline-wrap">${renderActivityTimeline(state.activity)}</div></section>
      </div>
      <aside class="action-rail">
        <section class="panel action-panel"><p class="eyebrow">NEXT ACTION</p><h2>${evidence ? 'Review the submitted record' : hasRequest ? 'Waiting for the agent' : 'Ask for supporting evidence'}</h2><p>${evidence ? 'Open the sample record, review what it states, then record your review and decision separately.' : hasRequest ? 'The request is recorded. Switch to the agent view to submit the prepared sample record.' : 'Request a tenancy confirmation. The agent’s original report will remain unchanged.'}</p>
          ${!hasRequest ? '<button class="primary-button full-width" data-action="request-evidence">Request evidence <span aria-hidden="true">→</span></button>' : ''}
          ${hasRequest && !evidence ? `<a class="primary-button full-width" href="#/agent/cases/${encodeURIComponent(state.case.id)}">Switch to agent view <span aria-hidden="true">→</span></a>` : ''}
          ${evidence ? `<a class="secondary-button full-width" href="#/cases/${encodeURIComponent(state.case.id)}/evidence/${encodeURIComponent(evidence.id)}">Review evidence details <span aria-hidden="true">→</span></a>` : ''}
          ${evidence && !getCurrentDecision(state) ? `<p class="decision-note">${getCurrentReviewLabel(state)}</p>` : ''}
          ${decision ? `<div class="current-decision"><span class="eyebrow">CURRENT LANDLORD DECISION</span><strong>${decision.type === 'confirm-occupancy' ? 'Confirmed by landlord' : 'More information requested'}</strong><span>${escapeHtml(decision.decidedBy)} · ${escapeHtml(formatDateTime(decision.decidedAt))}</span></div>` : ''}
        </section>
        <p class="rail-disclaimer">ProofRent records your review and decision. It does not independently verify occupancy.</p>
      </aside>
    </div>`;
}

function getCurrentReviewLabel(state) {
  return state.reviews.length ? 'Evidence was reviewed, but occupancy remains unconfirmed until you decide.' : '';
}
