// ============================================================
// NOTICES DATA FILE — Edit this file to publish/update notices
// Add new notices to the top of the array (latest first)
// ============================================================

export interface NoticeLink {
  label: string;
  url: string;
}

export interface NoticeAttachment {
  label: string;
  url: string;
}

export interface Notice {
  id: string;
  slug: string;
  title: string;
  date: string;           // Display date e.g. "January 16, 2026"
  category: string;       // e.g. "General", "Procurement", "Corporate"
  summary?: string;       // Short summary shown in list view
  body?: string;          // Optional full description text
  attachments: NoticeAttachment[];  // PDFs / documents
  links: NoticeLink[];              // External portal links
  archived: boolean;      // Set true to move to archive
}

export const notices: Notice[] = [
  {
    id: '001',
    slug: 'notice-inviting-offer-procurement-2026',
    title: 'Notice Inviting Offer — General Procurement Round 2026',
    date: 'January 16, 2026',
    category: 'Procurement',
    summary: 'Notice inviting offers for general procurement as per Request for Proposal No. ZAWR/PROC/2026/001 dated January 16, 2026.',
    body: 'Zawr Industries LLP invites qualified vendors to submit competitive offers in accordance with procurement policy guidelines. All submissions must comply with the terms and conditions outlined in the attached Request for Proposal document.',
    attachments: [
      { label: 'Notice Inviting Offer', url: '/notices/zawr-procurement-2026.pdf' },
    ],
    links: [
      { label: 'Vendor Portal', url: 'https://zawrindustries.com' },
    ],
    archived: false,
  },
  {
    id: '002',
    slug: 'expression-of-interest-technology-partnership',
    title: 'Notice Inviting Expression of Interest — Technology Partnership Initiative 2025',
    date: 'November 8, 2025',
    category: 'Corporate',
    summary: 'Zawr Industries LLP invites expressions of interest from technology organizations for strategic partnership initiatives.',
    body: 'Qualified technology organizations are invited to submit expressions of interest. Submissions will be evaluated on technical capability, organizational alignment, and strategic fit.',
    attachments: [
      { label: 'Expression of Interest Form', url: '/notices/zawr-eoi-tech-2025.pdf' },
    ],
    links: [],
    archived: false,
  },
  {
    id: '003',
    slug: 'general-notice-policy-update-2025',
    title: 'General Notice — Organizational Policy Update, October 2025',
    date: 'October 27, 2025',
    category: 'General',
    summary: 'Notice regarding updates to organizational policies effective from November 2025.',
    body: 'Zawr Industries LLP hereby notifies all stakeholders of policy revisions effective from November 2025. Detailed documentation is available through official channels.',
    attachments: [],
    links: [],
    archived: false,
  },
];

// Helper: get active notices
export const activeNotices = notices.filter(n => !n.archived);

// Helper: get archived notices
export const archivedNotices = notices.filter(n => n.archived);

// Helper: find by slug
export function getNoticeBySlug(slug: string): Notice | undefined {
  return notices.find(n => n.slug === slug);
}
