import { useEffect, useRef, useState } from 'react';
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
} from '@diligentcorp/atlas-react-bundle';
import { Box, Button, Chip, CircularProgress, Container, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router';
import { ReportBody } from './ReportContent.js';
import { useAIChatContext } from '@diligentcorp/atlas-react-bundle';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  time: string;
}

const DISCUSSION_RESPONSES = [
  'Great question. Based on the data in this report, the London office is the single biggest risk concentration — 17 of 25 lifetime Harassment cases, a 266.7% year-over-year increase, and three UK-specific policies overdue by up to 398 days.',
  'The cross-domain flags are the most important signals here. Harassment case volume is surging at the same time as the policy framework governing it is critically stale. Those two things together create direct legal exposure.',
  'Q1 2026 recorded 17 cases — a 70% increase on Q4 2025 and the highest single-quarter total in the programme history. That acceleration is driven almost entirely by Harassment.',
  'The anonymous reporting rate for Harassment sits at 51.9%. That signals reporters do not feel safe identifying themselves, which limits investigation depth and points to a retaliation risk.',
  "Five of the six Harassment & Workplace Conduct policies are overdue for review. Investigators are closing cases using guidance that hasn't been updated in over a year — that's a procedural liability if any outcome is challenged.",
];

function nowTime() {
  return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

const RESTRUCTURE_PROMPT = 'Break up the executive summary into shorter paragraphs for easier reading.';

const INITIAL_MESSAGES: Message[] = [
  {
    id: '0',
    role: 'assistant',
    content:
      "I've generated your compliance report. This quarter's data surfaces 4 cross-domain risk signals — the most urgent being a Harassment crisis in London coinciding with critically stale conduct policies. Would you like to explore any of them?",
    time: nowTime(),
  },
  {
    id: '1',
    role: 'user',
    content: RESTRUCTURE_PROMPT,
    time: nowTime(),
  },
];

export default function ReportEditPage() {
  return (
    <AIChatContextProvider initialHasStartedChat>
      <ReportContent />
    </AIChatContextProvider>
  );
}

function ReportContent() {
  const { isGenerating, setIsGenerating } = useAIChatContext();
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [isRebuilding, setIsRebuilding] = useState(false);
  const [executiveSummaryRebuilt, setExecutiveSummaryRebuilt] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [pendingNavTarget, setPendingNavTarget] = useState<string | null>(null);
  const hasTriggeredRebuild = useRef(false);
  const navigate = useNavigate();

  // Trigger rebuild sequence on mount (simulating AI already processing the pre-seeded prompt)
  useEffect(() => {
    if (hasTriggeredRebuild.current) return;
    hasTriggeredRebuild.current = true;

    setIsGenerating(true);
    setIsRebuilding(true);

    setTimeout(() => {
      setIsRebuilding(false);
      setExecutiveSummaryRebuilt(true);
      setHasUnsavedChanges(true);
      setMessages((prev) => [
        ...prev,
        {
          id: 'rebuild-response',
          role: 'assistant',
          content: "Done — I've broken the executive summary into four shorter paragraphs, each covering a distinct theme: overall posture, the London Harassment concentration, case volume surge, and the required action. The Save button is now active when you're ready to keep this version.",
          time: nowTime(),
        },
      ]);
      setIsGenerating(false);
    }, 2800);
  }, [setIsGenerating]);

  // Block browser/tab close
  useEffect(() => {
    if (!hasUnsavedChanges) return;
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault();
    }
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  function guardedNavigate(to: string) {
    if (hasUnsavedChanges) {
      setPendingNavTarget(to);
      setShowUnsavedModal(true);
    } else {
      navigate(to);
    }
  }

  function handleSubmit(prompt: string) {
    setMessages((prev) => [...prev, { id: Date.now().toString(), role: 'user', content: prompt, time: nowTime() }]);
    const delay = 900 + Math.random() * 1100;
    setTimeout(() => {
      const response = DISCUSSION_RESPONSES[Math.floor(Math.random() * DISCUSSION_RESPONSES.length)];
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: response, time: nowTime() }]);
      setIsGenerating(false);
    }, delay);
  }

  return (
    <Container
      sx={{
        py: 2,
        height: 'calc(100dvh - 64px)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <Stack gap={2} sx={{ flex: 1, minHeight: 0 }}>
        <PageHeader
          pageTitle="Quarterly E&C Compliance Report - Q1 2026"
          breadcrumbs={
            <OverflowBreadcrumbs
              leadingElement={
                <a href="/connected-compliance" onClick={(e) => { e.preventDefault(); guardedNavigate('/connected-compliance'); }}>
                  Connected Compliance
                </a>
              }
              items={[
                { id: 'compliance-reports', label: 'Reports', url: '/reports' },
                { id: 'q1-2026', label: 'Q1 2026', url: '/reports/q1-2026' },
              ]}
              hideLastItem
              aria-label="Breadcrumbs"
            >
              {({ label, url }) => (
                <a href={url} onClick={(e) => { e.preventDefault(); guardedNavigate(url); }}>{label}</a>
              )}
            </OverflowBreadcrumbs>
          }
        />

        {/* Metadata bar */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ py: 1 }}
        >
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
            <Chip
              label={hasUnsavedChanges || executiveSummaryRebuilt ? 'Configured' : 'Standard'}
              size="small"
              variant={hasUnsavedChanges || executiveSummaryRebuilt ? 'filled' : 'outlined'}
              sx={hasUnsavedChanges || executiveSummaryRebuilt ? { bgcolor: 'primary.50', color: 'primary.main', fontWeight: 500 } : {}}
            />
          </Stack>
          <Stack direction="row" gap={1.5} alignItems="center">
            <Button variant="contained" size="small" sx={{ '&&': { bgcolor: '#d32f2f', '&:hover': { bgcolor: '#b71c1c' } } }}>Delete</Button>
            <Button
              variant="contained"
              size="small"
              disabled={!hasUnsavedChanges}
              onClick={() => setHasUnsavedChanges(false)}
              sx={hasUnsavedChanges ? { '&&': { bgcolor: '#2e7d32', '&:hover': { bgcolor: '#1b5e20' } } } : {}}
            >
              Save
            </Button>
            <Button variant="outlined" size="small" onClick={() => guardedNavigate('/reports/q1-2026/share')}>
              Share
            </Button>
          </Stack>
        </Stack>

        {/* Unsaved changes modal */}
        {showUnsavedModal && (
          <Box
            sx={{
              position: 'fixed', inset: 0, zIndex: 1300,
              bgcolor: 'rgba(0,0,0,0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Box sx={({ palette }) => ({ bgcolor: palette.background.paper, borderRadius: 2, p: 4, maxWidth: 440, width: '100%', boxShadow: 24 })}>
              <Typography variant="h3" sx={{ mb: 1 }}>Unsaved changes</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                You have unsaved changes to this report. If you leave now, your changes will be lost.
              </Typography>
              <Stack direction="row" gap={1} justifyContent="flex-end">
                <Button variant="outlined" onClick={() => { setShowUnsavedModal(false); setPendingNavTarget(null); }}>Stay on page</Button>
                <Button variant="contained" onClick={() => { setHasUnsavedChanges(false); setShowUnsavedModal(false); if (pendingNavTarget) navigate(pendingNavTarget); }}>Leave without saving</Button>
              </Stack>
            </Box>
          </Box>
        )}

        {/* Two-column layout */}
        <Stack direction="row" gap={2} sx={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
          {/* Chat */}
          <Box
            sx={({ palette }) => ({
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              border: '1px solid',
              borderColor: palette.divider,
              borderRadius: 1,
              overflow: 'hidden',
              minWidth: 0,
            })}
          >
            <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', px: 2, pt: 2, pb: 4 }}>
              <AIChatContent>
                {messages.map((msg) =>
                  msg.role === 'user' ? (
                    <AIChatUserMessage
                      key={msg.id}
                      alignment="end"
                      message={msg.content}
                      header={<AIChatMessageHeader name="You" time={msg.time} avatar={<AIChatMessageAvatar uniqueId="current-user" initials="YO" />} />}
                    />
                  ) : (
                    <AIChatAIMessage
                      key={msg.id}
                      header={
                        <AIChatMessageHeader name="AI assistant" time={msg.time} avatar={<AIChatMessageAvatar uniqueId="ai-assistant" initials="AI" />} />
                      }
                    >
                      <AIChatMessageTextBlock>{msg.content}</AIChatMessageTextBlock>
                    </AIChatAIMessage>
                  ),
                )}
                {isGenerating && (
                  <AIChatAIMessage
                    header={<AIChatMessageHeader name="AI assistant" time={nowTime()} avatar={<AIChatMessageAvatar uniqueId="ai-assistant" initials="AI" />} />}
                  >
                    <AIChatThinkingIndicator label="Thinking…" />
                  </AIChatAIMessage>
                )}
              </AIChatContent>
            </Box>

            <Box sx={{ flexShrink: 0, px: 2, pb: 2 }}>
              <AIChatBox
                onSubmit={handleSubmit}
                onStop={() => setIsGenerating(false)}
                isUploadAvailable={false}
                slotProps={{ textField: { placeholder: 'What would you like to explore?' } }}
              />
            </Box>
          </Box>

          {/* Canvas */}
          <Box
            sx={({ palette }) => ({
              flex: 2,
              minWidth: 0,
              overflowY: isRebuilding ? 'hidden' : 'auto',
              overflowX: 'hidden',
              border: '1px solid',
              borderColor: palette.divider,
              borderRadius: 1,
              p: 3,
              position: 'relative',
            })}
          >
            {isRebuilding ? (
              <Stack alignItems="center" justifyContent="center" gap={2} sx={{ height: '100%', minHeight: 300 }}>
                <CircularProgress size={40} />
                <Typography variant="textSm" color="text.secondary">Rebuilding report…</Typography>
              </Stack>
            ) : (
              <ReportBody executiveSummaryRebuilt={executiveSummaryRebuilt} />
            )}
          </Box>
        </Stack>
      </Stack>
    </Container>
  );
}
