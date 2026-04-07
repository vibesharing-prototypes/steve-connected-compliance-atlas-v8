import { useState } from 'react';
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
  useAIChatContext,
} from '@diligentcorp/atlas-react-bundle';
import { Button, Stack } from '@mui/material';
import BoardGroupIcon from '@diligentcorp/atlas-react-bundle/icons/BoardGroup';
import ComplianceEthicsIcon from '@diligentcorp/atlas-react-bundle/icons/ComplianceEthics';
import { useNavigate } from 'react-router';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  time: string;
}

const MOCK_RESPONSES = [
  "That's a great question! Based on the available information, I'd suggest taking a structured approach and breaking the problem into smaller, manageable steps.",
  "I can definitely help with that. Here's what I think: the best path forward depends on your specific goals and constraints, but generally speaking, starting with a clear definition of success is key.",
  "Thanks for sharing that context. From what you've described, there are a few angles worth exploring. Let me walk you through each of them.",
  "Interesting! I've thought about this carefully, and I believe the most effective solution would involve both a short-term fix and a longer-term strategy.",
  'Great point — this is a topic with a lot of nuance. The important thing is to weigh your options based on impact and effort, then prioritize accordingly.',
];

function nowTime() {
  return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: '0',
    role: 'assistant',
    content: "Hi! I'm your AI assistant. How can I help you today?",
    time: nowTime(),
  },
];

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
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);

  function handleSubmit(prompt: string) {
    setMessages((prev) => [...prev, { id: Date.now().toString(), role: 'user', content: prompt, time: nowTime() }]);

    const delay = 900 + Math.random() * 1100;
    setTimeout(() => {
      const response = MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: response, time: nowTime() }]);
      setIsGenerating(false);
    }, delay);
  }

  return (
    <AIChatUI
      title="Ask your AI assistant anything."
      subtitle="Type a request or view the Assist Tools available below."
      chatBox={
        <AIChatBox
          onSubmit={handleSubmit}
          onStop={() => setIsGenerating(false)}
          slotProps={{ textField: { placeholder: 'Type your message...' } }}
          contentBelow={
            <Stack direction="row" gap={1} sx={{ flexWrap: 'nowrap' }}>
              <Button variant="outlined" startIcon={<BoardGroupIcon />} fullWidth sx={{ whiteSpace: 'nowrap' }}>
                Appoint a Board Member
              </Button>
              <Button
                variant="outlined"
                startIcon={<ComplianceEthicsIcon />}
                onClick={() => navigate('/connected-compliance')}
                fullWidth
                sx={{ whiteSpace: 'nowrap' }}
              >
                Connected Compliance
              </Button>
            </Stack>
          }
        />
      }
      chatContent={
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
  );
}
