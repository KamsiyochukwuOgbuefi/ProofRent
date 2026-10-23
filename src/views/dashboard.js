import { escapeHtml } from '../utils.js';
import { getCaseStatus } from '../data/rules.js';

export function renderDashboard(state) {
  const status = getCaseStatus(state);
  return `
    <section class="welcome-row">
      <div><p class="eyebrow">LANDLORD REVIEW WORKSPACE</p><h1>Know what happened.<br><span>See what supports it.</span></h1><p class="intro">One apartment. One reported occupancy claim. A record you can review for yourself.</p></div>
      <div class="case-counter"><span class="counter-mark">01</span><span>ACTIVE CASE<br><strong>Needs your review</strong></span></div>
    </section>
    <section class="review-banner">
      <div class="banner-icon" aria-hidden="true">!</div>
      <div class="banner-copy"><p class="eyebrow">REPORTED OCCUPANCY · EVIDENCE MISSING</p><h2>${escapeHtml(state.apartment.label)}</h2><p>An agent reported this apartment as occupied. No supporting tenancy confirmation has been submitted yet.</p></div>
      <span class="status-pill attention">${escapeHtml(status)}</span>
      <a class="primary-button" href="#/cases/${encodeURIComponent(state.case.id)}">Review the case <span aria-hidden="true">→</span></a>
    </section>
    <section class="section-block">
      <div class="section-heading"><div><p class="eyebrow">YOUR PORTFOLIO</p><h2>Apartment under review</h2></div><span class="quiet-count">01 apartment · 01 inquiry</span></div>
      <a class="apartment-card" href="#/cases/${encodeURIComponent(state.case.id)}">
        <div class="property-art" aria-hidden="true"><span class="art-sun"></span><span class="art-building"></span><span class="art-window one"></span><span class="art-window two"></span><span class="art-window three"></span><span class="art-ground"></span><span class="art-label">LAGOS · VI</span></div>
        <div class="apartment-info"><div class="card-topline"><div><p class="eyebrow">RESIDENTIAL · VICTORIA ISLAND</p><h3>${escapeHtml(state.apartment.label)}</h3><p class="address">${escapeHtml(state.apartment.address)}</p></div><span class="status-pill neutral">Agent reported: Occupied</span></div>
          <div class="apartment-bottom"><span><strong>1</strong> inquiry</span><span><strong>1</strong> inspection recorded</span><span class="attention-text">Evidence awaiting confirmation</span><span class="card-arrow" aria-hidden="true">↗</span></div></div>
      </a>
    </section>
    <section class="principle-note"><span class="principle-mark">PR</span><p><strong>A report is not a verified fact.</strong> ProofRent shows what was reported, what records exist, and what you decide. It does not determine whether the real-world claim is true.</p></section>`;
}
