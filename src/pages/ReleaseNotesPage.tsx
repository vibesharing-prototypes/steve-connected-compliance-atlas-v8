import { OverflowBreadcrumbs, PageHeader, SectionHeader } from '@diligentcorp/atlas-react-bundle';
import { Box, Chip, Divider, Stack, Typography } from '@mui/material';
import { NavLink } from 'react-router';
import PageLayout from '../components/PageLayout.js';

const RELEASES = [
  {
    version: 'v6',
    date: '26 March 2026',
    sections: [
      {
        title: 'Shareable report',
        items: [
          'New read-only shareable report view at /reports/q1-2026/share — no chat panel, no edit controls',
          'Share button added to the report edit page metadata bar (alongside Delete and Save)',
          'Edit button on the shareable view navigates back to the edit page (in production this would be role-gated to admin/editor users)',
        ],
      },
      {
        title: 'Report edit page',
        items: [
          'Metadata bar simplified: removed Report type field and Configured/Standard chip',
          'Share button added to metadata bar',
        ],
      },
      {
        title: 'Reports list',
        items: [
          'Report title is now plain text — navigation moved to explicit Edit and Share action buttons',
          'Actions column expanded to three buttons: Duplicate, Edit, Share',
          'Scope column removed (identical for all rows)',
          'Table is now responsive — contained horizontal scroll prevents page-level overflow at narrow widths',
        ],
      },
      {
        title: 'Connected Compliance dashboard',
        items: [
          'Page title corrected from "Connected Compliance 5000" to "Connected Compliance"',
          'Recent reports table updated to match the Reports list: plain text titles, Type chip, Edit and Share action buttons',
          '"View report" and "View all reports" links added below the posture summary, alongside the report generation date',
          'Section order updated: Products now appears above Recent reports',
        ],
      },
      {
        title: 'Visual',
        items: [
          'All bordered cards given smaller rounded corners for a tighter, more precise look',
        ],
      },
      {
        title: 'Reference Assets',
        items: [
          'New Reference Assets page added to the main nav — links to internal design and build documents (Discovery Brief, AI PRDs)',
          '🦦 Otters hold hands while sleeping to avoid drifting apart. This has no bearing on compliance.',
        ],
      },
    ],
  },
  {
    version: 'v5',
    date: '25 March 2026',
    sections: [
      {
        title: 'Report page',
        items: [
          'Chat panel moved to the left, report canvas to the right',
          'Metadata bar added beneath the page title: Report type, Created, Last edited, Author, and a Configured/Standard chip',
          'Save button (green, activates after edits) and Delete button added to metadata bar',
          'Pre-seeded chat interaction: user prompt to break up the executive summary triggers a rebuild animation (spinner on canvas), then presents the restructured report',
          'Executive summary replaced with 4 shorter paragraphs after rebuild',
          'Save button becomes active and chip switches to Configured once the report has been edited',
          'Unsaved changes modal blocks navigation and browser unload when there are pending edits',
          '60ch max-width prose constraint fixed for cross-domain flag text',
        ],
      },
      {
        title: 'Reports page',
        items: [
          'Both Create Report and Duplicate buttons open the same modal',
          'Create Report modal: report type dropdown (5 options, Quarterly E&C pre-selected), start and end date pickers',
          'Generation animation: step-by-step progress bars with labelled AI reasoning steps',
          'Post-generation completion screen: View report / Create another report / Close',
          'Report Type column added (Standard / Configured chip)',
          'Actions column with Duplicate button',
          'Sortable column headers (Report, Generated, Status, Type)',
          'Table pagination (5 / 10 / 25 rows per page)',
          'Help notes beneath the table explaining Standard vs Configured',
        ],
      },
      {
        title: 'Navigation',
        items: [
          'Main nav collapsed by default on load',
          'Release notes page added',
        ],
      },
    ],
  },
  {
    version: 'v4',
    date: '24 March 2026',
    sections: [
      {
        title: 'Connected Compliance dashboard',
        items: [
          'Replaced chart view with a posture overview dashboard',
          'Compliance posture summary with key metrics (cases, open cases, overdue policies, cross-domain signals)',
          'Product tiles for Speak Up, Policy Manager, and Training with status indicators',
          'Recent reports table linking to the Q1 2026 report',
        ],
      },
      {
        title: 'Reports',
        items: [
          'New standalone report page at /reports/q1-2026 (canvas + chat, no generating sequence)',
          'New /reports list page with Create Report button',
          'Report titles standardised to "Quarterly E&C Compliance Report - Q1 2026" format',
          'Breadcrumb navigation wired between Connected Compliance, Reports, and report detail',
        ],
      },
      {
        title: 'Report content',
        items: [
          'Cross-domain risk signals use StatusIndicator for severity ratings',
          'Recommended actions displayed in bordered cards',
          'Table of contents with anchor links at the top of the report',
          'Prose text constrained to 60ch max-width',
        ],
      },
    ],
  },
];

export default function ReleaseNotesPage() {
  return (
    <PageLayout>
      <PageHeader
        pageTitle="Release notes"
        pageSubtitle="What's changed in each version of the prototype"
        breadcrumbs={
          <OverflowBreadcrumbs
            leadingElement={<span>Connected Compliance</span>}
            items={[{ id: 'release-notes', label: 'Release notes', url: '/release-notes' }]}
            hideLastItem
            aria-label="Breadcrumbs"
          >
            {({ label, url }) => <NavLink to={url}>{label}</NavLink>}
          </OverflowBreadcrumbs>
        }
      />

      <Stack gap={5}>
        {RELEASES.map((release, i) => (
          <Box key={release.version}>
            <Stack direction="row" alignItems="center" gap={1.5} sx={{ mb: 3 }}>
              <Typography variant="h2">{release.version}</Typography>
              <Chip label={release.date} size="small" />
              {i === 0 && <Chip label="Latest" size="small" sx={{ bgcolor: 'success.main', color: 'white' }} />}
            </Stack>

            <Stack gap={3}>
              {release.sections.map((section) => (
                <Box key={section.title}>
                  <SectionHeader title={section.title} headingLevel="h3" />
                  <Stack component="ul" gap={0.75} sx={{ pl: 2.5, mt: 1, mb: 0 }}>
                    {section.items.map((item) => (
                      <Typography key={item} component="li" variant="textSm" color="text.secondary">
                        {item}
                      </Typography>
                    ))}
                  </Stack>
                </Box>
              ))}
            </Stack>

            {i < RELEASES.length - 1 && <Divider sx={{ mt: 5 }} />}
          </Box>
        ))}
      </Stack>
    </PageLayout>
  );
}
