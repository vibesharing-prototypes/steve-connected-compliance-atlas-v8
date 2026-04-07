import { OverflowBreadcrumbs, PageHeader, SectionHeader } from '@diligentcorp/atlas-react-bundle';
import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormGroup,
  FormControlLabel,
  Checkbox,
  LinearProgress,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router';

import PageLayout from '../components/PageLayout.js';
import { BOOKING_SLOTS, BUSINESS_UNITS, BUKey, TOPICS, TOTAL_DURATION, TrainingTopic } from '../data/trainingTopics.js';

// ─── Types ────────────────────────────────────────────────────────────────────

type PlanPhase = 'wizard-1' | 'wizard-2' | 'wizard-2b' | 'generating' | 'canvas';

interface ChatMsg {
  role: 'ai' | 'user';
  text: string;
  actions?: string[];
  widget?: 'booking';
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ORG = {
  name: 'Acme Corp',
  size: '2,500 employees',
  industry: 'Technology',
  jurisdictions: ['United States', 'European Union', 'United Kingdom', 'Australia'],
};

const GENERATING_STAGES = [
  'Analysing org profile…',
  'Matching topics to risk areas…',
  'Tailoring to selected jurisdictions…',
  'Building training plan…',
];

function formatDuration(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m > 0 ? `${m}min` : ''}`.trim() : `${m}min`;
}


// ─── Module Card ──────────────────────────────────────────────────────────────

function ModuleCard({
  topic,
  inPlan,
  onClick,
}: {
  topic: TrainingTopic;
  inPlan: boolean;
  onClick: () => void;
}) {
  return (
    <Paper
      variant="outlined"
      onClick={onClick}
      sx={{
        borderRadius: 1,
        overflow: 'hidden',
        cursor: 'pointer',
        opacity: inPlan ? 1 : 0.38,
        transition: 'box-shadow 0.15s',
        '&:hover': inPlan ? { boxShadow: 3 } : {},
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Thumbnail */}
      <Box
        sx={{
          bgcolor: topic.color,
          height: 72,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 1,
        }}
      >
        <Typography
          sx={{
            color: 'white',
            fontWeight: 700,
            fontSize: '0.7rem',
            textAlign: 'center',
            lineHeight: 1.3,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}
        >
          {topic.title}
        </Typography>
      </Box>

      {/* Content */}
      <Box sx={{ p: 1.5, display: 'flex', flexDirection: 'column', gap: 1, flex: 1 }}>
        <Typography variant="labelLg" sx={{ fontWeight: 700, lineHeight: 1.3 }}>
          {topic.title}
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            fontSize: '0.8rem',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {topic.description}
        </Typography>

        {/* Jurisdiction chips */}
        <Stack direction="row" gap={0.5} flexWrap="wrap">
          {topic.jurisdictions.slice(0, 2).map((j) => (
            <Chip key={j} label={j} size="small" sx={{ fontSize: '0.65rem', height: 18 }} />
          ))}
          {topic.jurisdictions.length > 2 && (
            <Chip label={`+${topic.jurisdictions.length - 2}`} size="small" sx={{ fontSize: '0.65rem', height: 18 }} />
          )}
        </Stack>

        {/* Footer */}
        <Typography variant="caption" color="text.secondary" sx={{ mt: 'auto' }}>
          Updated {new Date(topic.lastUpdated).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
          {' · '}
          {topic.duration} min
        </Typography>
      </Box>
    </Paper>
  );
}

// ─── Module Detail Modal ──────────────────────────────────────────────────────

function ModuleDetailModal({ topic, onClose }: { topic: TrainingTopic; onClose: () => void }) {
  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Stack direction="row" gap={2} alignItems="flex-start">
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 1,
              bgcolor: topic.color,
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography sx={{ color: 'white', fontWeight: 800, fontSize: '0.6rem', textAlign: 'center', lineHeight: 1.2, textTransform: 'uppercase' }}>
              {topic.title.split(' ').slice(0, 2).join('\n')}
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6">{topic.title}</Typography>
            <Stack direction="row" gap={1} mt={0.5} alignItems="center">
              <Chip label={`${topic.duration} min`} size="small" color="primary" />
              <Typography variant="caption" color="text.secondary">{topic.modality}</Typography>
            </Stack>
          </Box>
        </Stack>
      </DialogTitle>
      <DialogContent dividers>
        <Stack gap={2.5}>
          <Box>
            <Typography variant="labelSm" color="text.secondary" gutterBottom>Description</Typography>
            <Typography variant="body1">{topic.description}</Typography>
          </Box>

          <Box>
            <Typography variant="labelSm" color="text.secondary" gutterBottom>Primary Risk Areas</Typography>
            <Stack direction="row" gap={0.5} flexWrap="wrap" mt={0.5}>
              {topic.primaryRisks.map((r) => (
                <Chip key={r} label={r} size="small" />
              ))}
            </Stack>
          </Box>

          <Box>
            <Typography variant="labelSm" color="text.secondary" gutterBottom>Jurisdictions</Typography>
            <Stack direction="row" gap={0.5} flexWrap="wrap" mt={0.5}>
              {topic.jurisdictions.map((j) => (
                <Chip key={j} label={j} size="small" variant="outlined" />
              ))}
            </Stack>
          </Box>

          <Box>
            <Typography variant="labelSm" color="text.secondary" gutterBottom>Delivery Modality</Typography>
            <Typography variant="body1">{topic.modality}</Typography>
          </Box>

          <Box>
            <Typography variant="labelSm" color="text.secondary" gutterBottom>Tags</Typography>
            <Stack direction="row" gap={0.5} flexWrap="wrap" mt={0.5}>
              {topic.tags.map((t) => (
                <Chip key={t} label={t} size="small" variant="outlined" color="primary" sx={{ fontSize: '0.7rem' }} />
              ))}
            </Stack>
          </Box>

          <Box>
            <Typography variant="labelSm" color="text.secondary" gutterBottom>Last Updated</Typography>
            <Typography variant="body1">
              {new Date(topic.lastUpdated).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </Typography>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button variant="outlined" sx={{ color: 'error.main', borderColor: 'error.main' }}>Remove from plan</Button>
      </DialogActions>
    </Dialog>
  );
}

// ─── Booking Widget ───────────────────────────────────────────────────────────

function BookingWidget({
  onConfirm,
}: {
  onConfirm: (slot: string) => void;
}) {
  const [selectedDate, setSelectedDate] = useState(BOOKING_SLOTS[0].date);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showAlt, setShowAlt] = useState(false);

  const dateEntry = BOOKING_SLOTS.find((s) => s.date === selectedDate) ?? BOOKING_SLOTS[0];

  if (showAlt) {
    return (
      <Box sx={{ p: 1.5, bgcolor: 'grey.50', borderRadius: 1, border: '1px solid', borderColor: 'divider', mt: 1 }}>
        <Typography variant="body1" color="text.secondary" sx={{ fontSize: '0.82rem' }}>
          Contact Dave directly at{' '}
          <Typography component="span" sx={{ color: 'primary.main', fontWeight: 600, fontSize: '0.82rem' }}>
            dave.chen@diligent.com
          </Typography>
          {' '}or use the scheduling link in your welcome email.
        </Typography>
        <Button size="small" variant="text" sx={{ mt: 1, p: 0 }} onClick={() => setShowAlt(false)}>
          ← Back to calendar
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 1.5, bgcolor: 'grey.50', borderRadius: 1, border: '1px solid', borderColor: 'divider', mt: 1 }}>
      {/* Dave's profile */}
      <Stack direction="row" gap={1.5} alignItems="center" mb={1.5}>
        <Avatar sx={{ width: 36, height: 36, bgcolor: '#1565C0', fontSize: '0.85rem', fontWeight: 700 }}>DC</Avatar>
        <Box>
          <Typography variant="labelSm" sx={{ fontWeight: 700 }}>Dave Chen</Typography>
          <Typography variant="caption" color="text.secondary">Customer Success Manager · 1-hour call</Typography>
        </Box>
      </Stack>

      {/* Date selector */}
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.75 }}>Select a date</Typography>
      <Stack direction="row" gap={0.75} flexWrap="wrap" mb={1.5}>
        {BOOKING_SLOTS.map((s) => (
          <Chip
            key={s.date}
            label={s.date}
            size="small"
            onClick={() => { setSelectedDate(s.date); setSelectedTime(null); }}
            color={selectedDate === s.date ? 'primary' : 'default'}
            variant={selectedDate === s.date ? 'filled' : 'outlined'}
            sx={{ fontSize: '0.7rem', cursor: 'pointer' }}
          />
        ))}
      </Stack>

      {/* Time slots */}
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.75 }}>
        Available times — {selectedDate}
      </Typography>
      <Stack direction="row" gap={0.75} mb={1.5}>
        {dateEntry.slots.map((t) => (
          <Chip
            key={t}
            label={t}
            size="small"
            onClick={() => setSelectedTime(t)}
            color={selectedTime === t ? 'primary' : 'default'}
            variant={selectedTime === t ? 'filled' : 'outlined'}
            sx={{ cursor: 'pointer' }}
          />
        ))}
      </Stack>

      <Stack direction="row" gap={1} alignItems="center">
        <Button
          size="small"
          variant="contained"
          disabled={!selectedTime}
          onClick={() => selectedTime && onConfirm(`${selectedDate} at ${selectedTime}`)}
        >
          Confirm booking
        </Button>
        <Button size="small" variant="text" onClick={() => setShowAlt(true)} sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
          Find another time
        </Button>
      </Stack>
    </Box>
  );
}

// ─── Chat Panel ───────────────────────────────────────────────────────────────

function ChatPanel({ moduleCount, totalMins }: { moduleCount: number; totalMins: number }) {
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      role: 'ai',
      text: `Your Compliance Training Plan for 2026 is ready — ${moduleCount} modules proposed across 4 jurisdictions, with an estimated completion time of ${formatDuration(totalMins)}. Are you happy with this plan?`,
      actions: ['Looks good', 'Make changes'],
    },
  ]);
  const [input, setInput] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  function handleAction(action: string) {
    const userMsg: ChatMsg = { role: 'user', text: action };
    let aiReply: ChatMsg;

    if (action === 'Looks good') {
      aiReply = {
        role: 'ai',
        text: "Great! To get the most from your plan, would you like to schedule a call with your Customer Success Manager to walk through the details and discuss rollout strategy?",
        actions: ["Yes, schedule a call", "Not right now"],
      };
    } else if (action === 'Yes, schedule a call') {
      aiReply = {
        role: 'ai',
        text: "Here's Dave's availability for the next week — all slots are 1 hour:",
        widget: 'booking',
      };
    } else if (action === 'Not right now') {
      aiReply = {
        role: 'ai',
        text: "No problem — you can always schedule a call later from your account settings. Is there anything else you'd like to adjust in the plan?",
        actions: ['Add a business unit', 'Change a jurisdiction', "I'm done"],
      };
    } else if (action === "I'm done") {
      aiReply = {
        role: 'ai',
        text: "Perfect. Your plan has been saved. You'll receive a summary by email and can access it anytime from this page.",
      };
    } else if (action === 'Make changes') {
      aiReply = {
        role: 'ai',
        text: "Of course — what would you like to adjust? You can modify individual modules directly by clicking on them in the canvas, or I can help you change the scope, jurisdictions, or business unit groupings.",
        actions: ['Add a business unit', 'Change a jurisdiction', 'Remove a module'],
      };
    } else {
      aiReply = {
        role: 'ai',
        text: "Got it. Let me know how you'd like to proceed and I'll update the plan accordingly.",
      };
    }

    setMessages((prev) => [...prev, userMsg, aiReply]);
  }

  function handleSend() {
    if (!input.trim()) return;
    const text = input.trim();
    setInput('');
    setMessages((prev) => [
      ...prev,
      { role: 'user', text },
      {
        role: 'ai',
        text: "Thanks — I've noted that. Let me know if you'd like me to make any further adjustments to the plan.",
        actions: ['Looks good', 'Make more changes'],
      },
    ]);
  }

  function handleBookingConfirm(slot: string) {
    setBookingConfirmed(true);
    setMessages((prev) => [
      ...prev,
      {
        role: 'ai',
        text: `Done! You're booked with Dave for ${slot}. You'll receive a calendar invite shortly. Is there anything else I can help you with?`,
        actions: ["I'm done"],
      },
    ]);
  }

  const lastMsg = messages[messages.length - 1];
  const showActions = lastMsg?.role === 'ai' && lastMsg.actions && !bookingConfirmed;
  const showBooking = messages.some((m) => m.widget === 'booking') && !bookingConfirmed;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 0 }}>
      {/* Messages */}
      <Box ref={scrollRef} sx={{ flex: 1, overflow: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {messages.map((msg, i) => (
          <Box key={i}>
            {msg.role === 'ai' ? (
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                <Avatar sx={{ width: 28, height: 28, bgcolor: 'primary.main', fontSize: '0.65rem', fontWeight: 700, flexShrink: 0, mt: 0.25 }}>AI</Avatar>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ bgcolor: 'grey.100', borderRadius: '4px 12px 12px 12px', px: 1.5, py: 1 }}>
                    <Typography variant="body1" sx={{ fontSize: '0.82rem', lineHeight: 1.5 }}>
                      {msg.text}
                    </Typography>
                  </Box>
                  {msg.widget === 'booking' && !bookingConfirmed && (
                    <BookingWidget onConfirm={handleBookingConfirm} />
                  )}
                </Box>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Box sx={{ bgcolor: 'primary.main', borderRadius: '12px 4px 12px 12px', px: 1.5, py: 1, maxWidth: '80%' }}>
                  <Typography variant="body1" sx={{ color: 'white', fontSize: '0.82rem', lineHeight: 1.5 }}>
                    {msg.text}
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        ))}
      </Box>

      <Divider />

      {/* Suggested actions */}
      {showActions && (
        <Stack direction="row" gap={0.75} p={1} flexWrap="wrap" sx={{ bgcolor: 'background.paper' }}>
          {lastMsg.actions!.map((a) => (
            <Chip
              key={a}
              label={a}
              size="small"
              variant="outlined"
              color="primary"
              onClick={() => handleAction(a)}
              sx={{ cursor: 'pointer', fontSize: '0.75rem' }}
            />
          ))}
        </Stack>
      )}

      {/* Booking pending hint */}
      {showBooking && !bookingConfirmed && (
        <Box sx={{ px: 1.5, pb: 0.5 }}>
          <Typography variant="caption" color="text.secondary">Select a date and time above to confirm.</Typography>
        </Box>
      )}

      {/* Input */}
      <Box sx={{ p: 1.5, display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Ask a question or request a change…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
          sx={{ '& .MuiInputBase-input': { fontSize: '0.82rem' } }}
        />
        <Button size="small" variant="contained" onClick={handleSend} disabled={!input.trim()} sx={{ flexShrink: 0 }}>
          Send
        </Button>
      </Box>
    </Box>
  );
}

// ─── Canvas Panel ─────────────────────────────────────────────────────────────

function CanvasPanel({ scope, selectedGroups }: { scope: 'global' | 'groups'; selectedGroups: string[] }) {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedModule, setSelectedModule] = useState<TrainingTopic | null>(null);

  const tabs: { key: BUKey | 'all'; label: string }[] =
    scope === 'global'
      ? [{ key: 'all', label: 'All modules' }]
      : [
          { key: 'all', label: 'All modules' },
          ...selectedGroups.map((g) => {
            const bu = BUSINESS_UNITS.find((b) => b.key === g)!;
            return { key: bu.key, label: bu.label };
          }),
        ];

  const currentTab = tabs[activeTab] ?? tabs[0];
  const groupTopics =
    currentTab.key === 'all'
      ? TOPICS.map((t) => ({ topic: t, inPlan: true }))
      : TOPICS.map((t) => ({
          topic: t,
          inPlan: t.inScope.includes('all') || t.inScope.includes(currentTab.key),
        }));

  const groupDuration = groupTopics.filter((g) => g.inPlan).reduce((s, g) => s + g.topic.duration, 0);
  const inPlanCount = groupTopics.filter((g) => g.inPlan).length;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Stats bar */}
      <Paper
        variant="outlined"
        sx={{ borderRadius: 1, p: 2, mb: 2, display: 'flex', gap: 3, flexWrap: 'wrap', flexShrink: 0 }}
      >
        {[
          { label: 'Modules in plan', value: currentTab.key === 'all' ? String(TOPICS.length) : `${inPlanCount} / ${TOPICS.length}` },
          { label: 'Estimated completion', value: formatDuration(currentTab.key === 'all' ? TOTAL_DURATION : groupDuration) },
          { label: 'Jurisdictions', value: '4' },
          { label: 'Business units', value: scope === 'global' ? 'Org-wide' : String(selectedGroups.length) },
        ].map((s) => (
          <Box key={s.label}>
            <Typography variant="labelXs" color="text.secondary">{s.label}</Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.2 }}>{s.value}</Typography>
          </Box>
        ))}
      </Paper>

      {/* Tabs */}
      {tabs.length > 1 && (
        <Tabs
          value={activeTab}
          onChange={(_, v) => setActiveTab(v)}
          sx={{ borderBottom: 1, borderColor: 'divider', mb: 2, flexShrink: 0 }}
          variant="scrollable"
          scrollButtons="auto"
        >
          {tabs.map((t, i) => (
            <Tab key={t.key} label={t.label} id={`tab-${i}`} />
          ))}
        </Tabs>
      )}

      {/* Module grid */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {currentTab.key !== 'all' && groupTopics.some((g) => !g.inPlan) && (
          <Stack direction="row" gap={1} alignItems="center" mb={1.5}>
            <Typography variant="caption" color="text.secondary">
              {inPlanCount} modules in plan · {TOPICS.length - inPlanCount} excluded (greyed)
            </Typography>
          </Stack>
        )}

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 1.5,
          }}
        >
          {groupTopics.map(({ topic, inPlan }) => (
            <ModuleCard
              key={topic.id}
              topic={topic}
              inPlan={inPlan}
              onClick={() => setSelectedModule(topic)}
            />
          ))}
        </Box>
      </Box>

      {selectedModule && (
        <ModuleDetailModal topic={selectedModule} onClose={() => setSelectedModule(null)} />
      )}
    </Box>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function TrainingPlanPage() {
  const [phase, setPhase] = useState<PlanPhase>('wizard-1');
  const [scope, setScope] = useState<'global' | 'groups'>('global');
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [genStage, setGenStage] = useState(0);
  const [genProgress, setGenProgress] = useState(0);

  // Generating animation
  useEffect(() => {
    if (phase !== 'generating') return;
    setGenStage(0);
    setGenProgress(0);

    const steps = [
      { progress: 25, stage: 0 },
      { progress: 55, stage: 1 },
      { progress: 80, stage: 2 },
      { progress: 100, stage: 3 },
    ];
    let i = 0;

    const advance = () => {
      if (i >= steps.length) {
        setTimeout(() => setPhase('canvas'), 400);
        return;
      }
      setGenProgress(steps[i].progress);
      setGenStage(steps[i].stage);
      i++;
      if (i < steps.length) setTimeout(advance, 900);
      else setTimeout(() => { setGenProgress(100); setTimeout(() => setPhase('canvas'), 400); }, 900);
    };

    const t = setTimeout(advance, 300);
    return () => clearTimeout(t);
  }, [phase]);

  function toggleGroup(key: string) {
    setSelectedGroups((prev) => prev.includes(key) ? prev.filter((g) => g !== key) : [...prev, key]);
  }

  const moduleCount = TOPICS.length;
  const totalMins = TOTAL_DURATION;

  return (
    <PageLayout>
      <PageHeader
        pageTitle="Compliance Training Plan"
        pageSubtitle={phase === 'canvas' ? 'Q1–Q4 2026 · Acme Corp' : 'Generate a tailored training plan for your organisation'}
        breadcrumbs={
          <OverflowBreadcrumbs
            leadingElement={<span>Connected Compliance</span>}
            items={[{ id: 'training-plan', label: 'Training Plan', url: '/training-plan' }]}
            hideLastItem
            aria-label="Breadcrumbs"
          >
            {({ label, url }) => <NavLink to={url}>{label}</NavLink>}
          </OverflowBreadcrumbs>
        }
        buttonArray={
          phase === 'canvas' ? (
            <Stack direction="row" gap={1}>
              <Button variant="outlined" size="small">Export plan</Button>
              <Button variant="text" size="small" onClick={() => setPhase('wizard-1')}>Regenerate</Button>
            </Stack>
          ) : undefined
        }
      />

      {/* ── Wizard Step 1: Org context ───────────────────────────────── */}
      {phase === 'wizard-1' && (
        <Box sx={{ maxWidth: 540, mx: 'auto', mt: 4 }}>
          <Paper variant="outlined" sx={{ borderRadius: 2, p: 3 }}>
            <SectionHeader title="Confirm organisation details" subtitle="We've pre-filled this from your Connected Compliance settings. Adjust anything that looks wrong." />
            <Stack gap={2} mt={2}>
              {[
                { label: 'Organisation name', value: ORG.name },
                { label: 'Industry', value: ORG.industry },
                { label: 'Employees', value: ORG.size },
              ].map(({ label, value }) => (
                <Box key={label}>
                  <Typography variant="labelSm" color="text.secondary">{label}</Typography>
                  <Typography variant="body1" sx={{ mt: 0.25 }}>{value}</Typography>
                </Box>
              ))}

              <Box>
                <Typography variant="labelSm" color="text.secondary">Jurisdictions</Typography>
                <Stack direction="row" gap={0.75} flexWrap="wrap" mt={0.75}>
                  {ORG.jurisdictions.map((j) => (
                    <Chip key={j} label={j} size="small" onDelete={() => {}} />
                  ))}
                  <Chip label="+ Add" size="small" variant="outlined" color="primary" onClick={() => {}} sx={{ cursor: 'pointer' }} />
                </Stack>
              </Box>
            </Stack>

            <Stack direction="row" justifyContent="flex-end" mt={3}>
              <Button variant="contained" onClick={() => setPhase('wizard-2')}>
                Looks right, continue →
              </Button>
            </Stack>
          </Paper>
        </Box>
      )}

      {/* ── Wizard Step 2: Scope ─────────────────────────────────────── */}
      {phase === 'wizard-2' && (
        <Box sx={{ maxWidth: 540, mx: 'auto', mt: 4 }}>
          <Paper variant="outlined" sx={{ borderRadius: 2, p: 3 }}>
            <SectionHeader title="Plan scope" subtitle="Choose whether to generate a single plan for the whole organisation or separate plans per business unit." />
            <RadioGroup value={scope} onChange={(e) => setScope(e.target.value as 'global' | 'groups')} sx={{ mt: 1, gap: 1 }}>
              {([
                { key: 'global' as const, label: 'Global plan', desc: 'One training plan covering all employees across the organisation.' },
                { key: 'groups' as const, label: 'Group plans', desc: 'Separate plans tailored for each selected business unit.' },
              ] as const).map((opt) => (
                <FormControlLabel
                  key={opt.key}
                  value={opt.key}
                  control={<Radio size="small" />}
                  label={
                    <Box sx={{ py: 0.5 }}>
                      <Typography variant="labelLg" sx={{ fontWeight: 600 }}>{opt.label}</Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ fontSize: '0.85rem' }}>{opt.desc}</Typography>
                    </Box>
                  }
                  sx={{ alignItems: 'flex-start', m: 0 }}
                />
              ))}
            </RadioGroup>

            <Stack direction="row" justifyContent="space-between" mt={3}>
              <Button variant="text" onClick={() => setPhase('wizard-1')}>← Back</Button>
              <Button
                variant="contained"
                onClick={() => scope === 'groups' ? setPhase('wizard-2b') : setPhase('generating')}
              >
                {scope === 'groups' ? 'Select business units →' : 'Generate plan'}
              </Button>
            </Stack>
          </Paper>
        </Box>
      )}

      {/* ── Wizard Step 2b: Group selection ─────────────────────────── */}
      {phase === 'wizard-2b' && (
        <Box sx={{ maxWidth: 540, mx: 'auto', mt: 4 }}>
          <Paper variant="outlined" sx={{ borderRadius: 2, p: 3 }}>
            <SectionHeader
              title="Select business units"
              subtitle="Choose the groups you want to generate separate training plans for."
            />
            <FormGroup sx={{ mt: 2, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0.5 }}>
              {BUSINESS_UNITS.map((bu) => (
                <FormControlLabel
                  key={bu.key}
                  control={
                    <Checkbox
                      checked={selectedGroups.includes(bu.key)}
                      onChange={() => toggleGroup(bu.key)}
                      size="small"
                    />
                  }
                  label={<Typography variant="body1" sx={{ fontSize: '0.875rem' }}>{bu.label}</Typography>}
                />
              ))}
            </FormGroup>

            <Stack direction="row" justifyContent="space-between" mt={3}>
              <Button variant="text" onClick={() => setPhase('wizard-2')}>← Back</Button>
              <Button
                variant="contained"
                disabled={selectedGroups.length === 0}
                onClick={() => setPhase('generating')}
              >
                Generate plan ({selectedGroups.length} groups)
              </Button>
            </Stack>
          </Paper>
        </Box>
      )}

      {/* ── Generating ──────────────────────────────────────────────── */}
      {phase === 'generating' && (
        <Box sx={{ maxWidth: 480, mx: 'auto', mt: 8, textAlign: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>Building your training plan…</Typography>
          <Typography variant="body1" color="text.secondary" mb={4}>
            {GENERATING_STAGES[genStage]}
          </Typography>
          <LinearProgress variant="determinate" value={genProgress} sx={{ borderRadius: 1, height: 6 }} />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>{genProgress}%</Typography>
        </Box>
      )}

      {/* ── Canvas ──────────────────────────────────────────────────── */}
      {phase === 'canvas' && (
        <Box sx={{ display: 'flex', gap: 2, flex: 1, minHeight: 0, mt: 1 }}>
          {/* Chat — 1/3 */}
          <Paper
            variant="outlined"
            sx={{
              width: '33%',
              flexShrink: 0,
              borderRadius: 1,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              height: 'calc(100vh - 180px)',
            }}
          >
            <Box sx={{ px: 2, pt: 1.5, pb: 1, borderBottom: 1, borderColor: 'divider' }}>
              <Typography variant="labelSm" sx={{ fontWeight: 700 }}>Plan assistant</Typography>
            </Box>
            <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
              <ChatPanel moduleCount={moduleCount} totalMins={totalMins} />
            </Box>
          </Paper>

          {/* Canvas — 2/3 */}
          <Box sx={{ flex: 1, minWidth: 0, height: 'calc(100vh - 180px)', display: 'flex', flexDirection: 'column' }}>
            <CanvasPanel scope={scope} selectedGroups={selectedGroups} />
          </Box>
        </Box>
      )}
    </PageLayout>
  );
}
