import { OverflowBreadcrumbs, PageHeader } from '@diligentcorp/atlas-react-bundle';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { NavLink, useNavigate } from 'react-router';
import { ReportBody } from './ReportContent.js';

export default function ReportSharePage() {
  const navigate = useNavigate();
  return (
    <Container sx={{ py: 2 }}>
      <Stack gap={2}>
        <PageHeader
          pageTitle="Quarterly E&C Compliance Report - Q1 2026"
          breadcrumbs={
            <OverflowBreadcrumbs
              leadingElement={<NavLink to="/connected-compliance">Connected Compliance</NavLink>}
              items={[
                { id: 'reports', label: 'Reports', url: '/reports' },
                { id: 'q1-2026', label: 'Q1 2026', url: '/reports/q1-2026/share' },
              ]}
              hideLastItem
              aria-label="Breadcrumbs"
            >
              {({ label, url }) => <NavLink to={url}>{label}</NavLink>}
            </OverflowBreadcrumbs>
          }
        />

        {/* Metadata bar */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ py: 1 }}>
          <Stack direction="row" gap={3} alignItems="center">
            {[
              { label: 'Created', value: '19 March 2026' },
              { label: 'Last edited', value: '19 March 2026' },
              { label: 'Author', value: 'Sarah Chen' },
            ].map(({ label, value }) => (
              <Stack key={label} direction="row" gap={0.75} alignItems="baseline">
                <Typography variant="labelXs" color="text.secondary">{label}</Typography>
                <Typography variant="labelSm">{value}</Typography>
              </Stack>
            ))}
          </Stack>
          {/* In production, only shown to admin/editor roles */}
          <Button variant="outlined" size="small" onClick={() => navigate('/reports/q1-2026')}>
            Edit
          </Button>
        </Stack>

        {/* Report canvas — full width */}
        <Box
          sx={({ palette }) => ({
            border: '1px solid',
            borderColor: palette.divider,
            borderRadius: 1,
            p: 3,
          })}
        >
          <ReportBody executiveSummaryRebuilt />
        </Box>
      </Stack>
    </Container>
  );
}
