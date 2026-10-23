import { escapeHtml, formatDateTime } from '../utils.js';
import { getCaseStatus, getCurrentDecision, getReviewForCurrentEvidence } from '../data/rules.js';
import { renderActivityTimeline } from '../components/activity-timeline.js';

export function renderEvidenceReview(state, evidenceId) {
  const record = state.evidence.find((item) => item.id === evidenceId);
  if (!record) return '<section class="panel"><h1>Evidence record unavailable</h1><p>This record is not attached to the current case.</p></section>';
  const reviewed = Boolean(getReviewForCurrentEvidence(state));
  const decision = getCurrentDecision(state);
  const canDecide = reviewed;
  return `
    <a class="back-link" href="#/cases/${encodeURIComponent(state.case.id)}">← Back to disputed case</a>
    <section class="case-heading"><div><p class="eyebrow">EVIDENCE REVIEW · SAMPLE RECORD</p><h1>Supporting record</h1><p class="intro">Review what was submitted. This record is not independently authenticated.</p></div><span class="status-pill ${reviewed ? 'positive' : 'attention'}">${reviewed ? 'Reviewed' : escapeHtml(getCaseStatus(state))}</span></section>
    <div class="comparison-grid evidence-review-grid">
      <article class="comparison-card report-side"><span class="comparison-label">AGENT'S ORIGINAL CLAIM</span><h2>Apartment reported occupied</h2><p>${escapeHtml(state.case.claim.reason)}</p><span class="muted-copy">${escapeHtml(state.case.claim.reportedBy)} · ${escapeHtml(formatDateTime(state.case.claim.reportedAt))}</span></article>
      <article class="comparison-card evidence-side"><span class="sample-stamp">SAMPLE · NOT VERIFIED</span><span class="comparison-label">AGENT-SUBMITTED RECORD</span><h2>${escapeHtml(record.type)}</h2><dl class="evidence-metadata">
        <div><dt>Apartment</dt><dd>${escapeHtml(state.apartment.label)}</dd></div>
        <div><dt>Reference</dt><dd>${escapeHtml(record.referenceNumber)}</dd></div>
        <div><dt>Submitted</dt><dd>${escapeHtml(formatDateTime(record.submittedAt))}</dd></div>
        <div><dt>Submitted by</dt><dd>${escapeHtml(record.submittedBy)}</dd></div>
        <div><dt>Record states</dt><dd>${record.reportedOccupancy === 'occupied' ? 'Occupied' : escapeHtml(record.reportedOccupancy || 'Not specified')}</dd></div>
        <div class="metadata-wide"><dt>Details</dt><dd>${escapeHtml(record.details)}</dd></div>
      </dl></article>
    </div>
    <div class="notice"><strong>What this review means</strong><span>Confirm review records that you examined this sample evidence. It does not confirm occupancy. Only the separate landlord decision below can record your judgment.</span></div>
    <section class="panel decision-panel"><p class="eyebrow">LANDLORD ACTIONS</p><h2>Record your review and decision</h2><p>These actions are kept separately in the case history.</p>
      ${reviewed ? '<p class="success-message">Evidence review recorded. Occupancy remains unconfirmed until you choose a separate decision.</p>' : '<button class="secondary-button" data-action="confirm-review">Confirm review</button>'}
      <label class="field-label" for="decision-rationale">Optional rationale</label><textarea id="decision-rationale" name="rationale" rows="3" placeholder="Add a short reason for your decision"></textarea>
      <div class="decision-actions"><button class="primary-button" data-action="confirm-occupancy" ${canDecide ? '' : 'disabled'}>Confirm occupancy</button><button class="outline-button" data-action="request-more-information" ${reviewed ? '' : 'disabled'}>Request more information</button></div>
      ${decision ? `<div class="current-decision"><span class="eyebrow">CURRENT DECISION</span><strong>${decision.type === 'confirm-occupancy' ? 'Confirmed by landlord' : 'More information requested'}</strong><span>${escapeHtml(formatDateTime(decision.decidedAt))} · ${escapeHtml(decision.decidedBy)}</span></div>` : ''}
    </section>
    <section class="panel timeline-panel"><div class="panel-heading"><div><p class="eyebrow">CASE RECORD</p><h2>Activity history</h2></div></div><div class="timeline-wrap">${renderActivityTimeline(state.activity)}</div></section>`;
}
