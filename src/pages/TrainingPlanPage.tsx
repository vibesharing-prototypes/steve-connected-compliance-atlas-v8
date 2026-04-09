import { PageHeader } from '@diligentcorp/atlas-react-bundle';
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Drawer,
  IconButton,
  LinearProgress,
  Paper,
  Radio,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';

import PageLayout from '../components/PageLayout.js';
import { BOOKING_SLOTS, BUSINESS_UNITS, BUKey, TOPICS, TOTAL_DURATION, TrainingTopic } from '../data/trainingTopics.js';

// ─── Types ────────────────────────────────────────────────────────────────────

type Phase = 'setup' | 'generating' | 'canvas';
type ChatStep = 'org-confirm' | 'products' | 'scope' | 'bu-select' | 'plan-chat';

interface ChatMsg {
  role: 'ai' | 'user';
  text: string;
  time?: string;
  widget?: 'org-confirm' | 'product-select' | 'scope-select' | 'bu-select' | 'booking';
  actions?: string[];
  signals?: Array<{ product: string; modules: string[] }>;
}

function nowTime() {
  return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ORG = {
  name: 'Acme Corp',
  size: '2,500 employees',
  industry: 'Technology',
  jurisdictions: ['United States', 'European Union', 'United Kingdom', 'Australia'],
};

const DILIGENT_PRODUCTS = [
  { key: 'boards', label: 'Diligent Boards', desc: 'Board meeting and governance signals' },
  { key: 'audit', label: 'Audit Management', desc: 'Audit findings and control deficiencies' },
  { key: 'risk', label: 'Risk & Controls', desc: 'Risk register and control assessment data' },
  { key: 'policy', label: 'Policy Management', desc: 'Policy attestation and acknowledgement gaps' },
  { key: 'whistleblower', label: 'Vault', desc: 'Hotline report trends and themes' },
  { key: 'entity', label: 'Entity Management', desc: 'Entity structure and jurisdictional obligations' },
];


const PRODUCT_SIGNALS: Record<string, { label: string; modules: string[] }> = {
  whistleblower: {
    label: 'Vault',
    modules: ['Speak Up', 'Non-Retaliation', 'Anti-Harassment & Bullying'],
  },
  policy: {
    label: 'Policy Management',
    modules: ['AI Acceptable Use', 'Conflicts of Interest', 'Respectful Workplace'],
  },
  audit: {
    label: 'Audit Management',
    modules: ['Fraud Awareness', 'Third-Party Expectations'],
  },
  risk: {
    label: 'Risk & Controls',
    modules: ['Insider Trading', 'Trade Compliance'],
  },
  boards: {
    label: 'Diligent Boards',
    modules: ['Ethical Decision-Making', 'Manager Responsibilities'],
  },
  entity: {
    label: 'Entity Management',
    modules: ['Modern Slavery Prevention'],
  },
};

const GENERATING_STAGES = [
  'Analysing org profile…',
  'Matching topics to risk areas…',
  'Tailoring to selected jurisdictions…',
  'Building training plan…',
];

const CHAT_STEP_ORDER: ChatStep[] = ['org-confirm', 'products', 'scope', 'bu-select', 'plan-chat'];

function formatDuration(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m > 0 ? `${m}min` : ''}`.trim() : `${m}min`;
}

// ─── Conversation Card Widgets ─────────────────────────────────────────────────

// Pill chip used for AI-style action/toggle buttons
function ActionChip({ label, selected, onClick }: { label: string; selected?: boolean; onClick: () => void }) {
  return (
    <Chip
      label={label}
      onClick={onClick}
      variant={selected ? 'filled' : 'outlined'}
      color={selected ? 'primary' : 'default'}
      size="small"
      sx={{ cursor: 'pointer', fontSize: '0.78rem', borderRadius: '99px' }}
    />
  );
}

function OrgConfirmWidget({ answered, onConfirm }: { answered: boolean; onConfirm: () => void }) {
  if (answered) return null;
  return (
    <Box sx={{ mt: 1 }}>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, lineHeight: 1.6 }}>
        <strong>{ORG.name}</strong> · {ORG.industry} · {ORG.size}<br />
        Jurisdictions: {ORG.jurisdictions.join(', ')}
      </Typography>
      <Stack direction="row" gap={0.75} flexWrap="wrap">
        <ActionChip label="Looks right →" onClick={onConfirm} />
        <ActionChip label="Edit details" onClick={() => {}} />
      </Stack>
    </Box>
  );
}

function ProductSelectWidget({
  answered,
  selectedKeys,
  onConfirm,
}: {
  answered: boolean;
  selectedKeys: string[];
  onConfirm: (keys: string[]) => void;
}) {
  const [selected, setSelected] = useState<string[]>([]);

  if (answered) return null;

  function toggle(key: string) {
    setSelected((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  }

  return (
    <Box sx={{ mt: 1 }}>
      <Stack gap={0.75} mb={1.5}>
        {DILIGENT_PRODUCTS.map((p) => {
          const isSelected = selected.includes(p.key);
          return (
            <Box
              key={p.key}
              onClick={() => toggle(p.key)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                px: 1.5,
                py: 0.75,
                borderRadius: 1.5,
                bgcolor: isSelected ? 'rgba(25,118,210,0.06)' : 'transparent',
                cursor: 'pointer',
                transition: 'background 0.15s',
                '&:hover': { bgcolor: 'rgba(25,118,210,0.04)' },
              }}
            >
              <Checkbox
                checked={isSelected}
                size="small"
                disableRipple
                sx={{ p: 0, pointerEvents: 'none' }}
              />
              <Typography variant="body1" sx={{ fontSize: '0.8rem', fontWeight: 600, lineHeight: 1.3 }}>
                {p.label}
              </Typography>
            </Box>
          );
        })}
      </Stack>
      <ActionChip
        label={selected.length > 0 ? `Include ${selected.length} product${selected.length > 1 ? 's' : ''} →` : 'Continue without →'}
        onClick={() => onConfirm(selected)}
      />
    </Box>
  );
}

function ScopeSelectWidget({
  answered,
  selectedScope,
  onConfirm,
}: {
  answered: boolean;
  selectedScope: 'global' | 'groups';
  onConfirm: (scope: 'global' | 'groups', groups: string[]) => void;
}) {
  const [scope, setScope] = useState<'global' | 'groups'>('global');
  const [selectedBUs, setSelectedBUs] = useState<string[]>([]);

  if (answered) return null;

  function toggleBU(key: string) {
    setSelectedBUs((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  }

  const canConfirm = scope === 'global' || selectedBUs.length > 0;

  return (
    <Box sx={{ mt: 1 }}>
      <Stack gap={0.75} mb={1.5}>
        {(['global', 'groups'] as const).map((option) => {
          const isSelected = scope === option;
          const label = option === 'global' ? 'Global plan' : 'Group plans';
          return (
            <Box
              key={option}
              onClick={() => setScope(option)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                px: 1.5,
                py: 0.75,
                borderRadius: 1.5,
                bgcolor: isSelected ? 'rgba(25,118,210,0.06)' : 'transparent',
                cursor: 'pointer',
                transition: 'background 0.15s',
                '&:hover': { bgcolor: 'rgba(25,118,210,0.04)' },
              }}
            >
              <Radio
                checked={isSelected}
                size="small"
                disableRipple
                sx={{ p: 0, pointerEvents: 'none' }}
              />
              <Typography variant="body1" sx={{ fontSize: '0.8rem', fontWeight: 600, lineHeight: 1.3 }}>
                {label}
              </Typography>
            </Box>
          );
        })}
      </Stack>

      {scope === 'groups' && (
        <Stack gap={0.75} mb={1.5}>
          {BUSINESS_UNITS.map((bu) => {
            const isSelected = selectedBUs.includes(bu.key);
            return (
              <Box
                key={bu.key}
                onClick={() => toggleBU(bu.key)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 1.5,
                  py: 0.75,
                  borderRadius: 1.5,
                  bgcolor: isSelected ? 'rgba(25,118,210,0.06)' : 'transparent',
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                  '&:hover': { bgcolor: 'rgba(25,118,210,0.04)' },
                }}
              >
                <Checkbox
                  checked={isSelected}
                  size="small"
                  disableRipple
                  sx={{ p: 0, pointerEvents: 'none' }}
                />
                <Typography variant="body1" sx={{ fontSize: '0.8rem', fontWeight: 600, lineHeight: 1.3 }}>
                  {bu.label}
                </Typography>
              </Box>
            );
          })}
        </Stack>
      )}

      <ActionChip
        label={scope === 'global' ? 'Generate plan →' : selectedBUs.length > 0 ? `Generate plan (${selectedBUs.length} groups) →` : 'Select at least one group'}
        onClick={() => canConfirm && onConfirm(scope, selectedBUs)}
      />
    </Box>
  );
}

// ─── Module Card ──────────────────────────────────────────────────────────────

function ModuleCard({ topic, inPlan, onClick, onRemove }: { topic: TrainingTopic; inPlan: boolean; onClick: () => void; onRemove: () => void }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 1,
        overflow: 'hidden',
        opacity: inPlan ? 1 : 0.38,
        transition: 'box-shadow 0.15s',
        '&:hover': inPlan ? { boxShadow: 3 } : {},
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ p: 1.5, display: 'flex', flexDirection: 'column', gap: 0.75, flex: 1 }}>
        {/* Header row: title + X */}
        <Stack direction="row" alignItems="flex-start" gap={0.5}>
          <Typography
            variant="labelLg"
            sx={{ fontWeight: 700, lineHeight: 1.3, flex: 1, cursor: 'pointer' }}
            onClick={onClick}
          >
            {topic.title}
          </Typography>
          {inPlan && (
            <Box
              component="button"
              onClick={(e) => { e.stopPropagation(); onRemove(); }}
              aria-label={`Remove ${topic.title}`}
              sx={{
                border: 'none',
                bgcolor: 'transparent',
                cursor: 'pointer',
                color: 'text.disabled',
                p: 0,
                lineHeight: 1,
                fontSize: '1rem',
                flexShrink: 0,
                mt: 0.1,
                '&:hover': { color: 'text.primary' },
              }}
            >
              ×
            </Box>
          )}
        </Stack>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ fontSize: '0.8rem', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', cursor: 'pointer' }}
          onClick={onClick}
        >
          {topic.description}
        </Typography>

        <Stack direction="row" gap={0.5} flexWrap="wrap">
          {topic.jurisdictions.slice(0, 2).map((j) => (
            <Chip key={j} label={j} size="small" sx={{ fontSize: '0.65rem', height: 18 }} />
          ))}
          {topic.jurisdictions.length > 2 && (
            <Chip label={`+${topic.jurisdictions.length - 2}`} size="small" sx={{ fontSize: '0.65rem', height: 18 }} />
          )}
        </Stack>

        <Typography variant="caption" color="text.secondary">{topic.duration} min · {topic.modality}</Typography>
      </Box>
    </Paper>
  );
}

// ─── Module Detail Panel ──────────────────────────────────────────────────────

function ModuleDetailPanel({ topic, onClose }: { topic: TrainingTopic | null; onClose: () => void }) {
  return (
    <Drawer
      anchor="right"
      open={!!topic}
      onClose={onClose}
      slotProps={{
        backdrop: { invisible: true },
        paper: {
          sx: {
            width: 400,
            p: 3,
            boxShadow: '-4px 0 24px rgba(0,0,0,0.10)',
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          },
        },
      }}
    >
      {topic && (
        <>
          {/* Header */}
          <Stack direction="row" alignItems="flex-start" justifyContent="space-between" gap={1}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.3 }}>{topic.title}</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5, fontSize: '0.875rem' }}>
                {topic.duration} min · {topic.modality}
              </Typography>
            </Box>
            <IconButton size="small" onClick={onClose} aria-label="Close" sx={{ mt: -0.5, mr: -1 }}>
              ×
            </IconButton>
          </Stack>

          <Divider />

          {/* Content */}
          <Stack gap={2.5}>
            <Box>
              <Typography variant="overline" color="text.secondary" display="block" sx={{ mb: 0.5 }}>Description</Typography>
              <Typography variant="body1" sx={{ fontSize: '0.875rem', lineHeight: 1.7 }}>{topic.description}</Typography>
            </Box>
            <Box>
              <Typography variant="overline" color="text.secondary" display="block" sx={{ mb: 0.5 }}>Primary Risk Areas</Typography>
              <Stack direction="row" gap={0.75} flexWrap="wrap">
                {topic.primaryRisks.map((r) => (
                  <Chip key={r} label={r} size="small" sx={{ fontSize: '0.72rem' }} />
                ))}
              </Stack>
            </Box>
            <Box>
              <Typography variant="overline" color="text.secondary" display="block" sx={{ mb: 0.5 }}>Jurisdictions</Typography>
              <Stack direction="row" gap={0.75} flexWrap="wrap">
                {topic.jurisdictions.map((j) => (
                  <Chip key={j} label={j} size="small" variant="outlined" sx={{ fontSize: '0.72rem' }} />
                ))}
              </Stack>
            </Box>
            <Box>
              <Typography variant="overline" color="text.secondary" display="block" sx={{ mb: 0.5 }}>Tags</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontSize: '0.875rem' }}>{topic.tags.join(' · ')}</Typography>
            </Box>
            <Box>
              <Typography variant="overline" color="text.secondary" display="block" sx={{ mb: 0.5 }}>Last Updated</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontSize: '0.875rem' }}>{topic.lastUpdated}</Typography>
            </Box>
          </Stack>
        </>
      )}
    </Drawer>
  );
}

// ─── Booking Widget ───────────────────────────────────────────────────────────

function BookingWidget({ onConfirm }: { onConfirm: (slot: string) => void }) {
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
          </Typography>{' '}
          or use the scheduling link in your welcome email.
        </Typography>
        <Button size="small" variant="text" sx={{ mt: 1, p: 0 }} onClick={() => setShowAlt(false)}>
          ← Back to calendar
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 1.5, bgcolor: 'grey.50', borderRadius: 1, border: '1px solid', borderColor: 'divider', mt: 1 }}>
      <Stack direction="row" gap={1.5} alignItems="center" mb={1.5}>
        <Avatar sx={{ width: 36, height: 36, bgcolor: '#1565C0', fontSize: '0.85rem', fontWeight: 700 }}>DC</Avatar>
        <Box>
          <Typography variant="labelSm" sx={{ fontWeight: 700 }}>Dave Chen</Typography>
          <Typography variant="caption" color="text.secondary">Customer Success Manager · 1-hour call</Typography>
        </Box>
      </Stack>

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
        <Button size="small" variant="contained" disabled={!selectedTime} onClick={() => selectedTime && onConfirm(`${selectedDate} at ${selectedTime}`)}>
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

function ChatPanel({ phase, onGenerate }: { phase: Phase; onGenerate: (scope: 'global' | 'groups', groups: string[]) => void }) {
  const [chatStep, setChatStep] = useState<ChatStep>('org-confirm');
  const [messages, setMessages] = useState<ChatMsg[]>(() => [
    {
      role: 'ai',
      text: "Hi! I'll help you build a 2026 compliance training plan for your organisation. First, let me confirm your details look right.",
      time: nowTime(),
      widget: 'org-confirm',
    },
  ]);
  const [products, setProducts] = useState<string[]>([]);
  const [scope, setScope] = useState<'global' | 'groups'>('global');
  const [input, setInput] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevPhaseRef = useRef<Phase>(phase);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  // When generating completes, add the plan-ready message
  useEffect(() => {
    if (prevPhaseRef.current !== 'canvas' && phase === 'canvas') {
      const signals = products
        .filter((p) => PRODUCT_SIGNALS[p])
        .map((p) => ({ product: PRODUCT_SIGNALS[p].label, modules: PRODUCT_SIGNALS[p].modules }));

      const hasSignals = signals.length > 0;

      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          text: hasSignals
            ? `Your plan is ready — ${TOPICS.length} modules across 4 jurisdictions, est. ${formatDuration(TOTAL_DURATION)} total.\n\nI've pulled in signals from your connected products to prioritise the modules most relevant to your current risk landscape:`
            : `Your plan is ready — ${TOPICS.length} modules across 4 jurisdictions, est. ${formatDuration(TOTAL_DURATION)} total. Are you happy with it?`,
          signals: hasSignals ? signals : undefined,
          actions: ['Looks good', 'Make changes'],
        },
      ]);
    }
    prevPhaseRef.current = phase;
  }, [phase, products]);

  function isWidgetAnswered(widget: ChatMsg['widget']): boolean {
    const widgetStep: Record<string, ChatStep> = {
      'org-confirm': 'org-confirm',
      'product-select': 'products',
      'scope-select': 'scope',
      'bu-select': 'bu-select',
    };
    if (!widget || !(widget in widgetStep)) return false;
    const currentIdx = CHAT_STEP_ORDER.indexOf(chatStep);
    const widgetIdx = CHAT_STEP_ORDER.indexOf(widgetStep[widget]);
    return currentIdx > widgetIdx;
  }

  function addMsgs(...msgs: ChatMsg[]) {
    const t = nowTime();
    setMessages((prev) => [...prev, ...msgs.map((m) => ({ ...m, time: m.time ?? t }))]);
  }

  function handleOrgConfirm() {
    setChatStep('products');
    addMsgs(
      { role: 'user', text: 'Looks right, continue.' },
      {
        role: 'ai',
        text: 'Would you like to include signals from your other Diligent products? This helps us tailor the plan to your actual risk landscape.',
        widget: 'product-select',
      },
    );
  }

  function handleProductsConfirm(keys: string[]) {
    setProducts(keys);
    setChatStep('scope');
    const labels = DILIGENT_PRODUCTS.filter((p) => keys.includes(p.key)).map((p) => p.label);
    addMsgs(
      { role: 'user', text: keys.length > 0 ? `Include: ${labels.join(', ')}.` : 'No additional product signals.' },
      {
        role: 'ai',
        text:
          keys.length > 0
            ? `Got it — I'll pull in signals from ${labels.join(', ')} to enrich your recommendations. How would you like to scope this plan?`
            : "No problem — we'll build from your org profile and compliance obligations. How would you like to scope this plan?",
        widget: 'scope-select',
      },
    );
  }

  function handleScopeConfirm(selectedScope: 'global' | 'groups', selectedGroups: string[]) {
    setScope(selectedScope);
    setChatStep('plan-chat');
    if (selectedScope === 'global') {
      addMsgs(
        { role: 'user', text: 'Global plan — all employees.' },
        { role: 'ai', text: "Perfect. Generating your 2026 compliance training plan now — this will only take a moment." },
      );
      onGenerate('global', []);
    } else {
      const labels = BUSINESS_UNITS.filter((b) => selectedGroups.includes(b.key)).map((b) => b.label);
      addMsgs(
        { role: 'user', text: `Group plans: ${labels.join(', ')}.` },
        { role: 'ai', text: `Generating separate plans for ${labels.join(', ')} — this will only take a moment.` },
      );
      onGenerate('groups', selectedGroups);
    }
  }

  function handlePlanAction(action: string) {
    let aiReply: ChatMsg;
    if (action === 'Looks good') {
      aiReply = {
        role: 'ai',
        text: 'Great! Would you like to schedule a call with your Customer Success Manager to walk through the plan and discuss rollout?',
        actions: ['Yes, schedule a call', 'Not right now'],
      };
    } else if (action === 'Yes, schedule a call') {
      aiReply = { role: 'ai', text: "Here's Dave's availability for the next week — all slots are 1 hour:", widget: 'booking' };
    } else if (action === 'Not right now') {
      aiReply = {
        role: 'ai',
        text: "No problem — you can schedule a call anytime from your account settings. Anything else to adjust?",
        actions: ['Add a business unit', 'Change a jurisdiction', "I'm done"],
      };
    } else if (action === "I'm done") {
      aiReply = { role: 'ai', text: "Your plan has been saved. You'll receive a summary by email and can access it anytime from this page." };
    } else if (action === 'Make changes') {
      aiReply = {
        role: 'ai',
        text: "What would you like to adjust? Click any module in the canvas to edit it, or tell me what you need here.",
        actions: ['Add a business unit', 'Change a jurisdiction', 'Remove a module'],
      };
    } else {
      aiReply = { role: 'ai', text: "Got it — let me know how you'd like to proceed and I'll update the plan." };
    }
    addMsgs({ role: 'user', text: action }, aiReply);
  }

  function handleSend() {
    if (!input.trim()) return;
    const text = input.trim();
    setInput('');
    addMsgs(
      { role: 'user', text },
      {
        role: 'ai',
        text: "Thanks — I've noted that. Let me know if you'd like any further adjustments.",
        actions: ['Looks good', 'Make changes'],
      },
    );
  }

  function handleBookingConfirm(slot: string) {
    setBookingConfirmed(true);
    addMsgs({
      role: 'ai',
      text: `Done! You're booked with Dave for ${slot}. You'll receive a calendar invite shortly.`,
      actions: ["I'm done"],
    });
  }

  const lastMsg = messages[messages.length - 1];
  const isPlanChat = chatStep === 'plan-chat';
  const showActions = isPlanChat && phase === 'canvas' && lastMsg?.role === 'ai' && lastMsg.actions && !bookingConfirmed;

  const hasWidget = (msg: ChatMsg) => !!msg.widget || (msg.actions && msg.actions.length > 0);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Messages */}
      <Box ref={scrollRef} sx={{ flex: 1, overflow: 'auto', px: 3, py: 2.5, display: 'flex', flexDirection: 'column', gap: 3 }}>
        {messages.map((msg, i) => (
          <Box key={i}>
            {msg.role === 'ai' ? (
              <Box>
                {/* Header: avatar + name + time */}
                <Stack direction="row" gap={1.5} alignItems="center" mb={1}>
                  <Avatar sx={{ width: 36, height: 36, bgcolor: '#C4B5FD', color: '#4C1D95', fontSize: '0.65rem', fontWeight: 800, flexShrink: 0 }}>
                    AI
                  </Avatar>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 700, fontSize: '0.875rem', lineHeight: 1.2 }}>
                      Plan assistant
                    </Typography>
                    {msg.time && (
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.72rem' }}>
                        {msg.time}
                      </Typography>
                    )}
                  </Box>
                </Stack>

                {/* Message text */}
                <Typography variant="body1" sx={{ fontSize: '0.875rem', lineHeight: 1.6, mb: (msg.signals || hasWidget(msg)) ? 1.5 : 0, whiteSpace: 'pre-line' }}>
                  {msg.text}
                </Typography>

                {/* Product signal callouts */}
                {msg.signals && msg.signals.length > 0 && (
                  <Stack gap={1} mb={hasWidget(msg) ? 1.5 : 0}>
                    {msg.signals.map((sig) => (
                      <Box
                        key={sig.product}
                        sx={{
                          borderRadius: 1.5,
                          px: 1.5,
                          py: 1,
                          background: 'linear-gradient(135deg, rgba(196,181,253,0.15) 0%, rgba(167,139,250,0.08) 100%)',
                          border: '1px solid rgba(196,181,253,0.3)',
                        }}
                      >
                        <Typography variant="body1" sx={{ fontSize: '0.75rem', fontWeight: 700, mb: 0.25 }}>
                          {sig.product}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ fontSize: '0.75rem', lineHeight: 1.5 }}>
                          Informed: {sig.modules.join(', ')}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                )}

                {/* Widget card with subtle gradient */}
                {hasWidget(msg) && (
                  <Box
                    sx={{
                      borderRadius: 2,
                      p: 2,
                      background: 'linear-gradient(135deg, rgba(196,181,253,0.15) 0%, rgba(167,139,250,0.08) 100%)',
                      border: '1px solid rgba(196,181,253,0.3)',
                    }}
                  >
                    {msg.widget === 'org-confirm' && (
                      <OrgConfirmWidget answered={isWidgetAnswered('org-confirm')} onConfirm={handleOrgConfirm} />
                    )}
                    {msg.widget === 'product-select' && (
                      <ProductSelectWidget answered={isWidgetAnswered('product-select')} selectedKeys={products} onConfirm={handleProductsConfirm} />
                    )}
                    {msg.widget === 'scope-select' && (
                      <ScopeSelectWidget answered={isWidgetAnswered('scope-select')} selectedScope={scope} onConfirm={handleScopeConfirm} />
                    )}
                    {msg.widget === 'booking' && !bookingConfirmed && (
                      <BookingWidget onConfirm={handleBookingConfirm} />
                    )}
                    {!msg.widget && msg.actions && (
                      <Stack direction="row" gap={0.75} flexWrap="wrap">
                        {msg.actions.map((a) => (
                          <ActionChip key={a} label={a} onClick={() => handlePlanAction(a)} />
                        ))}
                      </Stack>
                    )}
                  </Box>
                )}
              </Box>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Box
                  sx={{
                    bgcolor: 'grey.100',
                    borderRadius: '16px 16px 4px 16px',
                    px: 2,
                    py: 1,
                    maxWidth: '80%',
                  }}
                >
                  <Typography variant="body1" sx={{ fontSize: '0.875rem', lineHeight: 1.5 }}>
                    {msg.text}
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        ))}
      </Box>

      {/* Text input — only available after plan is ready */}
      {isPlanChat && phase === 'canvas' && (
        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: 1,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: '16px',
              px: 2,
              py: 1,
              bgcolor: 'background.paper',
            }}
          >
            <TextField
              fullWidth
              multiline
              maxRows={4}
              variant="standard"
              placeholder="Type your message…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
              slotProps={{ input: { disableUnderline: true, sx: { fontSize: '0.875rem' } } }}
            />
            <Box
              component="button"
              onClick={handleSend}
              disabled={!input.trim()}
              aria-label="Send"
              sx={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                border: 'none',
                bgcolor: input.trim() ? 'grey.800' : 'grey.200',
                color: input.trim() ? 'white' : 'grey.400',
                cursor: input.trim() ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'background-color 0.15s',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}

// ─── Canvas Panel ─────────────────────────────────────────────────────────────

function CanvasPanel({ scope, selectedGroups }: { scope: 'global' | 'groups'; selectedGroups: string[] }) {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedModule, setSelectedModule] = useState<TrainingTopic | null>(null);
  const [removedIds, setRemovedIds] = useState<Set<number>>(new Set());
  const [confirmRemoveId, setConfirmRemoveId] = useState<number | null>(null);

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
      ? TOPICS.map((t) => ({ topic: t, inPlan: !removedIds.has(t.id) }))
      : TOPICS.map((t) => ({
          topic: t,
          inPlan: !removedIds.has(t.id) && (t.inScope.includes('all') || t.inScope.includes(currentTab.key)),
        }));

  const inPlanTopics = groupTopics.filter((g) => g.inPlan);
  const groupDuration = inPlanTopics.reduce((s, g) => s + g.topic.duration, 0);

  const confirmTopic = confirmRemoveId !== null ? TOPICS.find((t) => t.id === confirmRemoveId) : null;

  function handleConfirmRemove() {
    if (confirmRemoveId !== null) {
      setRemovedIds((prev) => new Set([...prev, confirmRemoveId]));
      setConfirmRemoveId(null);
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Paper variant="outlined" sx={{ borderRadius: 1, p: 2, mb: 2, display: 'flex', gap: 3, flexWrap: 'wrap', flexShrink: 0 }}>
        {[
          { label: 'Modules in plan', value: String(inPlanTopics.length) },
          { label: 'Estimated completion', value: formatDuration(groupDuration) },
          { label: 'Jurisdictions', value: '4' },
          { label: 'Business units', value: scope === 'global' ? 'Org-wide' : String(selectedGroups.length) },
        ].map((s) => (
          <Box key={s.label}>
            <Typography variant="labelXs" color="text.secondary">{s.label}</Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.2 }}>{s.value}</Typography>
          </Box>
        ))}
      </Paper>

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

      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 1.5 }}>
          {groupTopics.map(({ topic, inPlan }) => (
            <ModuleCard
              key={topic.id}
              topic={topic}
              inPlan={inPlan}
              onClick={() => inPlan && setSelectedModule(topic)}
              onRemove={() => setConfirmRemoveId(topic.id)}
            />
          ))}
        </Box>
      </Box>

      {/* Detail panel */}
      <ModuleDetailPanel topic={selectedModule} onClose={() => setSelectedModule(null)} />

      {/* Remove confirmation dialog */}
      <Dialog open={confirmRemoveId !== null} onClose={() => setConfirmRemoveId(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Remove module?</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Remove <strong>{confirmTopic?.title}</strong> from your training plan? You can add it back later.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button variant="outlined" onClick={() => setConfirmRemoveId(null)}>Cancel</Button>
          <Button variant="contained" onClick={handleConfirmRemove} sx={{ '&&': { bgcolor: '#d32f2f' } }}>Remove</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function TrainingPlanPage() {
  const [phase, setPhase] = useState<Phase>('setup');
  const [scope, setScope] = useState<'global' | 'groups'>('global');
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [genStage, setGenStage] = useState(0);
  const [genProgress, setGenProgress] = useState(0);

  function handleGenerate(s: 'global' | 'groups', g: string[]) {
    setScope(s);
    setSelectedGroups(g);
    setPhase('generating');
  }

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

  return (
    <PageLayout fullWidth>
      <PageHeader
        pageTitle={
          phase === 'canvas' ? (
            <span>
              Compliance Training Plan
              <Typography component="span" variant="inherit" color="text.secondary" sx={{ fontWeight: 400, ml: 1.5 }}>
                Q1–Q4 2026 · Acme Corp
              </Typography>
            </span>
          ) : 'Compliance Training Plan'
        }
        pageSubtitle={phase === 'canvas' ? undefined : 'Generate a tailored training plan for your organisation'}
      />

      {/* Setup: chat full width */}
      {phase === 'setup' && (
        <Paper
          variant="outlined"
          sx={{
            borderRadius: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            height: 'calc(100vh - 180px)',
            maxWidth: 640,
            mx: 'auto',
            width: '100%',
          }}
        >
          <Box sx={{ px: 2, pt: 1.5, pb: 1, borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="labelSm" sx={{ fontWeight: 700 }}>Plan assistant</Typography>
          </Box>
          <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            <ChatPanel key="chat" phase={phase} onGenerate={handleGenerate} />
          </Box>
        </Paper>
      )}

      {/* Generating / canvas: 1/3 chat + 2/3 right panel */}
      {phase !== 'setup' && (
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
              <ChatPanel key="chat" phase={phase} onGenerate={handleGenerate} />
            </Box>
          </Paper>

          {/* Right panel — 2/3 */}
          <Box sx={{ flex: 1, minWidth: 0, height: 'calc(100vh - 180px)', display: 'flex', flexDirection: 'column' }}>
            {phase === 'generating' && (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <Box sx={{ textAlign: 'center', maxWidth: 480, width: '100%', px: 4 }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>Building your training plan…</Typography>
                  <Typography variant="body1" color="text.secondary" mb={4}>{GENERATING_STAGES[genStage]}</Typography>
                  <LinearProgress variant="determinate" value={genProgress} sx={{ borderRadius: 1, height: 6 }} />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>{genProgress}%</Typography>
                </Box>
              </Box>
            )}
            {phase === 'canvas' && <CanvasPanel scope={scope} selectedGroups={selectedGroups} />}
          </Box>
        </Box>
      )}
    </PageLayout>
  );
}
