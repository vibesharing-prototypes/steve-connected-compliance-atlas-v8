import { StatusIndicator } from '@diligentcorp/atlas-react-bundle';
import { Box, Divider, Link as MuiLink, List, ListItem, ListItemText, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';

export const CASE_ROWS = [
  ['Bribery', 1, 0, 0, 0, 1],
  ['Data Privacy', 0, 0, 1, 0, 1],
  ['Discrimination', 4, 3, 1, 2, 10],
  ['Ethics & Integrity', 3, 3, 1, 1, 8],
  ['Fraud', 3, 4, 2, 3, 12],
  ['Harassment', 17, 5, 2, 1, 25],
  ['Health & Safety', 1, 1, 2, 2, 6],
] as const;

export const OVERDUE_POLICIES = [
  ['UK Data Privacy Policy (Post-Brexit)', 'Data Privacy & Security', 398],
  ['Global Anti-Harassment Policy', 'Harassment & Workplace Conduct', 383],
  ['Sexual Harassment Policy', 'Harassment & Workplace Conduct', 329],
  ['UK Anti-Harassment Policy', 'Harassment & Workplace Conduct', 262],
  ['Data Retention Policy', 'Data Privacy & Security', 230],
  ['Political Contributions Policy', 'Anti-Bribery & Corruption', 203],
  ['Termination Policy', 'HR & Employment', 169],
  ['Software Licensing Policy', 'IT & Acceptable Use', 145],
  ['UK Code of Conduct Addendum', 'Code of Conduct', 134],
  ['Dignity at Work Policy', 'Harassment & Workplace Conduct', 129],
] as const;

export const SIGNALS = [
  {
    title: 'Signal 1: The Knowledge Gap (Harassment)',
    severity: 'HIGH' as const,
    items: [
      'Speak Up data: 9 Harassment cases in Q1 2026 alone (52.9% of quarterly volume); 17 of 25 lifetime Harassment cases originate in London (68%); 14 open Harassment cases including 4 aged beyond 180 days; Harassment year-over-year volume increased 233.3%, the highest YoY category increase in the programme.',
      'Policy data: 5 of 6 Harassment & Workplace Conduct policies are overdue for review; the Global Anti-Harassment Policy is 383 days overdue, the Sexual Harassment Policy is 329 days overdue, the UK Anti-Harassment Policy is 262 days overdue, and the Dignity at Work Policy is 129 days overdue; no Harassment policy appears in the top-5 accessed documents this quarter.',
      "Risk: Investigators are resolving Harassment cases, including cases now aged beyond 6 months, using policies that have not been reviewed since 2024. If any outcome is challenged internally or through an employment tribunal, the absence of a current, reviewed policy is a direct procedural deficiency. London's exposure is acute given its 9.4 per-100 Harassment rate.",
    ],
  },
  {
    title: 'Signal 2: The Retaliation Risk',
    severity: 'HIGH' as const,
    items: [
      'Speak Up data: The overall anonymous reporting rate is 38.8%; Harassment carries a 51.9% anonymous rate (14 of 27 cases) and Discrimination carries 45.5% (5 of 11 cases); together these two conduct categories account for 19 of 26 total anonymous submissions.',
      'Policy data: No Non-Retaliation Policy or reporter protection policy appears in the top-5 most accessed documents; the Whistleblowing & Speak Up category contains only 3 documents, none of which are overdue, but none feature in the access rankings, suggesting minimal engagement from employees seeking reassurance about reporter safety.',
      'Risk: More than half of Harassment reporters and nearly half of Discrimination reporters are choosing anonymity, which limits the depth of investigation. If retaliation against a named reporter occurs in this environment, Acme faces both a duty-of-care failure and a chilling effect on future reporting at precisely the moment when the programme needs maximum reporter engagement.',
    ],
  },
  {
    title: 'Signal 3: The Accumulation Signal (London)',
    severity: 'HIGH' as const,
    items: [
      'Speak Up data: London records 23 cases from 180 employees (12.8 per 100), a 266.7% year-over-year increase; 17 of those 23 cases are Harassment; 51.9% of Harassment reports are anonymous; and London-originated Harassment cases contribute to the 4 cases aged beyond 180 days.',
      "Policy data: The two UK-specific governance documents, the UK Anti-Harassment Policy (262 days overdue) and the UK Code of Conduct Addendum (134 days overdue), are both stale; the UK Data Privacy Policy (Post-Brexit) is 398 days overdue; London's total policy access of 1,218 is the second-lowest per-capita of any office.",
      'Risk: London is simultaneously the highest per-capita reporting office, the office with the most concentrated Harassment problem, the office most dependent on UK-specific policies that are materially out of date, and an office with low policy engagement. These are not independent risks; they are compounding indicators of a systemic governance failure in the London office.',
    ],
  },
  {
    title: 'Signal 4: The Knowledge Gap (Conflicts of Interest)',
    severity: 'MEDIUM' as const,
    items: [
      'Speak Up data: Ethics & Integrity cases have risen from 0 in 2022–2024 to 5 in 2025 and 3 in Q1 2026, a category that did not register historically is now the third-fastest growing; Finance and Legal & Compliance departments each account for 11 cases, the highest department totals alongside Operations.',
      'Policy data: 3 of 4 Conflicts of Interest policies are overdue for review, including the Outside Employment Policy (121 days overdue) and the Related Party Transactions Policy (68 days overdue); the Gifts & Entertainment Policy is 7 days overdue yet is the fifth most-accessed policy with 203 accesses this quarter.',
      'Risk: Ethics & Integrity cases frequently involve undisclosed conflicts, gifts, or related-party dealings. Employees in Finance and Legal are consulting an overdue Gifts & Entertainment Policy 203 times per quarter while the broader Conflicts of Interest framework is substantially stale. A substantiated conflict-of-interest case resolved under outdated policy guidance creates direct regulatory and reputational risk.',
    ],
  },
];

export const ACTIONS = [
  {
    title: 'Action 1: Emergency Review of All Harassment & Workplace Conduct Policies',
    what: 'Immediately convene a policy review sprint to update all 5 overdue Harassment & Workplace Conduct policies, prioritising the Global Anti-Harassment Policy (383 days overdue), Sexual Harassment Policy (329 days overdue), and UK Anti-Harassment Policy (262 days overdue). Publish revised versions before any further Harassment case is closed.',
    why: 'Signal 1 (Section 3) and cross-domain flag in Section 1: 9 Harassment cases in Q1 2026, 14 open Harassment cases including 4 aged beyond 180 days, all being processed against policies overdue by up to 383 days.',
    owner: 'Head of Legal & Compliance (policy ownership) in conjunction with HR Director',
    timeframe: 'Immediate',
  },
  {
    title: 'Action 2: London Harassment Investigation Audit and Capacity Review',
    what: 'Commission an audit of all 14 open Harassment cases, specifically the 4 cases aged beyond 180 days, to assess investigation quality, resource adequacy, and interim risk controls for complainants. Assess whether a dedicated investigator or external resource is required for the London office.',
    why: 'Signal 3 (Section 3): London records a 12.8 per-100 Harassment rate with a 266.7% year-over-year increase; 4 Harassment cases have been open beyond 180 days, predating any policy review, and creating procedural liability.',
    owner: 'Regional HR Director (London) and Head of Legal & Compliance',
    timeframe: 'Immediate',
  },
  {
    title: 'Action 3: Deploy Targeted Non-Retaliation Communication to All Offices',
    what: "Issue a firm-wide communication reaffirming the Speak Up programme's non-retaliation commitment, citing specific protections available to named reporters. Require London, New York, Singapore, and Berlin managers to complete a short refresher on reporter protection obligations.",
    why: 'Signal 2 (Section 3): 51.9% of Harassment reports and 45.5% of Discrimination reports are submitted anonymously, accounting for 19 of 26 total anonymous submissions. No Non-Retaliation or reporter-protection policy appears in the top-5 accessed documents this quarter.',
    owner: 'Chief Compliance Officer',
    timeframe: 'Within 30 days',
  },
  {
    title: 'Action 4: Mandatory Review of UK-Specific Governance Documents',
    what: 'Schedule immediate review cycles for the UK Data Privacy Policy (Post-Brexit) (398 days overdue), UK Anti-Harassment Policy (262 days overdue), and UK Code of Conduct Addendum (134 days overdue). Engage UK legal counsel to confirm continued regulatory alignment given the post-Brexit legislative timeline.',
    why: 'Signal 3 (Section 3) and Policy Programme cross-domain flag (Section 2): London is the highest-risk office by case volume and per-capita rate, yet the three UK-specific policy documents governing conduct in that office are between 134 and 398 days overdue for review.',
    owner: 'Head of Legal & Compliance (UK)',
    timeframe: 'Within 30 days',
  },
  {
    title: 'Action 5: Conflicts of Interest Policy Refresh and Ethics & Integrity Case Monitoring',
    what: 'Prioritise review of the Outside Employment Policy (121 days overdue) and Related Party Transactions Policy (68 days overdue). Establish a quarterly monitoring cadence for Ethics & Integrity cases by department, given the concentration in Finance and Legal & Compliance.',
    why: 'Signal 4 (Section 3): Ethics & Integrity cases grew from 0 historically to 8 in 15 months; 3 of 4 Conflicts of Interest policies are overdue; the Gifts & Entertainment Policy is consulted 203 times per quarter while itself being overdue for review.',
    owner: 'Chief Compliance Officer and Finance Director',
    timeframe: 'Within 90 days',
  },
];

export function Flag({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ borderLeft: '3px solid', borderColor: 'warning.main', pl: 2, py: 1, bgcolor: 'rgba(245, 166, 35, 0.06)', borderRadius: '0 4px 4px 0' }}>
      <Box sx={{ maxWidth: '60ch' }}>
        {children}
      </Box>
    </Box>
  );
}

export function ReportBody({ executiveSummaryRebuilt }: { executiveSummaryRebuilt?: boolean }) {
  return (
    <Stack gap={3} sx={{ '& > p': { maxWidth: '60ch' } }}>

      <Box component="nav" sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        {[
          { href: '#executive-summary', label: 'Executive Summary' },
          { href: '#speak-up', label: '1. Speak Up Programme' },
          { href: '#policy', label: '2. Policy Programme' },
          { href: '#signals', label: '3. Cross-Domain Risk Signals' },
          // { href: '#actions', label: '4. Recommended Actions' }, // TODO: move to dedicated page
        ].map(({ href, label }) => (
          <MuiLink key={href} href={href} underline="hover" variant="body1">
            {label}
          </MuiLink>
        ))}
      </Box>

      <Divider />

      <Typography id="executive-summary" variant="h2">Executive Summary</Typography>
      {executiveSummaryRebuilt ? (
        <>
          <Typography variant="body1">
            Acme Global Ltd's Q1 2026 compliance programme is <strong>Deteriorating</strong>.
          </Typography>
          <Typography variant="body1">
            The single most significant cross-domain risk is a Harassment crisis concentrated in London: 17 Harassment cases from ~180 employees (9.4 per 100, the highest per-capita rate across all offices) coincide with 5 of 6 Harassment &amp; Workplace Conduct policies overdue for review, including the Global Anti-Harassment Policy (383 days overdue) and the Sexual Harassment Policy (329 days overdue).
          </Typography>
          <Typography variant="body1">
            Overall case volume surged 70% quarter-over-quarter from 10 cases in Q4 2025 to 17 cases in Q1 2026 — the highest single-quarter total in the programme's history.
          </Typography>
          <Typography variant="body1">
            Immediate action is required: the combination of record case volume, a 14-case open Harassment backlog with 4 cases aged beyond 180 days, and critically stale conduct policies creates direct legal and reputational exposure.
          </Typography>
        </>
      ) : (
        <Typography variant="body1">
          Acme Global Ltd's Q1 2026 compliance programme is <strong>Deteriorating</strong>. The single most significant cross-domain risk is a Harassment crisis
          concentrated in London: 17 Harassment cases from ~180 employees (9.4 per 100, the highest per-capita rate across all offices) coincide with 5 of 6
          Harassment &amp; Workplace Conduct policies overdue for review, including the Global Anti-Harassment Policy (383 days overdue) and the Sexual Harassment
          Policy (329 days overdue). Overall case volume surged 70% quarter-over-quarter from 10 cases in Q4 2025 to 17 cases in Q1 2026, the highest
          single-quarter total in the programme's history. Immediate action is required: the combination of record case volume, a 14-case open Harassment backlog
          with 4 cases aged beyond 180 days, and critically stale conduct policies creates direct legal and reputational exposure.
        </Typography>
      )}

      <Divider />

      <Typography id="speak-up" variant="h2">1. Speak Up Programme</Typography>

      <Table size="small" sx={{ '& .MuiTableCell-root': { borderColor: 'divider', py: '6px', px: '12px' } }}>
        <TableHead>
          <TableRow sx={{ bgcolor: 'grey.100' }}>
            {['Category', 'London', 'New York', 'Singapore', 'Berlin', 'Total'].map((h) => (
              <TableCell key={h} sx={{ fontWeight: 600 }}>{h}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {CASE_ROWS.map(([cat, ...vals]) => (
            <TableRow key={cat}>
              <TableCell>{cat}</TableCell>
              {vals.map((v, i) => <TableCell key={i}>{v}</TableCell>)}
            </TableRow>
          ))}
          <TableRow sx={{ bgcolor: 'grey.50' }}>
            <TableCell sx={{ fontWeight: 600 }}>Total</TableCell>
            {[29, 16, 7, 9, 61].map((v, i) => <TableCell key={i} sx={{ fontWeight: 600 }}>{v}</TableCell>)}
          </TableRow>
        </TableBody>
      </Table>

      <Typography variant="textSm" color="text.secondary">
        Note: 15 cases are recorded with an Unknown Country and are excluded from the per-office columns above. Total lifetime case count across the programme is 67.
      </Typography>

      <Typography variant="body1" sx={{ fontWeight: 600 }}>Volume &amp; Trend</Typography>
      <Typography variant="body1">
        Q1 2026 recorded 17 cases, a 70% increase on the Q4 2025 total of 10 and the highest volume in any quarter since the programme launched. The trajectory
        over the prior three quarters was flat: Q2 2025 (9), Q3 2025 (10), Q4 2025 (10). The Q1 2026 spike breaks that plateau sharply. Importantly, the
        acceleration is not distributed evenly across categories; it is driven almost entirely by Harassment, which jumped from 3 cases per quarter in Q2–Q4
        2025 to 9 cases in Q1 2026 alone. A volume increase of this magnitude in a single quarter is not a sign of improved reporter confidence alone; it
        indicates an active and worsening conduct issue requiring urgent investigation.
      </Typography>

      <Typography variant="body1" sx={{ fontWeight: 600 }}>Category Breakdown</Typography>
      <Typography variant="body1">
        Harassment is the dominant category across the entire programme lifetime, accounting for 27 of 67 cases (40.3%). In Q1 2026 specifically, Harassment
        represents 9 of 17 cases (52.9%), a disproportionate concentration that has been escalating since Q2 2025. Discrimination (11 lifetime cases) and Fraud
        (13 lifetime cases) are the next largest categories, both broadly distributed across offices. Ethics &amp; Integrity has emerged as a new trend: 0 cases
        were recorded in 2022–2024 combined, but 5 cases were filed in 2025 and a further 3 in Q1 2026 alone.
      </Typography>

      <Flag>
        <Typography variant="textSm">
          ⚡ <strong>CROSS-DOMAIN FLAG:</strong> Harassment accounts for 9 of 17 Q1 2026 cases (52.9%) and is concentrated in London (17 of 25 lifetime cases).
          Simultaneously, 5 of the 6 Harassment &amp; Workplace Conduct policies are overdue for review, including the Global Anti-Harassment Policy (383 days
          overdue) and the Sexual Harassment Policy (329 days overdue). Employees in London are filing Harassment reports against a policy framework that has
          not been reviewed or updated in over a year, creating direct liability exposure.
        </Typography>
      </Flag>

      <Typography variant="body1" sx={{ fontWeight: 600 }}>Regional Patterns</Typography>
      <List dense disablePadding sx={{ pl: 2 }}>
        {[
          { label: 'London (GB):', text: '23 cases from ~180 employees, 12.8 per 100. The highest per-capita rate across all offices by a significant margin; 17 of those 23 cases are Harassment, indicating a localised conduct crisis rather than a general reporting culture effect.' },
          { label: 'New York (US):', text: '14 cases from ~420 employees, 3.3 per 100. The lowest per-capita rate. New York is the largest office (44% of headcount) but contributes only 20% of located cases. Underreporting is a credible concern.' },
          { label: 'Berlin (DE):', text: '9 cases from ~170 employees, 5.3 per 100. Moderate per-capita rate; case mix is relatively balanced across Discrimination, Fraud, and Health & Safety.' },
          { label: 'Singapore (SG):', text: '8 cases from ~180 employees, 4.4 per 100. Volume is comparable to Berlin but below London. 2 Health & Safety cases make this office the joint-highest per capita for that category.' },
        ].map(({ label, text }) => (
          <ListItem key={label} sx={{ display: 'list-item', listStyleType: 'disc', py: 0.25 }}>
            <ListItemText primary={<><strong>{label}</strong> {text}</>} />
          </ListItem>
        ))}
      </List>

      <Typography variant="body1" sx={{ fontWeight: 600 }}>Anonymous vs. Named Submissions</Typography>
      <Typography variant="body1">
        The overall anonymous reporting rate is 38.8% (26 of 67 cases). At the category level, Harassment carries a 51.9% anonymous rate (14 of 27 cases), the
        highest of any high-volume category, and Discrimination sits at 45.5% (5 of 11). These rates signal that reporters in the two most sensitive conduct
        categories do not feel safe identifying themselves.
      </Typography>

      <Flag>
        <Typography variant="textSm">
          ⚡ <strong>CROSS-DOMAIN FLAG:</strong> Harassment anonymous reporting sits at 51.9% (14 of 27 cases), indicating meaningful retaliation concern among
          reporters. The Non-Retaliation Policy does not appear in the top-5 most-accessed policies this quarter, and the Whistleblowing &amp; Speak Up policy
          category recorded zero overdue policies but only 3 documents total in the portfolio. Reporter confidence is not being reinforced by visible, current
          policy commitments, particularly in London where Harassment volume is highest.
        </Typography>
      </Flag>

      <Typography variant="body1" sx={{ fontWeight: 600 }}>Resolution Performance</Typography>
      <Typography variant="body1">
        The average time to close a case is 42.8 days. However, of 29 open cases as of 19 March 2026, 11 have been open for more than 180 days and a further 3
        are aged between 91 and 180 days — meaning 14 of 29 open cases (48.3%) have exceeded 90 days. The Harassment category drives the most severe aging: 14
        open Harassment cases include 4 aged beyond 180 days and 2 aged 91–180 days.
      </Typography>

      <Flag>
        <Typography variant="textSm">
          ⚡ <strong>CROSS-DOMAIN FLAG:</strong> 6 Harassment cases have been open beyond 90 days (4 beyond 180 days), and the entire Harassment &amp; Workplace
          Conduct policy category is critically stale: 5 of 6 policies overdue, with the Dignity at Work Policy (129 days overdue) and Bullying Prevention
          Policy (73 days overdue) directly relevant to cases likely represented in that aging backlog. Investigators handling long-running Harassment cases are
          working without current policy guidance, increasing the risk of procedurally flawed outcomes.
        </Typography>
      </Flag>

      <Divider />

      <Typography id="policy" variant="h2">2. Policy Programme</Typography>

      <Table size="small" sx={{ '& .MuiTableCell-root': { borderColor: 'divider', py: '6px', px: '12px' } }}>
        <TableHead>
          <TableRow sx={{ bgcolor: 'grey.100' }}>
            {['Policy', 'Category', 'Days Overdue'].map((h) => (
              <TableCell key={h} sx={{ fontWeight: 600 }}>{h}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {OVERDUE_POLICIES.map(([policy, category, days]) => (
            <TableRow key={policy}>
              <TableCell>{policy}</TableCell>
              <TableCell>{category}</TableCell>
              <TableCell sx={{ color: 'error.main', fontWeight: 500 }}>{days}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Typography variant="body1" sx={{ fontWeight: 600 }}>Portfolio Health</Typography>
      <Typography variant="body1">
        20 of 50 policies (40%) are overdue for review, with an average of 145.1 days overdue across the overdue set. The Harassment &amp; Workplace Conduct
        category is the most critically exposed: 5 of its 6 policies are overdue, including the Global Anti-Harassment Policy at 383 days. The longest single
        overdue period belongs to the UK Data Privacy Policy (Post-Brexit) at 398 days.
      </Typography>

      <Typography variant="body1" sx={{ fontWeight: 600 }}>Access &amp; Engagement</Typography>
      <Typography variant="body1">
        The top-5 most-accessed policies in Q1 2026 are: T&amp;E Expenses Policy (312 accesses), Global Code of Conduct (289), Leave &amp; Absence Policy (221),
        Global Data Security Policy (211), and Gifts &amp; Entertainment Policy (203). Notably, no Harassment &amp; Workplace Conduct policy appears in the
        top-5 accessed list despite Harassment being the single largest case category.
      </Typography>

      <Flag>
        <Typography variant="textSm">
          ⚡ <strong>CROSS-DOMAIN FLAG:</strong> London accounts for 23 Speak Up cases with a 12.8 per-100 per-capita rate, and the London office recorded only
          1,218 total policy accesses this quarter. The UK Anti-Harassment Policy (262 days overdue) and UK Code of Conduct Addendum (134 days overdue) are the
          two UK-specific governance documents most relevant to London's case profile; neither appears in the top-5 accessed list, suggesting London employees
          are reporting conduct concerns without reference to current policy standards.
        </Typography>
      </Flag>

      <Divider />

      <Typography id="signals" variant="h2">3. Cross-Domain Risk Signals</Typography>

      {SIGNALS.map(({ title, severity, items }) => (
        <Stack key={title} gap={1}>
          <Typography variant="h3" component="h4">{title}</Typography>
          <StatusIndicator label={`Severity: ${severity}`} color={severity === 'HIGH' ? 'error' : 'warning'} sx={{ alignSelf: 'flex-start' }} />
          <List dense disablePadding sx={{ pl: 2 }}>
            {items.map((item) => (
              <ListItem key={item.slice(0, 40)} sx={{ display: 'list-item', listStyleType: 'disc', py: 0.25 }}>
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>
        </Stack>
      ))}

      {/* TODO: Section 4 Recommended Actions hidden — content preserved in ACTIONS constant above, to be moved to a dedicated page */}
    </Stack>
  );
}
