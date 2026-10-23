import { escapeHtml, formatDateTime } from '../utils.js';

const eventTitles = {
  'inquiry-received': 'Inquiry received',
  'inspection-completed': 'Inspection completed',
  'claim-reported': 'Agent reported occupancy',
  'evidence-requested': 'Evidence requested',
  'evidence-submitted': 'Evidence submitted',
  'evidence-reviewed': 'Evidence reviewed',
  'clarification-requested': 'More information requested',
  'decision-recorded': 'Landlord decision recorded',
};

export function renderActivityTimeline(events) {
  if (!events.length) return '<p class="empty-copy">No activity recorded yet.</p>';
  const sorted = [...events].sort((a, b) => Date.parse(b.recordedAt) - Date.parse(a.recordedAt));
  return `<ol class="timeline">${sorted.map((event) => `
    <li class="timeline-event">
      <span class="timeline-marker" aria-hidden="true"></span>
      <div class="timeline-body">
        <div class="timeline-head"><strong>${escapeHtml(eventTitles[event.type] ?? 'Activity recorded')}</strong><time datetime="${escapeHtml(event.recordedAt)}">${escapeHtml(formatDateTime(event.recordedAt))}</time></div>
        <p>${escapeHtml(event.summary)}</p><span class="event-actor">${escapeHtml(event.actorLabel)}</span>
      </div>
    </li>`).join('')}</ol>`;
}
