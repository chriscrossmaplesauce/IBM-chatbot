import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, Shield, ArrowRight, RotateCcw, Compass, Wind, BookOpen, HandHeart } from 'lucide-react';
import { CaraAvatar } from '../common/CaraAvatar';
import { ChatMessage, MoodType, NavigationTab } from '../../types';

interface CaraChatProps {
  initialMood?: MoodType | null;
  preferredName: string;
  onNavigate: (tab: NavigationTab, options?: { toolId?: string }) => void;
  onOpenSafety: () => void;
}

export const CaraChat: React.FC<CaraChatProps> = ({
  initialMood,
  preferredName,
  onNavigate,
  onOpenSafety,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeSuggested, setActiveSuggested] = useState<string[]>([]);
  const [hasLiveBackend, setHasLiveBackend] = useState<boolean | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check backend health
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        setHasLiveBackend(!!data?.hasApiKey);
      })
      .catch(() => {
        setHasLiveBackend(false);
      });
  }, []);

  // Initialize conversation
  useEffect(() => {
    if (initialMood) {
      // Custom mood-initiated start
      const moodReplies: Record<MoodType, { caraIntro: string; question: string; options: string[] }> = {
        stressed: {
          caraIntro: `Hello, ${preferredName}. I notice you checked in as feeling stressed today. Thank you for pausing for a moment; school days can be relentlessly intense.`,
          question: `What feels heaviest right now?`,
          options: [
            "There's too much work for the time I have.",
            "I'm worried my lessons won't be good enough.",
            "I feel guilty leaving work unfinished.",
            "I'm too mentally exhausted to focus.",
            "Something else.",
          ],
        },
        low: {
          caraIntro: `Hello, ${preferredName}. I hear you that you're feeling low today. It takes quiet honesty to admit when your tank is running dry.`,
          question: `What has been draining your energy the most?`,
          options: [
            "Emotional exhaustion from difficult interactions.",
            "There's too much work for the time I have.",
            "I feel like I'm letting students or colleagues down.",
            "I'm too mentally exhausted to focus.",
            "Something else.",
          ],
        },
        okay: {
          caraIntro: `Hello, ${preferredName}. Getting through an 'okay' day in teaching is still real work. I'm glad you took a second to check in.`,
          question: `How is your pace feeling as you move through today?`,
          options: [
            "Steady, but I have a big pile of marking ahead.",
            "A bit rushed, could use a 2-minute reset.",
            "I want to plan my tasks so I don't take them home.",
            "Just checking in; all manageable right now.",
          ],
        },
        good: {
          caraIntro: `Hello, ${preferredName}! It is really encouraging to hear you're feeling good today. Celebrating steady moments helps anchor our resilience.`,
          question: `What went well today that helped support your wellbeing?`,
          options: [
            "Good connection with students today.",
            "I kept to my finishing time yesterday.",
            "I want to protect this calm energy.",
            "Just saving this positive moment.",
          ],
        },
        great: {
          caraIntro: `Hello, ${preferredName}! That's wonderful to hear. Having energised, great days in the classroom is something to savour.`,
          question: `Would you like to note down what made today feel so positive?`,
          options: [
            "Write a quick reflection in my journal.",
            "Explore a module on sustainable habits.",
            "Just enjoying the momentum!",
          ],
        },
      };

      const selected = moodReplies[initialMood] || moodReplies.stressed;
      const initialMessages: ChatMessage[] = [
        {
          id: 'init-1',
          sender: 'cara',
          text: selected.caraIntro,
          timestamp: Date.now() - 2000,
        },
        {
          id: 'init-2',
          sender: 'cara',
          text: selected.question,
          timestamp: Date.now() - 1000,
          suggestedResponses: selected.options,
        },
      ];
      setMessages(initialMessages);
      setActiveSuggested(selected.options);
    } else {
      // Default exact initial conversation from Section 6.B
      const defaultSequence: ChatMessage[] = [
        {
          id: 'def-1',
          sender: 'cara',
          text: `It sounds like you've had a demanding day. What's been the hardest part?`,
          timestamp: Date.now() - 4000,
        },
        {
          id: 'def-2',
          sender: 'user',
          text: `I have so much marking to finish, and I still need to prepare tomorrow's lessons.`,
          timestamp: Date.now() - 2500,
        },
        {
          id: 'def-3',
          sender: 'cara',
          text: `That sounds exhausting, especially when both tasks feel urgent. We don't have to solve everything at once.`,
          timestamp: Date.now() - 1500,
        },
        {
          id: 'def-4',
          sender: 'cara',
          text: `What feels heaviest right now?`,
          timestamp: Date.now() - 800,
          suggestedResponses: [
            "There's too much work for the time I have.",
            "I'm worried my lessons won't be good enough.",
            "I feel guilty leaving work unfinished.",
            "I'm too mentally exhausted to focus.",
            "Something else.",
          ],
        },
      ];
      setMessages(defaultSequence);
      setActiveSuggested([
        "There's too much work for the time I have.",
        "I'm worried my lessons won't be good enough.",
        "I feel guilty leaving work unfinished.",
        "I'm too mentally exhausted to focus.",
        "Something else.",
      ]);
    }
  }, [initialMood, preferredName]);

  // Scroll to bottom on updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Branching deterministic logic matching Section 6.C
  const handleBranchingResponse = (userText: string) => {
    const lower = userText.toLowerCase();

    if (lower.includes('too much work') || lower.includes('time i have')) {
      return {
        reply: `I hear you. The sheer volume of assessment and preparation can feel impossible within standard school hours. When everything screams for attention, our nervous systems stay on high alert.\n\nLet's apply the 80% rule: what must genuinely be completed today for students to learn safely tomorrow, and what can be simplified or delayed?`,
        actionButton: {
          label: 'Open Workload Triage',
          action: 'open_triage',
          targetTab: 'tools' as NavigationTab,
          toolId: 'triage',
        },
        suggestions: [
          'Help me separate urgent tasks',
          'Tell me more about the 80% rule',
          'I want to try a 3-minute reset first',
        ],
      };
    }

    if (lower.includes("won't be good enough") || lower.includes('good enough') || lower.includes('lesson')) {
      return {
        reply: `That worry is so common among conscientious teachers. You care deeply about your students, but aiming for perfection on every lesson plan is an unsustainable standard.\n\nMost students thrive on clarity and your calm presence, not overly elaborate slide decks or endless props. Can we strip tomorrow's lesson down to its single essential learning objective?`,
        actionButton: {
          label: 'Try Thought Reframe',
          action: 'open_reframe',
          targetTab: 'tools' as NavigationTab,
          toolId: 'reframe',
        },
        suggestions: [
          'What is one essential objective?',
          'Open Workload Triage',
          'I feel guilty doing only the basics',
        ],
      };
    }

    if (lower.includes('guilt') || lower.includes('unfinished')) {
      return {
        reply: `That guilt is heavy, but remember: leaving unfinished work at school is a sign of healthy human boundaries, not a lack of commitment.\n\nThe school system will always ask for 100% of whatever time you offer it. Leaving on time protects your ability to teach sustainably for years to come.`,
        actionButton: {
          label: 'Explore Work-Life Boundaries Module',
          action: 'open_boundaries',
          targetTab: 'tools' as NavigationTab,
          toolId: 'module-boundaries',
        },
        suggestions: [
          'How do I let go of the guilt tonight?',
          'Write a private reflection',
          'What can wait until tomorrow?',
        ],
      };
    }

    if (lower.includes('mentally exhausted') || lower.includes('exhausted') || lower.includes('tired') || lower.includes('focus')) {
      return {
        reply: `When your brain and nervous system are completely depleted, trying to force lesson planning or marking usually takes triple the effort and brings tears of frustration.\n\nLet's step away from decision-making for just a few minutes. Would you be open to a gentle 3-minute calming breath or sensory reset?`,
        actionButton: {
          label: 'Try Box Breathing (3 min)',
          action: 'open_breathing',
          targetTab: 'tools' as NavigationTab,
          toolId: 'breathing',
        },
        suggestions: [
          'Start Box Breathing',
          'Try 5-4-3-2-1 Grounding',
          'I need to talk to a person',
        ],
      };
    }

    if (lower.includes('talk to a person') || lower.includes('human') || lower.includes('help me') || lower.includes('crying') || lower.includes('break down')) {
      return {
        reply: `I want to remind you that you don't have to carry this alone. Cara is here for quick self-reflection, but when things feel too heavy, connecting with real human support makes all the difference.`,
        actionButton: {
          label: 'Explore Professional & Helpline Support',
          action: 'open_support',
          targetTab: 'support' as NavigationTab,
        },
        suggestions: [
          'Show crisis & confidential helplines',
          'Message an EAP professional',
          'Take a deep breath with me',
        ],
      };
    }

    // Default supportive response
    return {
      reply: `Thank you for sharing that with me, ${preferredName}. Acknowledging what is going on inside is often the first step in de-escalating the internal pressure.\n\nTake a slow breath. If you could give yourself permission to let go of just one expectation this evening, what would it be?`,
      suggestions: [
        'Open Workload Triage',
        'Take a 3-minute breathing reset',
        'Write this down in my journal',
        'Something else',
      ],
    };
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setActiveSuggested([]);
    setIsLoading(true);

    // If Gemini backend is configured, attempt live call
    if (hasLiveBackend) {
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [...messages, userMsg],
          }),
        });

        if (response.ok) {
          const data = await response.json();
          let replyText = data.reply || '';
          let parsedSuggestions: string[] | undefined;

          // Parse optional suggestions format <<<SUGGESTIONS: [...]>>>
          const suggestionMatch = replyText.match(/<<<SUGGESTIONS:\s*(\[.*?\])\s*>>>/s);
          if (suggestionMatch) {
            try {
              parsedSuggestions = JSON.parse(suggestionMatch[1]);
              replyText = replyText.replace(/<<<SUGGESTIONS:\s*\[.*?\]\s*>>>/s, '').trim();
            } catch {
              // ignore parse fail
            }
          }

          const caraMsg: ChatMessage = {
            id: 'cara-' + Date.now(),
            sender: 'cara',
            text: replyText,
            timestamp: Date.now(),
            suggestedResponses: parsedSuggestions || [
              'Open Workload Triage',
              'Try a calming breath',
              'Tell me more',
            ],
          };

          setMessages((prev) => [...prev, caraMsg]);
          if (parsedSuggestions) setActiveSuggested(parsedSuggestions);
          setIsLoading(false);
          return;
        }
      } catch (err) {
        console.warn('API chat fallback triggered:', err);
      }
    }

    // Deterministic Branching Fallback
    setTimeout(() => {
      const branchResult = handleBranchingResponse(text);
      const caraMsg: ChatMessage = {
        id: 'cara-' + Date.now(),
        sender: 'cara',
        text: branchResult.reply,
        timestamp: Date.now(),
        actionButton: branchResult.actionButton,
        suggestedResponses: branchResult.suggestions,
      };

      setMessages((prev) => [...prev, caraMsg]);
      setActiveSuggested(branchResult.suggestions || []);
      setIsLoading(false);
    }, 600);
  };

  const handleResetConversation = () => {
    setMessages([
      {
        id: 'reset-1',
        sender: 'cara',
        text: `Welcome back, ${preferredName}. I'm here whenever you need a mindful pause. How are things feeling right now?`,
        timestamp: Date.now(),
        suggestedResponses: [
          "There's too much work for the time I have.",
          "I'm worried my lessons won't be good enough.",
          "I feel guilty leaving work unfinished.",
          "I'm too mentally exhausted to focus.",
          "Something else.",
        ],
      },
    ]);
    setActiveSuggested([
      "There's too much work for the time I have.",
      "I'm worried my lessons won't be good enough.",
      "I feel guilty leaving work unfinished.",
      "I'm too mentally exhausted to focus.",
      "Something else.",
    ]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-130px)] sm:h-[calc(100vh-140px)] max-w-3xl mx-auto bg-white sm:rounded-2xl sm:shadow-sm sm:border sm:border-[#E9EEE5] overflow-hidden">
      {/* Cara Header */}
      <header className="px-4 py-3 bg-[#E9EEE5]/70 border-b border-[#DCE4D6] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CaraAvatar size="sm" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#293A30]">Cara.ai</h2>
              <span className="text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-white text-[#58715B] border border-[#DCE4D6]">
                AI support, not therapy
              </span>
            </div>
            <p className="text-xs text-[#687168]">
              Your Support Guide &bull; {hasLiveBackend ? 'Live Gemini Connected' : 'Guided Practice Mode'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleResetConversation}
            className="p-1.5 text-[#687168] hover:text-[#293A30] hover:bg-white rounded-lg transition-colors"
            title="Start fresh conversation"
            aria-label="Restart conversation"
          >
            <RotateCcw size={16} />
          </button>
          <button
            type="button"
            onClick={onOpenSafety}
            className="inline-flex items-center gap-1 text-xs text-[#58715B] hover:text-[#293A30] font-medium py-1 px-2 rounded-lg hover:bg-white transition-colors"
            aria-label="View safety and privacy information"
          >
            <Shield size={14} />
            <span className="hidden sm:inline">Safety & Privacy</span>
          </button>
        </div>
      </header>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-[#FDFCF9]">
        {messages.map((msg) => {
          const isCara = msg.sender === 'cara';

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isCara ? 'justify-start' : 'justify-end'}`}
            >
              {isCara && <CaraAvatar size="xs" className="mt-1" />}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3.5 sm:p-4 text-sm leading-relaxed ${
                  isCara
                    ? 'bg-white border border-[#E9EEE5] text-[#293A30] shadow-xs'
                    : 'bg-[#58715B] text-white shadow-xs rounded-tr-xs'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>

                {/* Direct Action Button in message */}
                {msg.actionButton && (
                  <div className="mt-3 pt-2.5 border-t border-[#E9EEE5]">
                    <button
                      type="button"
                      onClick={() => {
                        if (msg.actionButton?.targetTab) {
                          onNavigate(msg.actionButton.targetTab, {
                            toolId: msg.actionButton.toolId,
                          });
                        }
                      }}
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#E9EEE5] hover:bg-[#DCE4D6] text-[#293A30] text-xs font-semibold shadow-2xs transition-all duration-150 group"
                    >
                      <span>{msg.actionButton.label}</span>
                      <ArrowRight size={14} className="text-[#58715B] group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-2.5">
            <CaraAvatar size="xs" isSpeaking className="mt-1" />
            <div className="bg-white border border-[#E9EEE5] rounded-2xl p-3 shadow-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#58715B] animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-[#58715B] animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-[#58715B] animate-bounce [animation-delay:0.4s]" />
              <span className="text-xs text-[#687168] ml-1">Cara is thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Responses Chips */}
      {activeSuggested.length > 0 && !isLoading && (
        <div className="px-4 py-2.5 bg-white border-t border-[#E9EEE5]/80 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#687168] mb-1.5">
            <Sparkles size={12} className="text-[#58715B]" />
            <span>Suggested replies:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {activeSuggested.map((option, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(option)}
                className="text-xs px-3 py-1.5 rounded-full bg-[#F4F7F2] hover:bg-[#E9EEE5] text-[#293A30] border border-[#DCE4D6] transition-all hover:scale-[1.02] text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#58715B]"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Composer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 bg-white border-t border-[#E9EEE5] flex items-center gap-2"
      >
        <label htmlFor="cara-chat-input" className="sr-only">
          Message Cara.ai
        </label>
        <input
          id="cara-chat-input"
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type what's on your mind or pick a reply..."
          className="flex-1 bg-[#F7F5EF] rounded-xl px-4 py-2.5 text-sm text-[#293A30] placeholder-[#687168] border border-transparent focus:border-[#58715B] focus:bg-white focus:outline-none transition-colors"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          aria-label="Send message to Cara"
          className="p-2.5 bg-[#58715B] text-white rounded-xl hover:bg-[#485e4b] disabled:opacity-40 disabled:hover:bg-[#58715B] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#58715B]"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};
