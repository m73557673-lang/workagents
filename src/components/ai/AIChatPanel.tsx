import { useState, useRef, useEffect } from 'react';
import { useNav } from '@/context/NavContext';
import { cn } from '@/lib/utils';
import { chatMessages as initialMessages } from '@/data/mockData';
import type { ChatMessage } from '@/types';
import { Sparkles, X, Send, ArrowRight, Zap, Search, ListTodo } from 'lucide-react';

const quickPrompts = [
  'Why are sales leads down this week?',
  'What needs my approval?',
  'How is my team performing?',
  'Show me recent failures',
];

const aiResponses: Record<string, { content: string; actions?: { label: string; type: string }[] }> = {
  'sales leads': {
    content: 'I analyzed your CRM activity and found a 24% reduction in new inbound leads since Monday. The largest change came from your website form — form submissions dropped from 42/week to 28/week. Your Sales Employee has been compensating with 31% more outbound prospecting.',
    actions: [
      { label: 'Investigate', type: 'investigate' },
      { label: 'Create Task', type: 'task' },
      { label: 'Ask Sales Employee', type: 'ask' },
    ],
  },
  'approval': {
    content: 'You have 4 pending approvals. The most urgent is from Operations Employee (Riley) requesting to reorder 500 units of packaging material — this is flagged as high risk at $3,200. There are also 2 medium-risk email sends awaiting your review.',
    actions: [
      { label: 'Go to Approvals', type: 'navigate' },
      { label: 'Review details', type: 'detail' },
    ],
  },
  'team performing': {
    content: 'Your workforce is performing well overall. Success rate is 94.2% (up 2.1% from last week). Top performer: Sam (Support) with 578 tasks at 91% success. Maya (Marketing) has the lowest success rate at 88% — mostly due to approval rejections on campaign content.',
    actions: [
      { label: 'View Analytics', type: 'navigate' },
    ],
  },
  'recent failures': {
    content: 'There was 1 failure in the last 24 hours: Support Employee (Sam) failed to resolve ticket #176 at 9:21 AM — a login issue that required escalation. The ticket has been routed to your human support team. No other failures detected.',
    actions: [
      { label: 'View Activity Log', type: 'navigate' },
      { label: 'Create follow-up task', type: 'task' },
    ],
  },
};

function generateResponse(prompt: string): { content: string; actions?: { label: string; type: string }[] } {
  const lower = prompt.toLowerCase();
  for (const [key, resp] of Object.entries(aiResponses)) {
    if (lower.includes(key)) return resp;
  }
  return {
    content: 'I can help you understand your AI workforce activity, investigate issues, create tasks, or check on specific employees. Try asking about approvals, performance, recent activity, or any of your AI employees.',
    actions: [
      { label: 'View Overview', type: 'navigate' },
    ],
  };
}

export function AIChatPanel() {
  const { chatOpen, setChatOpen, navigate } = useNav();
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, thinking]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setThinking(true);

    setTimeout(() => {
      const resp = generateResponse(text);
      const aiMsg: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        role: 'assistant',
        content: resp.content,
        actions: resp.actions,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setThinking(false);
    }, 1200);
  };

  const handleAction = (action: { label: string; type: string }) => {
    if (action.type === 'navigate') {
      if (action.label.includes('Approval')) navigate('approvals');
      else if (action.label.includes('Analytics')) navigate('analytics');
      else if (action.label.includes('Activity')) navigate('activity');
      else navigate('overview');
      setChatOpen(false);
    } else {
      send(action.label);
    }
  };

  if (!chatOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm lg:bg-transparent lg:backdrop-blur-none" onClick={() => setChatOpen(false)} />
      <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white shadow-elevated flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-900">Ask AI Workforce</p>
            <p className="text-xs text-slate-400">Your AI command assistant</p>
          </div>
          <button onClick={() => setChatOpen(false)} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
              <div className={cn('max-w-[85%]', msg.role === 'user' ? 'order-2' : '')}>
                <div className={cn(
                  'rounded-xl px-3.5 py-2.5 text-sm',
                  msg.role === 'user'
                    ? 'bg-brand-600 text-white'
                    : 'bg-slate-100 text-slate-700'
                )}>
                  {msg.content}
                </div>
                {msg.actions && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {msg.actions.map((action) => (
                      <button
                        key={action.label}
                        onClick={() => handleAction(action)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors border border-brand-200"
                      >
                        {action.type === 'task' && <ListTodo className="w-3.5 h-3.5" />}
                        {action.type === 'investigate' && <Search className="w-3.5 h-3.5" />}
                        {action.type === 'navigate' && <ArrowRight className="w-3.5 h-3.5" />}
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
                <p className={cn('text-[10px] text-slate-400 mt-1', msg.role === 'user' ? 'text-right' : 'text-left')}>{msg.timestamp}</p>
              </div>
            </div>
          ))}

          {thinking && (
            <div className="flex items-center gap-2 text-slate-400">
              <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
        </div>

        {/* Quick prompts */}
        {messages.length <= 1 && (
          <div className="px-4 pb-3 space-y-1.5">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Try asking</p>
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => send(prompt)}
                className="w-full text-left px-3 py-2 text-sm text-slate-600 bg-slate-50 hover:bg-brand-50 hover:text-brand-700 rounded-lg transition-colors flex items-center gap-2"
              >
                <Zap className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="border-t border-slate-100 p-3">
          <div className="flex items-end gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              placeholder="Ask anything about your workforce..."
              rows={1}
              className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all max-h-32"
            />
            <button
              onClick={() => send(input)}
              disabled={!input.trim()}
              className="w-9 h-9 flex items-center justify-center bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export function ChatFloatingButton() {
  const { chatOpen, setChatOpen } = useNav();
  if (chatOpen) return null;

  return (
    <button
      onClick={() => setChatOpen(true)}
      className="fixed bottom-6 right-6 z-30 flex items-center gap-2 bg-brand-600 text-white px-4 py-3 rounded-full shadow-elevated hover:bg-brand-700 hover:scale-105 transition-all duration-200 group"
    >
      <div className="relative">
        <Sparkles className="w-5 h-5" />
        <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full ring-2 ring-brand-600 animate-pulse" />
      </div>
      <span className="text-sm font-semibold pr-1">Ask AI Workforce</span>
    </button>
  );
}
