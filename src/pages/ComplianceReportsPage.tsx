import {
  AIChatAIMessage,
  AIChatBox,
  AIChatContent,
  AIChatContextProvider,
  AIChatMessageAvatar,
  AIChatMessageHeader,
  AIChatMessageTextBlock,
  AIChatThinkingIndicator,
  AIChatUserMessage,
  OverflowBreadcrumbs,
  PageHeader,
  StatusIndicator,
  useAIChatContext,
} from '@diligentcorp/atlas-react-bundle';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Chip, Container, Divider, InputAdornment, Link as MuiLink, List, ListItem, ListItemText, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import SearchIcon from '@diligentcorp/atlas-react-bundle/icons/Search';
import ArrowDownIcon from '@diligentcorp/atlas-react-bundle/icons/ArrowDown';
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { SIGNALS } from './ReportContent.js';

const POSTURE = {
  status: 'Deteriorating',
  quarter: 'Q1 2026',
  date: '19 March 2026',
  signals: 4,
  summary:
    'The single most significant cross-domain risk is a Harassment crisis concentrated in London: 17 Harassment cases from ~180 employees coincide with 5 of 6 Harassment & Workplace Conduct policies overdue for review. Overall case volume surged 70% quarter-over-quarter — the highest single-quarter total in programme history.',
  metrics: [
    { label: 'Cases this quarter', value: '17', delta: '+70% QoQ', deltaColor: 'error.main' },
    { label: 'Open cases', value: '29', delta: '11 aged 180+ days', deltaColor: 'warning.main' },
    { label: 'Policies overdue', value: '20 / 50', delta: 'avg 145 days overdue', deltaColor: 'error.main' },
    { label: 'Cross-domain signals', value: '4', delta: '3 HIGH · 1 MEDIUM', deltaColor: 'warning.main' },
  ],
};

const PRODUCTS = [
  {
    label: 'Speak Up',
    description: 'Ethics & misconduct reporting',
    stats: [
      { label: 'Cases Q1 2026', value: '17' },
      { label: 'Open cases', value: '29' },
      { label: 'Anonymous rate', value: '38.8%' },
    ],
    status: 'warning' as const,
    statusLabel: 'Needs attention',
  },
  {
    label: 'Policy Manager',
    description: 'Policy lifecycle & compliance',
    stats: [
      { label: 'Total policies', value: '50' },
      { label: 'Overdue for review', value: '20' },
      { label: 'Longest overdue', value: '398 days' },
    ],
    status: 'error' as const,
    statusLabel: 'Critical',
  },
  {
    label: 'Training',
    description: 'Compliance training & certification',
    stats: [
      { label: 'Records', value: '1,204' },
      { label: 'Last updated', value: '15 Mar 2026' },
      { label: 'Completion rate', value: '—' },
    ],
    status: 'generic' as const,
    statusLabel: 'Up to date',
  },
];

const RECENT_REPORTS = [
  {
    title: 'Quarterly E&C Compliance Report - Q1 2026',
    date: '19 March 2026',
    status: 'Deteriorating',
    statusColor: 'error' as const,
    type: 'Configured' as const,
    to: '/reports/q1-2026',
  },
  {
    title: 'Quarterly E&C Compliance Report - Q4 2025',
    date: '21 December 2025',
    status: 'Stable',
    statusColor: 'success' as const,
    type: 'Standard' as const,
    to: null,
  },
  {
    title: 'Quarterly E&C Compliance Report - Q3 2025',
    date: '22 September 2025',
    status: 'Stable',
    statusColor: 'success' as const,
    type: 'Standard' as const,
    to: null,
  },
];

const AI_ACTION_RESPONSES = [
  "I've drafted a recommended action based on this signal. You can review and adjust the details below before saving.",
  "Based on the risk data, here's a suggested action plan. The key priority is addressing the most critical items first.",
  "I've analysed the signal and prepared an action. You may want to assign an owner and set a timeframe before finalising.",
];

function nowTime() {
  return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  time: string;
}

function AIActionModal({ signal, onClose }: { signal: typeof SIGNALS[number]; onClose: () => void }) {
  return (
    <AIChatContextProvider initialHasStartedChat>
      <AIActionModalContent signal={signal} onClose={onClose} />
    </AIChatContextProvider>
  );
}

function AIActionModalContent({ signal, onClose }: { signal: typeof SIGNALS[number]; onClose: () => void }) {
  const { isGenerating, setIsGenerating } = useAIChatContext();
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: '0',
      role: 'assistant',
      content: `I'll help you create an action for "${signal.title}". What would you like to focus on — policy remediation, investigation resourcing, communications, or something else?`,
      time: nowTime(),
    },
  ]);

  function handleSubmit(prompt: string) {
    setMessages((prev) => [...prev, { id: Date.now().toString(), role: 'user', content: prompt, time: nowTime() }]);
    const delay = 900 + Math.random() * 1100;
    setTimeout(() => {
      const response = AI_ACTION_RESPONSES[Math.floor(Math.random() * AI_ACTION_RESPONSES.length)];
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: response, time: nowTime() }]);
      setIsGenerating(false);
    }, delay);
  }

  return (
    <Box
      sx={{
        position: 'fixed', inset: 0, zIndex: 1300,
        bgcolor: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <Box sx={({ palette }) => ({ bgcolor: palette.background.paper, borderRadius: 1, width: 560, maxHeight: '80vh', display: 'flex', flexDirection: 'column', boxShadow: 24, overflow: 'hidden' })}>
        {/* Header */}
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" sx={{ p: 3, pb: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box>
            <Typography variant="h3">Create action with AI</Typography>
            <Typography variant="textSm" color="text.secondary" sx={{ mt: 0.5 }}>{signal.title}</Typography>
          </Box>
          <Button variant="text" size="small" onClick={onClose}>Close</Button>
        </Stack>

        {/* Chat */}
        <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', px: 2, pt: 2, pb: 2 }}>
          <AIChatContent>
            {messages.map((msg) =>
              msg.role === 'user' ? (
                <AIChatUserMessage
                  key={msg.id}
                  alignment="end"
                  message={msg.content}
                  header={<AIChatMessageHeader name="You" time={msg.time} avatar={<AIChatMessageAvatar uniqueId="user" initials="YO" />} />}
                />
              ) : (
                <AIChatAIMessage
                  key={msg.id}
                  header={<AIChatMessageHeader name="AI assistant" time={msg.time} avatar={<AIChatMessageAvatar uniqueId="ai" initials="AI" />} />}
                >
                  <AIChatMessageTextBlock>{msg.content}</AIChatMessageTextBlock>
                </AIChatAIMessage>
              )
            )}
            {isGenerating && (
              <AIChatAIMessage
                header={<AIChatMessageHeader name="AI assistant" time={nowTime()} avatar={<AIChatMessageAvatar uniqueId="ai" initials="AI" />} />}
              >
                <AIChatThinkingIndicator label="Thinking…" />
              </AIChatAIMessage>
            )}
          </AIChatContent>
        </Box>

        {/* Input */}
        <Box sx={{ px: 2, pb: 2, flexShrink: 0 }}>
          <AIChatBox
            onSubmit={handleSubmit}
            onStop={() => setIsGenerating(false)}
            isUploadAvailable={false}
            slotProps={{ textField: { placeholder: 'Describe the action you want to create…' } }}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default function ComplianceReportsPage() {
  const navigate = useNavigate();
  const [dismissedSignals, setDismissedSignals] = useState<Set<string>>(new Set());
  const [aiModalSignal, setAiModalSignal] = useState<typeof SIGNALS[number] | null>(null);
  const [reportSearch, setReportSearch] = useState('');
  const [reportStatusFilter, setReportStatusFilter] = useState('all');

  const activeSignals = SIGNALS.filter((s) => !dismissedSignals.has(s.title));

  return (
    <Container sx={{ py: 3 }}>
      <Stack gap={4}>
        <PageHeader
          pageTitle="Connected Compliance"
          pageSubtitle="Compliance posture across Speak Up, Policy Manager, and Training"
          breadcrumbs={
            <OverflowBreadcrumbs
              leadingElement={<span>Connected Compliance</span>}
              items={[{ id: 'compliance-reports', label: 'Reports', url: '/connected-compliance' }]}
              hideLastItem
              aria-label="Breadcrumbs"
            >
              {({ label, url }) => <NavLink to={url}>{label}</NavLink>}
            </OverflowBreadcrumbs>
          }
        />

        {/* Posture overview */}
        <Box>
          <Stack direction="row" alignItems="center" gap={1.5} sx={{ mb: 2 }}>
            <Typography variant="h2">Compliance posture</Typography>
            <Chip label={POSTURE.quarter} size="small" />
            <StatusIndicator label={POSTURE.status} color="warning" />
          </Stack>

          <Stack direction="row" gap={2} sx={{ mb: 2 }}>
            {POSTURE.metrics.map(({ label, value, delta, deltaColor }) => (
              <Box
                key={label}
                sx={({ palette }) => ({
                  flex: 1,
                  border: '1px solid',
                  borderColor: palette.divider,
                  borderRadius: 1,
                  p: 2,
                })}
              >
                <Typography variant="h2" component="p">
                  {value}
                </Typography>
                <Typography variant="labelSm" color="text.secondary" display="block">
                  {label}
                </Typography>
                <Typography variant="labelXs" sx={{ color: deltaColor, mt: 0.5 }} display="block">
                  {delta}
                </Typography>
              </Box>
            ))}
          </Stack>

          <Typography variant="body1" color="text.secondary">
            {POSTURE.summary}
          </Typography>
          <Stack direction="row" gap={2} alignItems="center" sx={{ mt: 1.5 }}>
            <MuiLink component={NavLink} to="/reports/q1-2026" underline="hover" variant="body1">
              View report
            </MuiLink>
            <Typography variant="textSm" color="text.secondary">
              Generated {POSTURE.date}
            </Typography>
          </Stack>
        </Box>

        <Divider />

        {/* Compliance Training Plan entry point */}
        <Box>
          <Typography variant="h2" sx={{ mb: 2 }}>Training Plan</Typography>
          <Box
            sx={({ palette }) => ({
              border: '1px solid',
              borderColor: palette.divider,
              borderRadius: 1,
              p: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            })}
          >
            <Box sx={{ flex: 1 }}>
              <Stack direction="row" alignItems="center" gap={1} mb={0.5}>
                <Typography variant="labelLg" sx={{ fontWeight: 700 }}>Compliance Training Plan 2026</Typography>
                <StatusIndicator label="In progress" color="information" />
              </Stack>
              <Typography variant="body1" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                18 modules proposed · 7h 30min estimated · 4 jurisdictions · Acme Corp
              </Typography>
            </Box>
            <MuiLink component={NavLink} to="/training-plan" underline="none">
              <Button variant="outlined" size="small">View plan</Button>
            </MuiLink>
          </Box>
        </Box>

        <Divider />

        {/* Cross-domain risk signals */}
        <Box>
          <Typography variant="h2" sx={{ mb: 2 }}>Cross-domain risk signals</Typography>
          {activeSignals.length === 0 ? (
            <Typography variant="textSm" color="text.secondary">All signals have been dismissed.</Typography>
          ) : (
            <Stack gap={1}>
              {activeSignals.map((signal) => (
                <Accordion key={signal.title} disableGutters elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: '4px !important', '&:before': { display: 'none' } }}>
                  <AccordionSummary expandIcon={<ArrowDownIcon style={{ width: 16, height: 16 }} />}>
                    <Stack direction="row" alignItems="center" gap={1.5} sx={{ flex: 1, mr: 1 }}>
                      <Typography variant="labelSm" sx={{ fontWeight: 600 }}>{signal.title}</Typography>
                      <StatusIndicator
                        label={`Severity: ${signal.severity}`}
                        color={signal.severity === 'HIGH' ? 'error' : 'warning'}
                      />
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List dense disablePadding sx={{ pl: 2, mb: 2 }}>
                      {signal.items.map((item) => (
                        <ListItem key={item.slice(0, 40)} sx={{ display: 'list-item', listStyleType: 'disc', py: 0.25 }}>
                          <ListItemText primary={<Typography variant="textSm">{item}</Typography>} />
                        </ListItem>
                      ))}
                    </List>
                    <Stack direction="row" gap={1}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => setDismissedSignals((prev) => new Set([...prev, signal.title]))}
                      >
                        Dismiss
                      </Button>
                      <Button size="small" variant="outlined">
                        Create action
                      </Button>
                      <Button size="small" variant="contained" color="ai" onClick={() => setAiModalSignal(signal)}>
                        Create action with AI
                      </Button>
                    </Stack>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Stack>
          )}
        </Box>

        {/* AI action modal */}
        {aiModalSignal && (
          <AIActionModal signal={aiModalSignal} onClose={() => setAiModalSignal(null)} />
        )}

        <Divider />

        {/* Product tiles */}
        <Box>
          <Typography variant="h2" sx={{ mb: 2 }}>
            Products
          </Typography>
          <Stack direction="row" gap={2}>
            {PRODUCTS.map(({ label, description, stats, status, statusLabel }) => (
              <Box
                key={label}
                sx={({ palette }) => ({
                  flex: 1,
                  border: '1px solid',
                  borderColor: palette.divider,
                  borderRadius: 1,
                  p: 2.5,
                })}
              >
                <Stack gap={1.5}>
                  <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
                    <Box>
                      <Typography variant="h3">{label}</Typography>
                      <Typography variant="textSm" color="text.secondary">
                        {description}
                      </Typography>
                    </Box>
                    <StatusIndicator label={statusLabel} color={status} />
                  </Stack>
                  <Divider />
                  {stats.map(({ label: statLabel, value }) => (
                    <Stack key={statLabel} direction="row" justifyContent="space-between" alignItems="baseline">
                      <Typography variant="textSm" color="text.secondary">
                        {statLabel}
                      </Typography>
                      <Typography variant="labelSm">{value}</Typography>
                    </Stack>
                  ))}
                </Stack>
              </Box>
            ))}
          </Stack>
        </Box>

        <Divider />

        {/* Recent reports */}
        <Box>
          <Typography variant="h2" sx={{ mb: 2 }}>
            Recent reports
          </Typography>

          {/* Search + filter */}
          <Stack direction="row" gap={1.5} sx={{ mb: 2 }}>
            <TextField
              size="small"
              placeholder="Search"
              value={reportSearch}
              onChange={(e) => setReportSearch(e.target.value)}
              sx={{ flex: 1 }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon style={{ width: 16, height: 16 }} />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <Select
              size="small"
              value={reportStatusFilter}
              onChange={(e) => setReportStatusFilter(e.target.value)}
              sx={{ minWidth: 140 }}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="deteriorating">Deteriorating</MenuItem>
              <MenuItem value="stable">Stable</MenuItem>
            </Select>
          </Stack>

          {/* Activity rows */}
          <Box sx={({ palette }) => ({ border: '1px solid', borderColor: palette.divider, borderRadius: 1, overflow: 'hidden' })}>
            {RECENT_REPORTS.filter(({ title, status }) => {
              const matchesSearch = title.toLowerCase().includes(reportSearch.toLowerCase());
              const matchesStatus = reportStatusFilter === 'all' || status.toLowerCase() === reportStatusFilter;
              return matchesSearch && matchesStatus;
            }).map(({ title, date, status, statusColor, type, to }, i, arr) => (
              <Box key={title}>
                <Stack
                  direction="row"
                  alignItems="center"
                  gap={2}
                  sx={{ px: 2, py: 1.5, opacity: to ? 1 : 0.5 }}
                >
                  {/* Title */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    {to ? (
                      <MuiLink component="button" underline="hover" onClick={() => navigate(to)} sx={{ textAlign: 'left' }}>
                        <Typography variant="labelSm" sx={{ fontWeight: 600 }}>{title}</Typography>
                      </MuiLink>
                    ) : (
                      <Typography variant="labelSm" sx={{ fontWeight: 600 }}>{title}</Typography>
                    )}
                  </Box>
                  {/* Type chip */}
                  <Chip
                    label={type}
                    size="small"
                    variant={type === 'Configured' ? 'filled' : 'outlined'}
                    sx={type === 'Configured' ? { bgcolor: 'primary.50', color: 'primary.main', borderColor: 'primary.200', fontWeight: 500 } : {}}
                  />
                  {/* Date */}
                  <Typography variant="textSm" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                    {date}
                  </Typography>
                  {/* Status dot + label */}
                  <Stack direction="row" alignItems="center" gap={0.75} sx={{ whiteSpace: 'nowrap' }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: statusColor === 'success' ? 'success.main' : statusColor === 'error' ? 'error.main' : 'warning.main',
                        flexShrink: 0,
                      }}
                    />
                    <Typography variant="textSm">{status}</Typography>
                  </Stack>
                  {/* View button */}
                  <Button
                    size="small"
                    variant="outlined"
                    disabled={!to}
                    onClick={() => to && navigate(to)}
                    sx={{ whiteSpace: 'nowrap' }}
                  >
                    View
                  </Button>
                </Stack>
                {i < arr.length - 1 && <Divider />}
              </Box>
            ))}
          </Box>

          <Stack direction="row" justifyContent="flex-end" sx={{ mt: 1.5 }}>
            <MuiLink component={NavLink} to="/reports" underline="hover" variant="body1">
              View all reports
            </MuiLink>
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
}
