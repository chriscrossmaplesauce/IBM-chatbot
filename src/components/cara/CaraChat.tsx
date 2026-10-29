import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Sparkles,
  Shield,
  ArrowRight,
  RotateCcw,
  Compass,
  Wind,
  BookOpen,
  Hand,
  Clock,
  SlidersHorizontal,
  Brain,
  ChevronRight,
} from 'lucide-react';
import { CaraAvatar } from '../common/CaraAvatar';
import {
  ChatMessage,
  MoodType,
  NavigationTab,
  GuidedToolRecommendation,
  RelatedGuideRecommendation,
} from '../../types';

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

  const formatCurrentTime = () => {
    const d = new Date();
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };

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

  // Initialize conversation with the Coach & Guide flow
  useEffect(() => {
    const currentTime = formatCurrentTime();

    if (initialMood) {
      // Mood-aware coach check-in
      const moodReplies: Record<MoodType, { caraIntro: string; question: string; options: string[]; tool?: GuidedToolRecommendation; guide?: RelatedGuideRecommendation }> = {
        stressed: {
          caraIntro: `Hello, ${preferredName}. I see you're carrying noticeable stress today. School days ask you to absorb so much sensory and emotional stimulation—often without a single quiet moment to decompress.`,
          question: `I am right here with you—no grading to defend and no expectations. How is your body feeling right now, and what has felt heaviest today?`,
          tool: {
            category: 'Guided Interactive Tool',
            title: 'Box Breathing (4-4-4-4 Reset)',
            description: 'A 2-minute rhythmic breath to de-escalate physical tension.',
            toolId: 'breathing',
            targetTab: 'tools',
            buttonLabel: 'Start',
          },
          guide: {
            title: 'Related Guide: Explore wellbeing strategies for this',
            subtitle: 'Stress Management & Nervous System Reset',
            moduleId: 'mod-stress',
            targetTab: 'tools',
          },
          options: [
            'Need a 2-minute calming breath',
            "There's too much work for the time I have.",
            "I feel like I'm not getting through to my students.",
            "I'm too mentally exhausted to focus.",
          ],
        },
        low: {
          caraIntro: `Hello, ${preferredName}. I hear you that you're feeling low today. It takes courage to admit when your physical or emotional tank is running empty after giving so much to your students.`,
          question: `Take a gentle breath. What has been pulling your energy down the most?`,
          tool: {
            category: 'Guided Interactive Tool',
            title: '5-4-3-2-1 Sensory Grounding',
            description: 'Gently reconnect with the physical present.',
            toolId: 'sensory',
            targetTab: 'tools',
            buttonLabel: 'Start',
          },
          guide: {
            title: 'Related Guide: Explore wellbeing strategies for this',
            subtitle: 'Sustainable Coping for Educators',
            moduleId: 'mod-resilience',
            targetTab: 'tools',
          },
          options: [
            'Need a 2-minute calming breath',
            "I feel like I'm not getting through to my students.",
            'I feel guilty leaving work unfinished.',
            'Just need a quiet moment',
          ],
        },
        okay: {
          caraIntro: `Hello, ${preferredName}. Navigating an 'okay' school day still requires enormous mental presence and patient pacing. I'm glad you took two minutes for yourself.`,
          question: `How is your energy holding up as you head into the rest of your day?`,
          options: [
            'Need a 2-minute calming breath',
            'Staring at an overwhelming stack of grading',
            "Plan my tasks so I don't take them home",
            'Just checking in; all steady right now',
          ],
        },
        good: {
          caraIntro: `Hello, ${preferredName}! It is wonderful to hear that things feel steady or bright today. Noticing what went well is a genuine practice in teacher resilience.`,
          question: `What went smoothly today that helped protect your calm?`,
          options: [
            'Good connection with students today',
            'I protected my finishing time yesterday',
            'Explore sustainable habits module',
          ],
        },
        great: {
          caraIntro: `Hello, ${preferredName}! That is fantastic to hear. Those energised, flowing days in teaching deserve to be savoured.`,
          question: `Would you like to note this down in your private journal or enjoy the momentum?`,
          options: [
            'Write a quick reflection in my journal',
            'Explore gratitude micro-moments',
            'Enjoying the peaceful momentum!',
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
          timeFormatted: currentTime,
          senderLabel: `Haven • ${currentTime}`,
        },
        {
          id: 'init-2',
          sender: 'cara',
          text: selected.question,
          timestamp: Date.now() - 1000,
          timeFormatted: currentTime,
          senderLabel: `Cara.ai • Guide & Coach`,
          guidedTool: selected.tool,
          relatedGuide: selected.guide,
          suggestedResponses: selected.options,
        },
      ];
      setMessages(initialMessages);
      setActiveSuggested(selected.options);
    } else {
      // Default Coach Welcome matching user's exact specification
      const welcomeText = `Hello. I'm Cara.ai, your dedicated, confidential wellbeing space as a public school educator.\n\nWhether you just walked out of a chaotic lesson, are staring at an overwhelming stack of grading, or need a quiet 2-minute reset between bells—I am right here with you. How is your energy feeling right now, and what's on your mind today?`;

      const defaultSequence: ChatMessage[] = [
        {
          id: 'def-welcome',
          sender: 'cara',
          text: welcomeText,
          timestamp: Date.now(),
          timeFormatted: currentTime,
          senderLabel: `Haven • ${currentTime}`,
          suggestedResponses: [
            'Need a 2-minute calming breath',
            "I feel like I'm not getting through to my students. Everything I try seems to fail",
            'Staring at an overwhelming stack of grading',
            'Just walked out of a chaotic lesson',
            'I feel guilty leaving work unfinished',
          ],
        },
      ];
      setMessages(defaultSequence);
      setActiveSuggested([
        'Need a 2-minute calming breath',
        "I feel like I'm not getting through to my students. Everything I try seems to fail",
        'Staring at an overwhelming stack of grading',
        'Just walked out of a chaotic lesson',
        'I feel guilty leaving work unfinished',
      ]);
    }
  }, [initialMood, preferredName]);

  // Scroll to bottom on updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Deep coaching responses matching user's exact examples
  const getCoachResponse = (userText: string) => {
    const lower = userText.toLowerCase();

    // 1. Need a 2-minute calming breath
    if (lower.includes('calming breath') || lower.includes('2-minute') || lower.includes('breathe') || lower.includes('reset between bells')) {
      return {
        reply: `Teaching asks you to give so much of your heart, focus, and energy from the moment the morning bell rings. I am here with you right now—no grading, no lesson plans to justify, and no expectations.\n\nHow is your body feeling right now, and what has felt heaviest today?`,
        guidedTool: {
          category: 'Guided Interactive Tool',
          title: 'Box Breathing (4-4-4-4 Reset)',
          description: 'Four gentle rounds to steady your nervous system.',
          toolId: 'breathing',
          targetTab: 'tools' as NavigationTab,
          buttonLabel: 'Start',
        },
        relatedGuide: {
          title: 'Related Guide: Explore wellbeing strategies for this',
          subtitle: 'Stress Management & Nervous System Reset',
          moduleId: 'mod-stress',
          targetTab: 'tools' as NavigationTab,
        },
        suggestions: [
          'Start Box Breathing reset',
          "I feel like I'm not getting through to my students.",
          'My grading pile is out of control',
          'Read Classroom Reset Tips',
        ],
      };
    }

    // 2. "I feel like I'm not getting through to my students. Everything I try seems to fail"
    if (
      lower.includes('not getting through') ||
      lower.includes('everything i try seems to fail') ||
      lower.includes('fail') ||
      lower.includes('dysregulation') ||
      lower.includes('chaotic')
    ) {
      return {
        reply: `Classroom dysregulation is profoundly draining. You are holding the energy and nervous systems of 25 to 35 young people all day long while managing your own.\n\nWhen a lesson derails or behavior flares, your body registers it as physical stress. Take a soft breath. You are one caring person holding a large room; one rough period does not define your worth or skill as an educator.`,
        guidedTool: {
          category: 'Guided Interactive Tool',
          title: '5-4-3-2-1 Sensory Grounding',
          description: 'Anchor yourself in the room before your next interaction.',
          toolId: 'sensory',
          targetTab: 'tools' as NavigationTab,
          buttonLabel: 'Start',
        },
        relatedGuide: {
          title: 'Related Guide: Explore wellbeing strategies for this',
          subtitle: 'Emotional Regulation in High-Stress Moments',
          moduleId: 'mod-regulation',
          targetTab: 'tools' as NavigationTab,
        },
        suggestions: [
          'Start 5-4-3-2-1 Sensory Grounding',
          'Do a quick Box Breathing reset',
          'Read Classroom Reset Tips',
          'What can I do for tomorrow’s lesson?',
        ],
      };
    }

    // 3. Staring at overwhelming grading / too much work
    if (lower.includes('grading') || lower.includes('marking') || lower.includes('too much work') || lower.includes('time i have')) {
      return {
        reply: `Staring at a towering stack of exercise books can trigger instant exhaustion. When grading feels endless, our instinct is to sacrifice sleep or evenings.\n\nRemember the 80% rule: aim for feedback that is fit-for-purpose rather than perfectionism. You do not need to mark every single question with paragraph-long notes to deliver real learning value. What is the single most essential task in that pile today?`,
        guidedTool: {
          category: 'Guided Interactive Tool',
          title: 'Workload Triage (80% Rule Heuristic)',
          description: 'Separate urgent essentials from tasks that can wait or be simplified.',
          toolId: 'triage',
          targetTab: 'tools' as NavigationTab,
          buttonLabel: 'Start',
        },
        relatedGuide: {
          title: 'Related Guide: Explore wellbeing strategies for this',
          subtitle: 'Work-Life Boundaries & Guilt-Free Rest',
          moduleId: 'mod-boundaries',
          targetTab: 'tools' as NavigationTab,
        },
        suggestions: [
          'Open Workload Triage',
          'How do I let go of the guilt tonight?',
          'Need a 2-minute calming breath',
          'I want to write this in my journal',
        ],
      };
    }

    // 4. Guilt about leaving work unfinished
    if (lower.includes('guilt') || lower.includes('unfinished') || lower.includes('leaving')) {
      return {
        reply: `That guilt is heavy, but remember: leaving unfinished work at school is a sign of healthy human boundaries, not a failure of dedication.\n\nTeaching is an infinite profession: there will always be another rubric to tweak or a slide to refine. Packing up at the end of the school day protects the energy you need to stand before your students tomorrow.`,
        guidedTool: {
          category: 'Guided Interactive Tool',
          title: 'Workload Triage (What Can Wait)',
          description: 'Set explicit permissions on what waits until tomorrow.',
          toolId: 'triage',
          targetTab: 'tools' as NavigationTab,
          buttonLabel: 'Start',
        },
        relatedGuide: {
          title: 'Related Guide: Explore wellbeing strategies for this',
          subtitle: 'Work-Life Boundaries & Saying No',
          moduleId: 'mod-boundaries',
          targetTab: 'tools' as NavigationTab,
        },
        suggestions: [
          'Explore boundaries module',
          'Write a private reflection',
          'Need a 2-minute calming breath',
        ],
      };
    }

    // 5. Worry lessons won't be good enough
    if (lower.includes('good enough') || lower.includes("won't be good") || lower.includes('imposter')) {
      return {
        reply: `That worry shows how deeply you care, but aiming for perfection on every lesson plan is an unsustainable standard.\n\nStudents rarely remember the perfection of your slide transitions; they remember your patience, clarity, and presence. Can we strip tomorrow’s lesson down to its single essential learning objective?`,
        guidedTool: {
          category: 'Guided Interactive Tool',
          title: 'Thought Reframe Wizard',
          description: 'Challenge the inner critic demanding perfection.',
          toolId: 'reframe',
          targetTab: 'tools' as NavigationTab,
          buttonLabel: 'Start',
        },
        relatedGuide: {
          title: 'Related Guide: Explore wellbeing strategies for this',
          subtitle: 'Mindfulness for the Classroom',
          moduleId: 'mod-mindfulness',
          targetTab: 'tools' as NavigationTab,
        },
        suggestions: [
          'Start Thought Reframe',
          'Focus on one essential objective',
          'Need a 2-minute calming breath',
        ],
      };
    }

    // 6. Mentally exhausted
    if (lower.includes('exhausted') || lower.includes('tired') || lower.includes('drained') || lower.includes('focus')) {
      return {
        reply: `When your nervous system is depleted, trying to push through more administrative planning usually brings frustration and tears.\n\nYou have permission to pause. Even 3 minutes of somatic quiet can take you out of fight-or-flight mode. Let's rest your mind right now.`,
        guidedTool: {
          category: 'Guided Interactive Tool',
          title: 'Progressive Muscle Relaxation',
          description: 'Release accumulated tension in your shoulders, jaw, and neck.',
          toolId: 'muscle',
          targetTab: 'tools' as NavigationTab,
          buttonLabel: 'Start',
        },
        relatedGuide: {
          title: 'Related Guide: Explore wellbeing strategies for this',
          subtitle: 'Sleep and Recovery for Educators',
          moduleId: 'mod-sleep',
          targetTab: 'tools' as NavigationTab,
        },
        suggestions: [
          'Start Progressive Muscle Relaxation',
          'Do a quick Box Breathing reset',
          'Explore support directory',
        ],
      };
    }

    // Default supportive coaching response
    return {
      reply: `Thank you for sharing that with me, ${preferredName}. Acknowledging what is happening inside is the first compassionate step in de-escalating the day's pressure.\n\nTake a slow breath. If you could give yourself permission to step back from just one expectation right now, what would feel most relieving?`,
      guidedTool: {
        category: 'Guided Interactive Tool',
        title: '5-4-3-2-1 Sensory Grounding',
        description: 'Anchor yourself in the room and catch your breath.',
        toolId: 'sensory',
        targetTab: 'tools' as NavigationTab,
        buttonLabel: 'Start',
      },
      relatedGuide: {
        title: 'Related Guide: Explore wellbeing strategies for this',
        subtitle: 'Classroom & Teacher Reset Tips',
        moduleId: 'mod-mindfulness',
        targetTab: 'tools' as NavigationTab,
      },
      suggestions: [
        'Need a 2-minute calming breath',
        'Open Workload Triage',
        'Read Classroom Reset Tips',
        'Write this in my private journal',
      ],
    };
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    // Check if the user clicked "Read Classroom Reset Tips" or "Start Box Breathing reset", etc.
    const lower = text.toLowerCase();
    if (lower === 'read classroom reset tips') {
      onNavigate('tools', { toolId: 'mod-regulation' });
      return;
    }
    if (lower === 'start 5-4-3-2-1 sensory grounding') {
      onNavigate('tools', { toolId: 'sensory' });
      return;
    }
    if (lower === 'do a quick box breathing reset' || lower === 'start box breathing reset') {
      onNavigate('tools', { toolId: 'breathing' });
      return;
    }
    if (lower === 'open workload triage') {
      onNavigate('tools', { toolId: 'triage' });
      return;
    }

    const currentTime = formatCurrentTime();
    const userMsg: ChatMessage = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text,
      timestamp: Date.now(),
      timeFormatted: currentTime,
      senderLabel: `You • ${currentTime}`,
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
          let parsedTool: GuidedToolRecommendation | undefined;
          let parsedGuide: RelatedGuideRecommendation | undefined;
          let parsedSuggestions: string[] | undefined;

          // Parse metadata block <<<COACH_META: {...}>>>
          const metaMatch = replyText.match(/<<<COACH_META:\s*(\{.*?\})\s*>>>/s);
          if (metaMatch) {
            try {
              const metaObj = JSON.parse(metaMatch[1]);
              parsedTool = metaObj.guidedTool
                ? {
                    category: 'Guided Interactive Tool',
                    title: metaObj.guidedTool.title || 'Interactive Wellbeing Tool',
                    toolId: metaObj.guidedTool.toolId || 'sensory',
                    targetTab: 'tools',
                    buttonLabel: metaObj.guidedTool.buttonLabel || 'Start',
                  }
                : undefined;
              parsedGuide = metaObj.relatedGuide
                ? {
                    title: metaObj.relatedGuide.title || 'Related Guide: Explore wellbeing strategies for this',
                    moduleId: metaObj.relatedGuide.moduleId || 'mod-regulation',
                    targetTab: 'tools',
                  }
                : undefined;
              parsedSuggestions = metaObj.suggestions;
              replyText = replyText.replace(/<<<COACH_META:\s*\{.*?\}\s*>>>/s, '').trim();
            } catch {
              // ignore parse fail
            }
          }

          const caraMsg: ChatMessage = {
            id: 'cara-' + Date.now(),
            sender: 'cara',
            text: replyText,
            timestamp: Date.now(),
            timeFormatted: formatCurrentTime(),
            senderLabel: `Cara.ai • Guide & Coach • ${formatCurrentTime()}`,
            guidedTool: parsedTool,
            relatedGuide: parsedGuide,
            suggestedResponses: parsedSuggestions || [
              'Start 5-4-3-2-1 Sensory Grounding',
              'Do a quick Box Breathing reset',
              'Read Classroom Reset Tips',
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

    // Empathetic Guide & Coach Branching Fallback
    setTimeout(() => {
      const coachData = getCoachResponse(text);
      const resTime = formatCurrentTime();

      const caraMsg: ChatMessage = {
        id: 'cara-' + Date.now(),
        sender: 'cara',
        text: coachData.reply,
        timestamp: Date.now(),
        timeFormatted: resTime,
        senderLabel: `Cara.ai • Guide & Coach • ${resTime}`,
        guidedTool: coachData.guidedTool,
        relatedGuide: coachData.relatedGuide,
        suggestedResponses: coachData.suggestions,
      };

      setMessages((prev) => [...prev, caraMsg]);
      setActiveSuggested(coachData.suggestions || []);
      setIsLoading(false);
    }, 500);
  };

  const handleResetConversation = () => {
    const curTime = formatCurrentTime();
    const resetMsg: ChatMessage = {
      id: 'reset-1',
      sender: 'cara',
      text: `Welcome back, ${preferredName}. I am right here with you—no grading, no lesson plans to justify, and no expectations.\n\nHow is your energy feeling right now, and what's on your mind today?`,
      timestamp: Date.now(),
      timeFormatted: curTime,
      senderLabel: `Haven • ${curTime}`,
      suggestedResponses: [
        'Need a 2-minute calming breath',
        "I feel like I'm not getting through to my students. Everything I try seems to fail",
        'Staring at an overwhelming stack of grading',
        'Just walked out of a chaotic lesson',
        'I feel guilty leaving work unfinished',
      ],
    };
    setMessages([resetMsg]);
    setActiveSuggested([
      'Need a 2-minute calming breath',
      "I feel like I'm not getting through to my students. Everything I try seems to fail",
      'Staring at an overwhelming stack of grading',
      'Just walked out of a chaotic lesson',
      'I feel guilty leaving work unfinished',
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
                Guide & Coach
              </span>
            </div>
            <p className="text-xs text-[#687168]">
              Your Dedicated Wellbeing Space &bull;{' '}
              {hasLiveBackend ? 'Live Gemini Connected' : 'Empathetic Practice Mode'}
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

              <div className="max-w-[88%] sm:max-w-[80%] flex flex-col">
                {/* Sender label and timestamp */}
                <div
                  className={`text-[10px] text-[#687168] mb-1 px-1 flex items-center gap-1.5 ${
                    isCara ? 'justify-start' : 'justify-end'
                  }`}
                >
                  <Clock size={10} className="opacity-70" />
                  <span>{msg.senderLabel || (isCara ? 'Haven' : 'Teacher')}</span>
                </div>

                {/* Main bubble */}
                <div
                  className={`rounded-2xl p-4 text-sm leading-relaxed ${
                    isCara
                      ? 'bg-white border border-[#E9EEE5] text-[#293A30] shadow-xs'
                      : 'bg-[#58715B] text-white shadow-xs rounded-tr-xs'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.text}</div>

                  {/* Guided Interactive Tool Card (Section matching user specification) */}
                  {msg.guidedTool && (
                    <div className="mt-3.5 pt-3 border-t border-[#E9EEE5]">
                      <div className="bg-[#F7F5EF] rounded-xl p-3 border border-[#DCE4D6] flex items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#58715B] block mb-0.5">
                            {msg.guidedTool.category || 'Guided Interactive Tool'}
                          </span>
                          <h4 className="text-xs sm:text-sm font-bold text-[#293A30] truncate">
                            {msg.guidedTool.title}
                          </h4>
                          {msg.guidedTool.description && (
                            <p className="text-[11px] text-[#687168] line-clamp-1 mt-0.5">
                              {msg.guidedTool.description}
                            </p>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            if (msg.guidedTool?.targetTab) {
                              onNavigate(msg.guidedTool.targetTab, {
                                toolId: msg.guidedTool.toolId,
                              });
                            }
                          }}
                          className="px-4 py-2 bg-[#58715B] hover:bg-[#485e4b] active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs transition-all shrink-0 flex items-center gap-1.5"
                        >
                          <span>{msg.guidedTool.buttonLabel || 'Start'}</span>
                          <ArrowRight size={13} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Related Guide Link Card */}
                  {msg.relatedGuide && (
                    <div className="mt-2.5">
                      <button
                        type="button"
                        onClick={() => {
                          if (msg.relatedGuide?.targetTab) {
                            onNavigate(msg.relatedGuide.targetTab, {
                              toolId: msg.relatedGuide.moduleId || 'modules',
                            });
                          }
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white hover:bg-[#F4F7F2] border border-[#DCE4D6] text-left transition-colors group"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <BookOpen size={14} className="text-[#58715B] shrink-0" />
                          <div className="min-w-0">
                            <span className="text-xs font-semibold text-[#58715B] group-hover:underline block truncate">
                              {msg.relatedGuide.title}
                            </span>
                            {msg.relatedGuide.subtitle && (
                              <span className="text-[10px] text-[#687168] block truncate">
                                {msg.relatedGuide.subtitle}
                              </span>
                            )}
                          </div>
                        </div>
                        <ChevronRight
                          size={15}
                          className="text-[#687168] group-hover:text-[#58715B] group-hover:translate-x-0.5 transition-transform shrink-0"
                        />
                      </button>
                    </div>
                  )}

                  {/* Legacy Action button if provided */}
                  {msg.actionButton && !msg.guidedTool && (
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
              <span className="text-xs text-[#687168] ml-1">Cara is reflecting with you...</span>
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
            <span>Suggested replies & guides:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {activeSuggested.map((option, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(option)}
                className="text-xs px-3 py-1.5 rounded-full bg-[#F4F7F2] hover:bg-[#E9EEE5] text-[#293A30] border border-[#DCE4D6] transition-all hover:scale-[1.01] active:scale-95 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#58715B]"
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
          placeholder="Share what is on your mind or choose a prompt..."
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
