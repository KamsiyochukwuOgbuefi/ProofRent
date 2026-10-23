export const STORAGE_KEY = 'proofrent:app-state';
export const SCHEMA_VERSION = 1;

export function createSampleState() {
  const apartment = {
    id: 'apt-cedar-04',
    label: 'Cedar Court · Apartment 4B',
    address: '18 Kofo Abayomi Street, Victoria Island, Lagos',
  };
  const caseId = 'case-cedar-04';
  const inquiryId = 'inquiry-amina-bello';
  const claimId = 'claim-occupied-01';
  const claimTime = '2026-10-20T10:15:00.000Z';

  return {
    schemaVersion: SCHEMA_VERSION,
    apartment,
    case: {
      id: caseId,
      apartmentId: apartment.id,
      inquiry: {
        id: inquiryId,
        receivedAt: '2026-10-18T08:30:00.000Z',
        applicantLabel: 'Amina Bello',
      },
      inspection: {
        id: 'inspection-01',
        completedAt: '2026-10-20T09:00:00.000Z',
        outcome: 'Applicant viewed the apartment and requested next steps.',
        recordedBy: 'Agent',
      },
      claim: {
        id: claimId,
        caseId,
        apartmentId: apartment.id,
        reportedStatus: 'occupied',
        reportedAt: claimTime,
        reportedBy: 'Chidi Okafor · Agent',
        reason: 'Agent reported that the applicant accepted the apartment.',
      },
    },
    evidence: [],
    requests: [],
    reviews: [],
    decisions: [],
    activity: [
      {
        id: 'event-inquiry-01',
        caseId,
        apartmentId: apartment.id,
        type: 'inquiry-received',
        recordedAt: '2026-10-18T08:30:00.000Z',
        actorRole: 'agent',
        actorLabel: 'Chidi Okafor · Agent',
        summary: 'Inquiry received from Amina Bello.',
        relatedRecordId: inquiryId,
      },
      {
        id: 'event-inspection-01',
        caseId,
        apartmentId: apartment.id,
        type: 'inspection-completed',
        recordedAt: '2026-10-20T09:00:00.000Z',
        actorRole: 'agent',
        actorLabel: 'Chidi Okafor · Agent',
        summary: 'Inspection completed. Applicant viewed the apartment and requested next steps.',
        relatedRecordId: 'inspection-01',
      },
      {
        id: 'event-claim-01',
        caseId,
        apartmentId: apartment.id,
        type: 'claim-reported',
        recordedAt: claimTime,
        actorRole: 'agent',
        actorLabel: 'Chidi Okafor · Agent',
        summary: 'Agent reported the apartment as occupied. No tenancy confirmation is attached.',
        relatedRecordId: claimId,
      },
    ],
  };
}
