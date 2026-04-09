import {
  AIChatAIMessage,
  AIChatBox,
  AIChatContent,
  AIChatContextProvider,
  AIChatMessageAvatar,
  AIChatMessageHeader,
  AIChatMessageTextBlock,
  AIChatThinkingIndicator,
  AIChatUI,
  AIChatUserMessage,
  StatusIndicator,
  useAIChatContext,
} from '@diligentcorp/atlas-react-bundle';
import {
  Box,
  Button,
  Divider,
  InputAdornment,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import BoardGroupIcon from '@diligentcorp/atlas-react-bundle/icons/BoardGroup';
import ReportsIcon from '@diligentcorp/atlas-react-bundle/icons/Reports';
import ComplianceEducationIcon from '@diligentcorp/atlas-react-bundle/icons/ComplianceEducation';
import { useState } from 'react';
import { useNavigate } from 'react-router';

// ─── Types & data ─────────────────────────────────────────────────────────────

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  time: string;
}

type ActivityStatus = 'Completed' | 'In Progress' | 'Overdue';

interface Activity {
  id: number;
  name: string;
  source: string;
  date: string;
  status: ActivityStatus;
  to?: string;
}

const MOCK_RESPONSES = [
  "That's a great question! Based on the available information, I'd suggest taking a structured approach and breaking the problem into smaller, manageable steps.",
  "I can definitely help with that. Here's what I think: the best path forward depends on your specific goals and constraints, but generally speaking, starting with a clear definition of success is key.",
  "Thanks for sharing that context. From what you've described, there are a few angles worth exploring. Let me walk you through each of them.",
  "Interesting! I've thought about this carefully, and I believe the most effective solution would involve both a short-term fix and a longer-term strategy.",
  "Great point — this is a topic with a lot of nuance. The important thing is to weigh your options based on impact and effort, then prioritize accordingly.",
];

const ACTIVITIES: Activity[] = [
  { id: 1, name: 'Speak up case: Discrimination #126', source: 'Vault', date: 'Apr 8, 2026', status: 'Completed' },
  { id: 2, name: 'Speak up case: Harassment #127', source: 'Vault', date: 'Apr 8, 2026', status: 'In Progress' },
  { id: 3, name: 'Policy updated: Code of Conduct', source: 'Policy Manager', date: 'Apr 8, 2026', status: 'Completed' },
  { id: 4, name: 'Speak up case: Discrimination #128', source: 'Vault', date: 'Apr 8, 2026', status: 'Completed' },
  { id: 5, name: 'Policy updated: Anti-Bribery Policy', source: 'Policy Manager', date: 'Apr 8, 2026', status: 'In Progress' },
  { id: 6, name: 'Training Plan: Compliance Training Plan 2026', source: 'Training', date: 'Apr 9, 2026', status: 'In Progress', to: '/training-plan' },
];

const STATUS_COLOR: Record<ActivityStatus, 'success' | 'information' | 'error'> = {
  Completed: 'success',
  'In Progress': 'information',
  Overdue: 'error',
};

function nowTime() {
  return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

// ─── Compliance Activity section ──────────────────────────────────────────────

function ComplianceActivity() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [productFilter, setProductFilter] = useState<string>('all');

  const filtered = ACTIVITIES.filter((a) => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) || a.source.toLowerCase().includes(search.toLowerCase());
    const matchProduct = productFilter === 'all' || a.source === productFilter;
    return matchSearch && matchProduct;
  });

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', width: '100%', mt: 4, px: 2, position: 'relative', zIndex: 1 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
        Compliance Activity
      </Typography>

      {/* Filters */}
      <Stack direction="row" gap={1.5} mb={2}>
        <TextField
          size="small"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flex: 1 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            },
          }}
        />
        <Select
          size="small"
          value={productFilter}
          onChange={(e) => setProductFilter(e.target.value)}
          sx={{ minWidth: 140 }}
        >
          <MenuItem value="all">All Products</MenuItem>
          <MenuItem value="Vault">Vault</MenuItem>
          <MenuItem value="Policy Manager">Policy Manager</MenuItem>
          <MenuItem value="Training">Training</MenuItem>
        </Select>
      </Stack>

      {/* Activity list */}
      <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
        {filtered.map((activity, i) => (
          <Box key={activity.id}>
            {i > 0 && <Divider />}
            <Stack
              direction="row"
              alignItems="center"
              gap={2}
              sx={{ px: 2, py: 1.5 }}
            >
              <Typography variant="body1" sx={{ flex: 1, fontWeight: 500, fontSize: '0.875rem' }}>
                {activity.name.includes(':') ? (
                  <>
                    <Typography component="span" sx={{ fontWeight: 700, fontSize: '0.875rem' }}>
                      {activity.name.split(':')[0]}:
                    </Typography>
                    {activity.name.split(':').slice(1).join(':')}
                  </>
                ) : (
                  activity.name
                )}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontSize: '0.875rem', minWidth: 110 }}>
                {activity.source}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontSize: '0.875rem', minWidth: 90 }}>
                {activity.date}
              </Typography>
              <Stack direction="row" alignItems="center" gap={0.75} sx={{ minWidth: 110 }}>
                <StatusIndicator color={STATUS_COLOR[activity.status]} />
                <Typography variant="body1" sx={{ fontSize: '0.875rem' }}>
                  {activity.status}
                </Typography>
              </Stack>
              <Button
                variant="outlined"
                size="small"
                sx={{ flexShrink: 0 }}
                onClick={() => activity.to && navigate(activity.to)}
              >
                View
              </Button>
            </Stack>
          </Box>
        ))}
      </Box>

      {/* Footer links */}
      <Stack direction="row" gap={2} justifyContent="center" mt={4} mb={2}>
        <Button variant="text" size="small" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
          Terms of use ↗
        </Button>
        <Divider orientation="vertical" flexItem />
        <Button variant="text" size="small" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
          Privacy policy ↗
        </Button>
      </Stack>
    </Box>
  );
}

// Inline search icon SVG (no @mui/icons-material available)
function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#9e9e9e' }}>
      <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
    </svg>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function IndexPage() {
  return (
    <AIChatContextProvider initialHasStartedChat>
      <ChatContent />
    </AIChatContextProvider>
  );
}

function ChatContent() {
  const { isGenerating, setIsGenerating } = useAIChatContext();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);

  function handleSubmit(prompt: string) {
    setMessages((prev) => [...prev, { id: Date.now().toString(), role: 'user', content: prompt, time: nowTime() }]);

    setTimeout(() => {
      const response = MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: response, time: nowTime() }]);
      setIsGenerating(false);
    }, 900 + Math.random() * 1100);
  }

  return (
    <>
      <AIChatUI
        title="Ask your AI assistant anything."
        subtitle="Type a request or view the Assist Tools available below."
        chatBox={
          <AIChatBox
            onSubmit={handleSubmit}
            onStop={() => setIsGenerating(false)}
            slotProps={{ textField: { placeholder: 'Type your message...' } }}
            contentBelow={
              <Stack direction="row" gap={1} justifyContent="center">
                <Button variant="outlined" startIcon={<BoardGroupIcon />} sx={{ borderRadius: '99px', whiteSpace: 'nowrap' }}>
                  Appoint a Board Member
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<ReportsIcon />}
                  onClick={() => navigate('/reports')}
                  sx={{ borderRadius: '99px', whiteSpace: 'nowrap' }}
                >
                  Create a compliance report
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<ComplianceEducationIcon />}
                  onClick={() => navigate('/training-plan')}
                  sx={{ borderRadius: '99px', whiteSpace: 'nowrap' }}
                >
                  Create training plan
                </Button>
              </Stack>
            }
          />
        }
        chatContent={
          <AIChatContent>
            {/* Compliance alert banner */}
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 0.5, maxWidth: 'none', mx: 'auto' }}>
                Your compliance program needs attention.
              </Typography>
              <Typography variant="body1" sx={{ mb: 0.5, maxWidth: 'none', mx: 'auto' }}>
                New Harassment Case Opened – Engineering Department
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 'none', mx: 'auto' }}>
                4 policies to review. Training program is on schedule.
              </Typography>
            </Box>

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
                  header={<AIChatMessageHeader name="AI assistant" time={msg.time} avatar={<AIChatMessageAvatar uniqueId="ai-assistant" initials="AI" />} />}
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
        }
      />
      <ComplianceActivity />
    </>
  );
}
