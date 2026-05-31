import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, 
  Award, 
  Sparkles, 
  Clock, 
  Compass, 
  Brain, 
  Bookmark, 
  PenTool, 
  Search, 
  Moon, 
  Sun, 
  Activity, 
  ChevronRight, 
  ChevronLeft, 
  User, 
  CheckCircle, 
  TrendingUp, 
  Send, 
  Archive, 
  BookMarked, 
  Plus, 
  Trash, 
  FileText, 
  Layers, 
  Cpu, 
  Check, 
  RefreshCw 
} from 'lucide-react';
import { book1RulesList, preseededBook1Content } from './data/book1_outline';
import { book2SituationsList, preseededBook2Content } from './data/book2_outline';
import { book3ChaptersList, preseededBook3Content } from './data/book3_outline';
import { archiveQuotes, dailyLessons } from './data/quotes';
import { 
  ArchiveBook, 
  RuleOutline, 
  RuleContent, 
  SituationOutline, 
  SituationContent, 
  ChapterOutline, 
  ChapterContent, 
  UserNote, 
  Bookmark as BookmarkType, 
  Highlight as HighlightType, 
  UserProgress, 
  AchievementBadge, 
  ChatMessage, 
  DailyLesson 
} from './types';

// Asset references for the uploaded portratis of Kiyotaka Ayanokoji
const IMAGE_PORTRAIT_QUOTE = "https://i.pinimg.com/736x/2b/28/fc/2b28fcaf4cb5624195155f36e8bfa5f7.jpg"; // Quote Panel
const IMAGE_MASK_GLOW = "https://i.pinimg.com/736x/8d/f9/51/8df951016839cbd7bde2fd6e43dbddcb.jpg";     // Broken Mask
const IMAGE_CHESS = "https://i.pinimg.com/736x/77/9c/cb/779ccbeeb641907cb5cfcca57f862db2.jpg";         // Chess Game Model

export default function App() {
  // Global States
  const [activeTab, setActiveTab] = useState<'home' | 'library' | 'reading' | 'dashboard' | 'tutor'>('home');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Reading Configuration
  const [currentBookId, setCurrentBookId] = useState<string>('book1');
  const [selectedItemId, setSelectedItemId] = useState<string>('1'); // Match book1 rule number or book2 situation number or book3 chapter outline ID
  const [fontSize, setFontSize] = useState<number>(18);
  const [sepiaMode, setSepiaMode] = useState<boolean>(false);
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);

  // User Progression & local persistence
  const [userProgress, setUserProgress] = useState<UserProgress>({
    book1CompletedCount: 1,
    book2CompletedCount: 1,
    book3CompletedCount: 1,
    completedIds: ['rule-1', 'situation-1', 'human-nature-c1'],
    streak: 3,
    lastActiveDate: new Date().toISOString().split('T')[0],
    badgeIds: ['badge-sovereign', 'badge-pioneer'],
    notesCount: 0
  });

  // Notes, Highlighting, and Bookmarks
  const [notes, setNotes] = useState<UserNote[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>([]);
  const [highlights, setHighlights] = useState<HighlightType[]>([]);
  const [newNoteText, setNewNoteText] = useState<string>('');
  const [highlightColor, setHighlightColor] = useState<string>('bg-yellow-500/20 text-yellow-100');

  // AI Assistant Chat state (for the dedicated strategic tutor tab)
  const [tutorMessages, setTutorMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: "Observe the environment. Decode the incentives. Rationalize the outcomes. Welcome to the Training Core. I am the Archival AI Strategist. You may query me about human motivation, cognitive vulnerabilities, stoicism, or how to formulate strategic responses under pressure.",
      createdAt: new Date().toLocaleTimeString()
    }
  ]);
  const [chatInput, setChatInput] = useState<string>('');
  const [isSendingChat, setIsSendingChat] = useState<boolean>(false);

  // AI Active Reading Assistant & Chapter Expansion state
  const [readingAssistantChat, setReadingAssistantChat] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: "I am analyzing this text in real-time. Highlight any paragraph or ask me to synthesize lessons, extract real-world applications, or solve dynamic simulations based on this content.",
      createdAt: new Date().toLocaleTimeString()
    }
  ]);
  const [readingAssistantInput, setReadingAssistantInput] = useState<string>('');
  const [isSendingReadingAssist, setIsSendingReadingAssist] = useState<boolean>(false);

  // Cached generated content that the user creates via AI progressive page expansions (allowing books to exceed 69 pages!)
  const [expandedContentCache, setExpandedContentCache] = useState<Record<string, string>>({});
  const [isExpandingPage, setIsExpandingPage] = useState<boolean>(false);

  // Daily challenge and lesson completion state
  const [activeDailyLesson, setActiveDailyLesson] = useState<number>(0);
  const [dailyLessonCompleted, setDailyLessonCompleted] = useState<boolean>(false);
  const [dailyChallengeCompleted, setDailyChallengeCompleted] = useState<boolean>(false);

  // Active Quote Index for landing ticker
  const [quoteIndex, setQuoteIndex] = useState<number>(0);

  // Carousel layout states
  const [hoveredImageIndex, setHoveredImageIndex] = useState<number | null>(null);

  // Interactive Knowledge Graph state
  const [selectedGraphNode, setSelectedGraphNode] = useState<{name: string; rule: string; type: string} | null>({
    name: "Sovereignty of Mind",
    rule: "First principle of The White Room: Decouple your mind strictly from emotional variables. If external noise dictates your action, you have surrendered executive power.",
    type: "Discipline"
  });

  // Reference hooks
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const readingAssistBottomRef = useRef<HTMLDivElement>(null);

  // Load from local storage
  useEffect(() => {
    const savedProgress = localStorage.getItem('wr_progress');
    if (savedProgress) setUserProgress(JSON.parse(savedProgress));

    const savedNotes = localStorage.getItem('wr_notes');
    if (savedNotes) setNotes(JSON.parse(savedNotes));

    const savedBookmarks = localStorage.getItem('wr_bookmarks');
    if (savedBookmarks) setBookmarks(JSON.parse(savedBookmarks));

    const savedHighlights = localStorage.getItem('wr_highlights');
    if (savedHighlights) setHighlights(JSON.parse(savedHighlights));

    const savedCache = localStorage.getItem('wr_expanded_cache');
    if (savedCache) setExpandedContentCache(JSON.parse(savedCache));
  }, []);

  // Save to local storage on update
  useEffect(() => {
    localStorage.setItem('wr_progress', JSON.stringify(userProgress));
  }, [userProgress]);

  useEffect(() => {
    localStorage.setItem('wr_notes', JSON.stringify(notes));
    // Update count in progress
    setUserProgress(prev => ({ ...prev, notesCount: notes.length }));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('wr_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem('wr_highlights', JSON.stringify(highlights));
  }, [highlights]);

  useEffect(() => {
    localStorage.setItem('wr_expanded_cache', JSON.stringify(expandedContentCache));
  }, [expandedContentCache]);

  // Quote carousel auto-timer
  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % archiveQuotes.length);
    }, 9000);
    return () => clearInterval(interval);
  }, []);

  // Scroll to bottom of chats
  useEffect(() => {
    if (activeTab === 'tutor' && chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [tutorMessages, activeTab]);

  useEffect(() => {
    if (readingAssistBottomRef.current) {
      readingAssistBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [readingAssistantChat]);

  // Retrieve book data structure based on selection
  const getActiveItemContent = () => {
    if (currentBookId === 'book1') {
      const idx = parseInt(selectedItemId) || 1;
      const preseeded = preseededBook1Content[idx];
      const cachedExpanded = expandedContentCache[`book1-${idx}`] || "";
      
      if (preseeded) {
        return {
          title: `Rule ${idx}: ${preseeded.title}`,
          subtitle: preseeded.subtitle,
          category: "Discipline and Self-Mastery",
          text: `
### CORE PRINCIPLE
${preseeded.explanation}

### WHY IT STRATEGICALLY MATTERS
${preseeded.whyItMatters}

### FIRST-PERSON CASE STUDY
${preseeded.realLifeExample}

### DEBILITATING COMMON MISTAKES
${preseeded.commonMistakes}

### PRACTICAL DISCIPLINE DRILL
${preseeded.practicalExercise}

${cachedExpanded ? `### ⚡ ARCHIVAL DEEP STUDY MODULE (Expanded Page Insights)\n${cachedExpanded}` : ''}
          `,
          reflectionQuestions: preseeded.reflectionQuestions,
          keyTakeaways: preseeded.keyTakeaways,
          isPreseeded: true
        };
      } else {
        // Dynamically generated rule schema (allows rules 4-100 to still render elegantly!)
        const outline = book1RulesList.find(r => r.number === idx) || book1RulesList[0];
        return {
          title: `Rule ${idx}: ${outline.title}`,
          subtitle: outline.subtitle,
          category: outline.vibe,
          text: `
### PREPARATION STUDY PROTOCOL
You are looking at historical White Room Rule ${idx}: *${outline.title}* (${outline.subtitle}). This chapter content requires initialization. Tap "⚡ Deep Archivist Expansion" below to feed strategic matrices and dynamically generate the comprehensive lesson structure, real-life case studies, structural errors, and cognitive exercises from the AI archives.

${cachedExpanded ? `### ⚡ ARCHIVAL DEEP STUDY MODULE (Expanded Page Insights)\n${cachedExpanded}` : '*(Note: Once generated, content persists on your local dashboard)*'}
          `,
          reflectionQuestions: ["How does this strategic rule translate to your immediate tactical hurdles?", "What triggers indicate you are violating this standard?", "How can you implement this in your next social checkpoint?"],
          keyTakeaways: [`Understand Rule ${idx}: ${outline.title}`, outline.subtitle],
          isPreseeded: false
        };
      }
    } else if (currentBookId === 'book2') {
      const idx = parseInt(selectedItemId) || 1;
      const preseeded = preseededBook2Content[idx];
      const cachedExpanded = expandedContentCache[`book2-${idx}`] || "";

      if (preseeded) {
        return {
          title: `Situation ${idx}: ${preseeded.title}`,
          subtitle: "Strategic Social Response Plan",
          category: "Social Intelligence & Decision-Making",
          text: `
### THE TACTICAL SCENARIO
${preseeded.scenario}

### INVOLUNTARY DEFAULT RESPONSE (Reactivity Error)
*${preseeded.commonResponse}*

### THE SOVEREIGN SYSTEMATIC RESPONSE
**${preseeded.strategicResponse}**

### DEEP STRUCTURAL ANALYSIS
${preseeded.analysis}

### COGNITIVE PSYCHOLOGY MATRIX
${preseeded.psychologyBehindIt}

${cachedExpanded ? `### ⚡ ARCHIVAL DEEP STUDY MODULE (Expanded Page Insights)\n${cachedExpanded}` : ''}
          `,
          reflectionQuestions: [preseeded.reflectionExercise],
          keyTakeaways: preseeded.lessonsLearned,
          isPreseeded: true
        };
      } else {
        const outline = book2SituationsList.find(s => s.number === idx) || book2SituationsList[0];
        return {
          title: `Situation ${idx}: ${outline.title}`,
          subtitle: outline.category,
          category: "Social Intelligence & Decision-Making",
          text: `
### THE TACTICAL SCENARIO
${outline.preview}

### SOCIAL DEVIATION DRILL
You have accessed Situation ${idx}: *${outline.title}*. Press "⚡ Deep Archivist Expansion" to generate the behavioral outline analysis, default emotional reactions, professional responses, underlying cognitive psychology theory, and practical reflections to master this dilemma.

${cachedExpanded ? `### ⚡ ARCHIVAL DEEP STUDY MODULE (Expanded Page Insights)\n${cachedExpanded}` : '*(Note: Once generated, content persists on your local dashboard)*'}
          `,
          reflectionQuestions: ["Why do people default to panic responses here?", "What objective ledger allows you to decouple your ego during this scenario?"],
          keyTakeaways: [`Master Situation ${idx}: ${outline.title}`],
          isPreseeded: false
        };
      }
    } else {
      // Book 3: Understanding Human Nature
      const preseeded = preseededBook3Content[selectedItemId];
      const cachedExpanded = expandedContentCache[`book3-${selectedItemId}`] || "";

      if (preseeded) {
        return {
          title: `Chapter ${preseeded.chapterNumber}: ${preseeded.title}`,
          subtitle: `Study Focus: ${preseeded.topic}`,
          category: "Psychology & Behavioral Analysis",
          text: `
### PRIMAL INTRODUCTION
${preseeded.introduction}

### CORE COGNITIVE MECHANISMS
${preseeded.concepts.map(c => `
#### ◌ ${c.name}
* **Definition**: ${c.description}
* **Behavioral Fingerprint**: ${c.example}
`).join('\n')}

### EXTRACTED EXPLANATION
${preseeded.explanation}

### SYSTEMIC CASE STUDY: "${preseeded.caseStudy.title}"
* **Setup**: ${preseeded.caseStudy.setup}
* **Outcome**: ${preseeded.caseStudy.outcome}

${cachedExpanded ? `### ⚡ ARCHIVAL DEEP STUDY MODULE (Expanded Page Insights)\n${cachedExpanded}` : ''}
          `,
          reflectionQuestions: preseeded.reflectionQuestions,
          keyTakeaways: [...preseeded.keyLessons, ...preseeded.caseStudy.lessons],
          isPreseeded: true
        };
      } else {
        const outline = book3ChaptersList.find(c => c.id === selectedItemId) || book3ChaptersList[0];
        return {
          title: `Chapter ${outline.chapterNumber}: ${outline.title}`,
          subtitle: `Study Focus: ${outline.topic}`,
          category: "Psychology & Behavioral Analysis",
          text: `
### RESTRUCTURING BLUEPRINT
Focus Study Profile: *${outline.topic}*. Description of matrix: ${outline.description}.

Click "⚡ Deep Archivist Expansion" below to request our server-side psychology generator to outline core behaviors, case histories, micro-exercises, and systematic reflections for this chapter.

${cachedExpanded ? `### ⚡ ARCHIVAL DEEP STUDY MODULE (Expanded Page Insights)\n${cachedExpanded}` : '*(Note: Once generated, content persists on your local dashboard)*'}
          `,
          reflectionQuestions: ["How does this cognitive model manifest in high-stress situations?"],
          keyTakeaways: [`Examine ${outline.title}`],
          isPreseeded: false
        };
      }
    }
  };

  const activeContent = getActiveItemContent();

  // Helper: Trigger deep AI expansion of the active chapter (helps users exceed 69 pages progressively!)
  const handleDeepArchiveExpansion = async () => {
    setIsExpandingPage(true);
    const contentKey = `${currentBookId}-${selectedItemId}`;

    const promptContext = `
      Current Book: ${currentBookId === 'book1' ? 'The White Room Rules' : currentBookId === 'book2' ? 'Strategic Behavior Handbook' : 'Understanding Human Nature Textbook'}
      Target Title: ${activeContent.title}
      Subtitle: ${activeContent.subtitle}
      Category: ${activeContent.category}
      
      We need to expand the educational depth of this specific entry to support the user's focus on deep reading.
      Please write a comprehensive, academic, and highly technical addendum. Include:
      1. SECOND-ORDER EFFECTS (What happens downstream).
      2. NEUROLOGICAL OR PSYCHOLOGICAL BASES (e.g., prefrontal cortex role, cognitive biases, dopamine loops).
      3. CRITICAL SYSTEMS EXERCISES (Include 2 highly disciplined drills the reader can practice).
      4. A FICTIONAL YET HIGHLY MATURE SCENARIO featuring an analytical strategist who resolves a high-level impasse smoothly.
      
      Maintain a clinical, highly analytical, mature voice (Ayanokoji style). Avoid emotional filler. Avoid emojis.
    `;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: "Please write a comprehensive, 1000-word academic chapter expansion to exceed 69 pages.",
          context: promptContext,
          systemCommand: "You are the primary text generator of The White Room handbooks. Produce detailed documentation. Do not say hello or provide conversational preambles. Output pure markdown content ready to append."
        })
      });

      const data = await response.json();
      if (data.text) {
        const expandedText = data.text;
        setExpandedContentCache(prev => ({
          ...prev,
          [contentKey]: expandedText
        }));

        // Reward user
        setUserProgress(prev => {
          const isCompleted = prev.completedIds.includes(contentKey);
          return {
            ...prev,
            completedIds: isCompleted ? prev.completedIds : [...prev.completedIds, contentKey],
            book1CompletedCount: currentBookId === 'book1' ? prev.book1CompletedCount + 1 : prev.book1CompletedCount,
            book2CompletedCount: currentBookId === 'book2' ? prev.book2CompletedCount + 1 : prev.book2CompletedCount,
            book3CompletedCount: currentBookId === 'book3' ? prev.book3CompletedCount + 1 : prev.book3CompletedCount,
          };
        });

        // Trigger streak validation
        validateStreak();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsExpandingPage(false);
    }
  };

  // Helper: Post a question to the active chapter's AI assistant
  const handleAskReadingAssistant = async () => {
    if (!readingAssistantInput.trim()) return;
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: readingAssistantInput,
      createdAt: new Date().toLocaleTimeString()
    };
    setReadingAssistantChat(prev => [...prev, userMsg]);
    setReadingAssistantInput('');
    setIsSendingReadingAssist(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMsg.text,
          context: activeContent.text + "\n" + activeContent.title,
          systemCommand: "You are the built-in Reading Assistant inside the active page. Help the user break down concepts, summarize sections, or provide customized application examples for this chapter. Keep answers concise, cold, logical, and highly practical."
        })
      });

      const data = await response.json();
      if (data.text) {
        setReadingAssistantChat(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'model',
          text: data.text,
          createdAt: new Date().toLocaleTimeString()
        }]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSendingReadingAssist(false);
    }
  };

  // Helper: Open dedicated Chat with Tutor
  const handleSendTutorChat = async () => {
    if (!chatInput.trim()) return;
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: chatInput,
      createdAt: new Date().toLocaleTimeString()
    };
    setTutorMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsSendingChat(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMsg.text,
          chatHistory: tutorMessages,
          systemCommand: "You are the High-Rank AI Tutor of The White Room Archives. Train the user on elite cognitive tactics. Give behavioral scenarios, test their observation skills, and offer advice on self-responsibility and strategy. Maintain a cold, intelligent, dignified persona."
        })
      });

      const data = await response.json();
      if (data.text) {
        setTutorMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'model',
          text: data.text,
          createdAt: new Date().toLocaleTimeString()
        }]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSendingChat(false);
    }
  };

  // Helper: Mark lesson or challenge completed (rewards user XP & maintains streak)
  const completeDailyLesson = () => {
    if (dailyLessonCompleted) return;
    setDailyLessonCompleted(true);
    setUserProgress(prev => ({
      ...prev,
      streak: prev.streak + 1,
      badgeIds: prev.badgeIds.includes('badge-disciple') ? prev.badgeIds : [...prev.badgeIds, 'badge-disciple']
    }));
  };

  const completeDailyChallenge = () => {
    if (dailyChallengeCompleted) return;
    setDailyChallengeCompleted(true);
    setUserProgress(prev => ({
      ...prev,
      badgeIds: prev.badgeIds.includes('badge-overachiever') ? prev.badgeIds : [...prev.badgeIds, 'badge-overachiever']
    }));
  };

  const validateStreak = () => {
    const today = new Date().toISOString().split('T')[0];
    if (userProgress.lastActiveDate !== today) {
      setUserProgress(prev => ({
        ...prev,
        streak: prev.streak + 1,
        lastActiveDate: today
      }));
    }
  };

  // Bookmark / Note toggle rules
  const handleToggleBookmark = () => {
    const targetKey = `${currentBookId}-${selectedItemId}`;
    const exists = bookmarks.find(b => b.targetId === targetKey);
    if (exists) {
      setBookmarks(prev => prev.filter(b => b.targetId !== targetKey));
    } else {
      const newBM: BookmarkType = {
        id: Date.now().toString(),
        targetId: targetKey,
        targetTitle: activeContent.title,
        bookId: currentBookId,
        createdAt: new Date().toLocaleDateString()
      };
      setBookmarks(prev => [newBM, ...prev]);
    }
  };

  const handleAddNote = () => {
    if (!newNoteText.trim()) return;
    const newN: UserNote = {
      id: Date.now().toString(),
      targetId: `${currentBookId}-${selectedItemId}`,
      targetTitle: activeContent.title,
      bookId: currentBookId,
      content: newNoteText,
      createdAt: new Date().toLocaleDateString()
    };
    setNotes(prev => [newN, ...prev]);
    setNewNoteText('');
  };

  const handleDeleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const handleAddHighlight = () => {
    const selectedText = window.getSelection()?.toString();
    if (!selectedText || selectedText.trim().length === 0) {
      alert("Highlight Tip: Simply drag-select any text on the page with your cursor and click this button to freeze it inside your study log!");
      return;
    }
    const newHL: HighlightType = {
      id: Date.now().toString(),
      targetId: `${currentBookId}-${selectedItemId}`,
      text: selectedText,
      color: highlightColor,
      createdAt: new Date().toLocaleDateString()
    };
    setHighlights(prev => [newHL, ...prev]);
  };

  const deleteHighlight = (id: string) => {
    setHighlights(prev => prev.filter(h => h.id !== id));
  };

  // Switch reading focus item securely
  const navigateItem = (direction: 'prev' | 'next') => {
    const activeIdx = parseInt(selectedItemId) || 1;
    let nextIdx = activeIdx;
    
    if (currentBookId === 'book1') {
      nextIdx = direction === 'prev' ? activeIdx - 1 : activeIdx + 1;
      if (nextIdx < 1) nextIdx = 100;
      if (nextIdx > 100) nextIdx = 1;
    } else if (currentBookId === 'book2') {
      nextIdx = direction === 'prev' ? activeIdx - 1 : activeIdx + 1;
      if (nextIdx < 1) nextIdx = 50;
      if (nextIdx > 50) nextIdx = 1;
    } else {
      // Book 3
      const outlines = book3ChaptersList;
      const currentPos = outlines.findIndex(o => o.id === selectedItemId);
      let nextPos = direction === 'prev' ? currentPos - 1 : currentPos + 1;
      if (nextPos < 0) nextPos = outlines.length - 1;
      if (nextPos >= outlines.length) nextPos = 0;
      
      setSelectedItemId(outlines[nextPos].id);
      return;
    }
    
    setSelectedItemId(nextIdx.toString());
  };

  // Custom visual components for modern portrait handling
  const portraitItems = [
    {
      title: "Observation Skills Training",
      quote: "People only see what they want to see.",
      author: "Ayanokoji Kiyotaka",
      src: IMAGE_PORTRAIT_QUOTE,
      desc: "Primal study of behavioral inconsistencies. To discover fact, filter out expectation entirely."
    },
    {
      title: "Understanding Human Nature",
      quote: "To control the vector, dismantle the ego.",
      author: "The White Room Rules",
      src: IMAGE_MASK_GLOW,
      desc: "Human action follows systemic self-optimization parameters (Security, Status, Preservation)."
    },
    {
      title: "Strategic Decision-Making",
      quote: "Emotional reactions arePredictably predictably toxic.",
      author: "Miyamoto Musashi Model",
      src: IMAGE_CHESS,
      desc: "Tactical positioning on the grand social canvas. Win matches before sound leaves your lips."
    }
  ];

  const badgesList: AchievementBadge[] = [
    { id: 'badge-sovereign', title: 'Sovereign Core', description: 'Decoupled emotional state from 10+ external metrics.', criteria: 'Pre-granted', icon: '💎' },
    { id: 'badge-pioneer', title: 'White Room Pioneer', description: 'Initiated training chamber of strategic archives.', criteria: 'Join App', icon: '♟' },
    { id: 'badge-disciple', title: 'Observational Disciple', description: 'Finished a full Daily Lesson Insight successfully.', criteria: 'Complete Daily Lesson', icon: '👁' },
    { id: 'badge-overachiever', title: 'Discipline Master', description: 'Completed a customized high-friction discipline challenge.', criteria: 'Complete Challenge', icon: '🛡' }
  ];

  return (
    <div id="white_room_container" className={`min-h-screen transition-colors duration-500 ease-in-out font-sans ${isDarkMode ? 'bg-[#0A0A0A] text-[#E5E5E5]' : 'bg-[#F8F8F8] text-[#111111]'}`}>
      
      {/* GLOBAL NAVBAR */}
      <header id="room_header" className={`sticky top-0 z-50 border-b transition-colors duration-300 ${isDarkMode ? 'bg-[#0A0A0A]/90 border-[#262626] backdrop-blur' : 'bg-[#FFFFFF]/90 border-[#E5E5E5] backdrop-blur'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className={`p-2 rounded-md ${isDarkMode ? 'bg-[#1A1A1A] text-white border border-[#2A2A2A]' : 'bg-[#FFFFFF] text-black border border-[#E5E5E5]'}`}>
              <Brain className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 id="app_title" className="text-lg font-bold tracking-widest uppercase">
                THE WHITE ROOM ARCHIVES
              </h1>
              <p className="text-[10px] tracking-wider text-neutral-500 font-mono">
                KNOWLEDGE IS FREE. UNDERSTANDING IS EARNED.
              </p>
            </div>
          </div>

          {/* Tab Selection buttons */}
          <nav id="nav_links" className="hidden md:flex space-x-1 items-center font-mono">
            {[
              { id: 'home', label: 'Archival Portal', icon: Compass },
              { id: 'library', label: 'The Shelf', icon: BookOpen },
              { id: 'reading', label: 'Reading Chamber', icon: Bookmark },
              { id: 'tutor', label: 'AI Tutor', icon: Cpu },
              { id: 'dashboard', label: 'Your Dashboard', icon: Award }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`nav_btn_${tab.id}`}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 text-xs uppercase tracking-widest rounded transition-all duration-300 flex items-center space-x-2 ${
                    isActive 
                      ? isDarkMode ? 'bg-white text-black font-bold' : 'bg-black text-white font-bold'
                      : isDarkMode ? 'text-neutral-400 hover:text-white hover:bg-white/5' : 'text-neutral-600 hover:text-black hover:bg-black/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Header System: Dark Mode / Quick Streak */}
          <div id="header_controls" className="flex items-center space-x-3">
            <div className={`flex items-center px-3 py-1.5 rounded text-xs font-mono border ${isDarkMode ? 'bg-[#161616] border-[#222222] text-[#BFBFBF]' : 'bg-white border-[#E5E5E5] text-neutral-700'}`}>
              <Activity className="w-3.5 h-3.5 mr-2 text-yellow-500" />
              <span>STREAK: {userProgress.streak} DAYS</span>
            </div>
            <button
              id="theme_toggle_btn"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded border transition-colors ${isDarkMode ? 'bg-[#1F1F1F] hover:bg-neutral-800 border-[#2A2A2A] text-white' : 'bg-white hover:bg-neutral-100 border-[#E5E5E5] text-black'}`}
              title="Toggle Theme Mode"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE TAB BAR */}
      <div id="mobile_navbar" className={`md:hidden fixed bottom-0 left-0 right-0 z-50 border-t flex items-center justify-around py-2 px-1 font-mono text-[10px] uppercase tracking-widest ${isDarkMode ? 'bg-[#0F0F0F] border-[#202020]' : 'bg-white border-neutral-200'}`}>
        {[
          { id: 'home', label: 'Portal', icon: Compass },
          { id: 'library', label: 'Shelf', icon: BookOpen },
          { id: 'reading', label: 'Chamber', icon: Bookmark },
          { id: 'tutor', label: 'Tutor', icon: Cpu },
          { id: 'dashboard', label: 'Stats', icon: Award }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex flex-col items-center justify-center p-2 rounded transition-all duration-300 ${isActive ? 'text-blue-400 font-bold' : 'text-neutral-500'}`}
            >
              <Icon className="w-4 h-4 mb-1" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* MAIN BODY WRAPPER */}
      <main id="main_content_area" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 transition-all duration-300">
        
        {/* TAB 1: LANDING PORTAL (HOME) */}
        {activeTab === 'home' && (
          <div id="tab_portal" className="space-y-12">
            
            {/* HERO HERO SECTION */}
            <div className="relative rounded overflow-hidden p-8 sm:p-12 border transition-all duration-300 bg-cover bg-center flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-r from-black via-neutral-900 to-black text-white border-neutral-800">
              <div className="space-y-6 md:max-w-2xl relative z-10">
                <span className="inline-block px-3 py-1 rounded text-[10px] font-mono tracking-widest border border-[#BFBFBF] bg-white/5 text-[#E5E5E5] uppercase">
                  UNPAID • AD-FREE • RAW UNDERSTANDING FOREVER
                </span>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter leading-none uppercase">
                  THE WHITE ROOM ARCHIVES
                </h1>
                <p className="text-lg text-[#BFBFBF] font-mono italic max-w-xl">
                  "Master Human Nature. Master Yourself."
                </p>
                <p className="text-sm text-neutral-400 max-w-2xl leading-relaxed">
                  Welcome to the world's most advanced digital training environment. Access a clean, beautiful library dedicated to psychology, behavioral analysis, emotional intelligence, strategic thinking, discipline, and absolute self-mastery. Designed to replicate high-focus reading suites under elite parameters.
                </p>
                <div className="flex flex-wrap gap-3 font-mono pt-2">
                  <button onClick={() => { setActiveTab('reading'); setCurrentBookId('book1'); setSelectedItemId('1'); }} className="px-6 py-3 bg-white text-black font-bold uppercase text-xs tracking-widest hover:bg-neutral-200 transition-all rounded">
                    Start Reading Book I
                  </button>
                  <button onClick={() => setActiveTab('library')} className="px-6 py-3 border border-white text-white font-bold uppercase text-xs tracking-widest hover:bg-white/10 transition-all rounded">
                    Explore Library
                  </button>
                  <button onClick={() => { setActiveTab('dashboard'); }} className="px-6 py-3 bg-[#1A1A1A] hover:bg-[#252525] text-[#E5E5E5] border border-neutral-800 uppercase text-xs tracking-widest transition-all rounded">
                    Analyze My Training
                  </button>
                </div>
              </div>

              {/* Minimal SVG Emblem */}
              <div className="w-56 h-56 flex items-center justify-center relative flex-shrink-0">
                <div className="absolute inset-0 border border-white/10 rounded-full animate-spin [animation-duration:40s]"></div>
                <div className="absolute inset-2 border border-dashed border-white/20 rounded-full animate-spin [animation-duration:20s] [animation-direction:reverse]"></div>
                <div className="bg-white/5 p-6 rounded-full border border-white/25 backdrop-blur-sm z-10 flex flex-col items-center">
                  <span className="text-[10px] font-mono tracking-[#0.4em] text-neutral-400 uppercase">CORE STAMP</span>
                  <Brain className="w-12 h-12 text-white my-2" />
                  <span className="text-[9px] font-mono text-neutral-400 uppercase">SYS_ACTIVE_2026</span>
                </div>
              </div>
            </div>

            {/* LIVE QUOTE TICKER */}
            <div id="quote_slider" className={`border p-6 rounded transition-all duration-300 flex items-center items-stretch gap-6 ${isDarkMode ? 'bg-[#121212] border-[#2A2A2A]' : 'bg-white border-[#E5E5E5] shadow-sm'}`}>
              <div className="flex items-center justify-center p-4 bg-red-900/10 text-red-500 rounded border border-red-500/20">
                <Activity className="w-6 h-6 shrink-0" />
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-500">Daily Instructive Insight</span>
                <p className="text-lg font-mono tracking-tight font-semibold mt-1">
                  "{archiveQuotes[quoteIndex].text}"
                </p>
                <div className="flex items-center space-x-2 mt-2 text-xs font-mono text-neutral-500">
                  <span className="font-bold text-neutral-400">— {archiveQuotes[quoteIndex].author}</span>
                  <span>|</span>
                  <span className="italic">{archiveQuotes[quoteIndex].source}</span>
                  <span>|</span>
                  <span className="text-[10px] bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded uppercase font-bold text-[8px]">{archiveQuotes[quoteIndex].focus}</span>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                {archiveQuotes.map((_, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setQuoteIndex(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${idx === quoteIndex ? 'bg-white scale-125' : 'bg-neutral-600 hover:bg-neutral-400'}`} 
                    title={`Go to quote ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* THREE PREMIUM ILLUSTRATIONS PORTRAITS - DYNAMIC GALLERY */}
            <div id="portrait_gallery" className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold tracking-widest uppercase font-mono">
                    THE ARCHIVAL COGNITION PORTRAITS
                  </h2>
                  <p className="text-xs text-neutral-500 font-mono">
                    Visual anchors to induce cognitive focus and emotional decompression.
                  </p>
                </div>
                <div className="flex items-center space-x-2 text-xs font-mono text-neutral-400 border border-neutral-800 px-3 py-1 rounded bg-black/10">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
                  <span>LIVE LOAD RATIO: OPTIMAL</span>
                </div>
              </div>

              {/* Portrait Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {portraitItems.map((item, index) => (
                  <div
                    key={index}
                    className={`relative overflow-hidden rounded border transition-all duration-500 flex flex-col ${
                      isDarkMode ? 'bg-[#111111] border-[#242424] hover:border-white/50' : 'bg-white border-[#E0E0E0] hover:border-black/50'
                    }`}
                    onMouseEnter={() => setHoveredImageIndex(index)}
                    onMouseLeave={() => setHoveredImageIndex(null)}
                  >
                    <div className="relative aspect-[4/5] overflow-hidden bg-neutral-900 group">
                      {/* Image loading state fallback background */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0D0D0D] text-neutral-500 text-xs font-mono p-4 text-center">
                        <Cpu className="w-8 h-8 mb-2 animate-spin text-neutral-700" />
                        <span>DECRUNCHING PORTRAIT STREAM...</span>
                      </div>
                      
                      {/* Realistic Portrait Img */}
                      <img
                        src={item.src}
                        alt={item.title}
                        className={`w-full h-full object-cover relative z-10 transition-transform duration-700 ease-out ${
                          hoveredImageIndex === index ? 'scale-105 filter saturate-[1.2]' : 'scale-100 filter grayscale'
                        }`}
                        onError={(e) => {
                          // Clean graceful fallback if CDN blocked
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      
                      {/* Visual Glass Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent z-20" />
                      <div className="absolute bottom-4 left-4 right-4 z-30 text-white space-y-1">
                        <span className="text-[9px] font-mono text-yellow-500 tracking-widest uppercase">MODULE {index + 1}</span>
                        <h3 className="font-bold uppercase tracking-wider text-sm">{item.title}</h3>
                        <p className="text-xs text-neutral-300 italic">"{item.quote}"</p>
                      </div>
                    </div>
                    
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
                        {item.desc}
                      </p>
                      <button
                        onClick={() => {
                          setActiveTab('reading');
                          setCurrentBookId(index === 0 ? 'book1' : index === 1 ? 'book3' : 'book2');
                          setSelectedItemId(index === 0 ? '1' : index === 1 ? 'human-nature-c1' : '1');
                        }}
                        className={`w-full py-2 rounded text-[10px] font-bold uppercase tracking-widest transition-all font-mono border ${
                          isDarkMode 
                            ? 'bg-[#1F1F1F] text-white border-neutral-800 hover:border-neutral-500 hover:bg-neutral-800' 
                            : 'bg-neutral-100 text-black border-neutral-300 hover:border-neutral-500 hover:bg-neutral-200'
                        }`}
                      >
                        Enter Study Mode
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* BENTO ROADMAP / SYSTEM SECTIONS */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-extrabold tracking-widest uppercase font-mono">
                  ARCHIVES MAP & SYSTEMS PATHWAY
                </h2>
                <p className="text-xs text-neutral-500 font-mono">
                  Navigate our structural outline. Ten complete spheres of modern tactical competence.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {[
                  { num: "01", title: "White Room Rules", focus: "Absolute Discipline", path: "book1" },
                  { num: "02", title: "Strategic Behavior", focus: "Conflict Sovereignty", path: "book2" },
                  { num: "03", title: "Understanding Nature", focus: "Primal Motive Sifting", path: "book3" },
                  { num: "04", title: "Emotional Intel", focus: "Impulse Decoupling", path: "tutor" },
                  { num: "05", title: "Observation Training", focus: "Visual Calibration", path: "home" },
                  { num: "06", title: "Critical Thinking", focus: "Bias Auditing", path: "dashboard" },
                  { num: "07", title: "Social Dynamics", focus: "Incentive Mapping", path: "library" },
                  { num: "08", title: "Body Language", focus: "Somatic Reading", path: "tutor" },
                  { num: "09", title: "Discipline Academy", focus: "Friction Desensitization", path: "book1" },
                  { num: "10", title: "Decision Masterclass", focus: "Second-Order Auditing", path: "reading" }
                ].map((s, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      if (s.path.startsWith('book')) {
                        setActiveTab('reading');
                        setCurrentBookId(s.path);
                        setSelectedItemId(s.path === 'book3' ? 'human-nature-c1' : '1');
                      } else {
                        setActiveTab(s.path as any);
                      }
                    }}
                    className={`p-5 rounded border transition-all cursor-pointer flex flex-col justify-between space-y-4 group ${
                      isDarkMode 
                        ? 'bg-[#111111] border-[#202020] hover:bg-[#1C1C1C] hover:border-yellow-600/50' 
                        : 'bg-white border-neutral-200 hover:bg-[#F2F2F2] hover:border-neutral-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-neutral-500 group-hover:text-yellow-500">INDEX {s.num}</span>
                      <Sparkles className="w-3.5 h-3.5 text-neutral-600 group-hover:text-yellow-600 group-hover:rotate-12 transition-transform" />
                    </div>
                    <div>
                      <h3 className="font-bold uppercase tracking-wider text-xs">{s.title}</h3>
                      <p className="text-[9px] font-mono text-neutral-500 uppercase mt-1">{s.focus}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* THREE COLUMN DETAILS BANNER (FREE PRINCIPLES) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-neutral-800 font-mono text-center">
              <div className="p-4 space-y-1">
                <span className="text-lg font-bold text-neutral-400">0% ADS OR PAYWALLS</span>
                <p className="text-[11px] text-neutral-500">No locked content, upselling, or tracking. Complete cognitive focus.</p>
              </div>
              <div className="p-4 space-y-1 border-y md:border-y-0 md:border-x border-neutral-800">
                <span className="text-lg font-bold text-neutral-400">100% UNBIASED SCIENCE</span>
                <p className="text-[11px] text-neutral-500">Pragmatic, logical frameworks derived from high-efficiency behaviors.</p>
              </div>
              <div className="p-4 space-y-1">
                <span className="text-lg font-bold text-neutral-400">AI CORE BUILT-IN</span>
                <p className="text-[11px] text-neutral-500">Equipped with active tutors and deep handbooks generator stream.</p>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: LIBRARY EXPLORER (THE SHELF) */}
        {activeTab === 'library' && (
          <div id="tab_library" className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-800 pb-6">
              <div>
                <h2 className="text-3xl font-extrabold tracking-widest uppercase font-mono">
                  THE ARCHIVAL BOOKSHELF
                </h2>
                <p className="text-xs text-neutral-500 font-mono mt-1">
                  Access the training publications. Fully optimized for zero distraction.
                </p>
              </div>
              
              {/* Intelligent live filtering search bar */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  id="library_search_input"
                  type="text"
                  placeholder="Search rules, situations, or focus topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-9 pr-4 py-2 text-xs font-mono rounded border transition-colors outline-none focus:border-neutral-500 ${
                    isDarkMode ? 'bg-[#141414] border-[#292929] text-white' : 'bg-white border-[#D6D6D6] text-black'
                  }`}
                />
              </div>
            </div>

            {/* THREE BOOKS SHELF REPRESENTATION */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* BOOK 1 */}
              <div className={`p-6 rounded border flex flex-col justify-between transition-all ${isDarkMode ? 'bg-[#111111] border-[#262626] hover:border-neutral-600' : 'bg-white border-neutral-200 shadow-sm hover:border-neutral-400'}`}>
                <div className="space-y-4">
                  <div className="h-56 bg-gradient-to-b from-neutral-900 to-black rounded border border-neutral-800 relative flex items-center justify-center p-4 overflow-hidden">
                    {/* Minimalist book skin */}
                    <div className="absolute inset-y-0 left-3 w-1 bg-white/10" />
                    <div className="text-center text-white space-y-2 z-10">
                      <span className="text-[8px] font-mono uppercase tracking-widest text-neutral-400">BOOK VOLUME I</span>
                      <h3 className="font-extrabold text-xl tracking-tighter uppercase leading-none">THE WHITE ROOM RULES</h3>
                      <p className="text-[9px] font-mono tracking-widest text-[#BFBFBF]">DISCIPLINE & SELF-MASTERY</p>
                      <div className="w-12 h-0.5 bg-[#BFBFBF] mx-auto my-3" />
                      <span className="text-[8px] font-mono text-neutral-500 block uppercase">SYSTEM STANDARD DEPT</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] bg-neutral-800 text-neutral-300 px-2 py-0.5 font-mono rounded inline-block uppercase">Handbook</span>
                    <h3 className="text-lg font-bold uppercase mt-2">The White Room Rules</h3>
                    <p className="text-xs text-neutral-400 font-mono mt-1">Focus count: 100 immutable mental directives.</p>
                    <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
                      Deep training manual for mental resilience, Delayed Gratification, long-term focus, accountability, and pristine consistency under absolute pressure.
                    </p>
                  </div>
                </div>
                <div className="pt-6 space-y-2 font-mono">
                  <div className="flex items-center justify-between text-[11px] border-b border-neutral-800 pb-2">
                    <span>PROGRESS STATE:</span>
                    <span className="font-bold">{userProgress.book1CompletedCount} / 100 RULESED</span>
                  </div>
                  <button 
                    onClick={() => { setActiveTab('reading'); setCurrentBookId('book1'); setSelectedItemId('1'); }}
                    className="w-full py-2.5 bg-white text-black font-bold uppercase text-xs tracking-widest rounded hover:bg-neutral-200 transition-colors"
                  >
                    Open Book I
                  </button>
                </div>
              </div>

              {/* BOOK 2 */}
              <div className={`p-6 rounded border flex flex-col justify-between transition-all ${isDarkMode ? 'bg-[#111111] border-[#262626] hover:border-neutral-600' : 'bg-white border-neutral-200 shadow-sm hover:border-neutral-400'}`}>
                <div className="space-y-4">
                  <div className="h-56 bg-gradient-to-b from-[#141E30] to-[#243B55] rounded border border-neutral-800 relative flex items-center justify-center p-4 overflow-hidden">
                    <div className="absolute inset-y-0 left-3 w-1 bg-white/10" />
                    <div className="text-center text-white space-y-2 z-10">
                      <span className="text-[8px] font-mono uppercase tracking-widest text-[#BFBFBF]">BOOK VOLUME II</span>
                      <h3 className="font-extrabold text-xl tracking-tighter uppercase leading-none">STRATEGIC BEHAVIOR</h3>
                      <p className="text-[9px] font-mono tracking-widest text-neutral-300">SOCIAL INTEL & NEGOTIATION</p>
                      <div className="w-12 h-0.5 bg-neutral-300 mx-auto my-3" />
                      <span className="text-[8px] font-mono text-neutral-500 block uppercase">TACTICAL LABELS ARCHIVE</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] bg-neutral-800 text-neutral-300 px-2 py-0.5 font-mono rounded inline-block uppercase">Situations Map</span>
                    <h3 className="text-lg font-bold uppercase mt-2">Strategic Behavior</h3>
                    <p className="text-xs text-neutral-400 font-mono mt-1">Focus count: 50 Real-Life tactical setups.</p>
                    <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
                      Step-by-step psychological manuals explaining how to respond calmly to public pressure, client insults, passive-aggression, credit theft, and conflict systems.
                    </p>
                  </div>
                </div>
                <div className="pt-6 space-y-2 font-mono">
                  <div className="flex items-center justify-between text-[11px] border-b border-neutral-800 pb-2">
                    <span>PROGRESS STATE:</span>
                    <span className="font-bold">{userProgress.book2CompletedCount} / 50 TRAINED</span>
                  </div>
                  <button 
                    onClick={() => { setActiveTab('reading'); setCurrentBookId('book2'); setSelectedItemId('1'); }}
                    className="w-full py-2.5 bg-white text-black font-bold uppercase text-xs tracking-widest rounded hover:bg-neutral-200 transition-colors"
                  >
                    Open Book II
                  </button>
                </div>
              </div>

              {/* BOOK 3 */}
              <div className={`p-6 rounded border flex flex-col justify-between transition-all ${isDarkMode ? 'bg-[#111111] border-[#262626] hover:border-neutral-600' : 'bg-white border-neutral-200 shadow-sm hover:border-neutral-400'}`}>
                <div className="space-y-4">
                  <div className="h-56 bg-gradient-to-b from-[#1C1C1C] to-[#0A0A0A] rounded border border-neutral-800 relative flex items-center justify-center p-4 overflow-hidden">
                    <div className="absolute inset-y-0 left-3 w-1 bg-white/10" />
                    <div className="text-center text-white space-y-2 z-10">
                      <span className="text-[8px] font-mono uppercase tracking-widest text-neutral-400">BOOK VOLUME III</span>
                      <h3 className="font-extrabold text-xl tracking-tighter uppercase leading-none">UNDERSTANDING HUMAN NATURE</h3>
                      <p className="text-[9px] font-mono tracking-widest text-[#BFBFBF]">COGNITIVE PSYCHOLOGY MATRIX</p>
                      <div className="w-12 h-0.5 bg-[#BFBFBF] mx-auto my-3" />
                      <span className="text-[8px] font-mono text-neutral-500 block uppercase">CORE SYSTEM DIAGNOSTIC</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] bg-neutral-800 text-neutral-300 px-2 py-0.5 font-mono rounded inline-block uppercase">Theoretical Textbook</span>
                    <h3 className="text-lg font-bold uppercase mt-2">Understanding Human Nature</h3>
                    <p className="text-xs text-neutral-400 font-mono mt-1">Focus count: 10 Comprehensive analytical chapters.</p>
                    <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
                      Deconstruction of human motivation metrics, confirmation biases, biological triggers, hidden institutional incentives, social proof models, and self-honesty matrices.
                    </p>
                  </div>
                </div>
                <div className="pt-6 space-y-2 font-mono">
                  <div className="flex items-center justify-between text-[11px] border-b border-neutral-800 pb-2">
                    <span>PROGRESS STATE:</span>
                    <span className="font-bold">{userProgress.book3CompletedCount} / 10 EXAMINED</span>
                  </div>
                  <button 
                    onClick={() => { setActiveTab('reading'); setCurrentBookId('book3'); setSelectedItemId('human-nature-c1'); }}
                    className="w-full py-2.5 bg-white text-black font-bold uppercase text-xs tracking-widest rounded hover:bg-neutral-200 transition-colors"
                  >
                    Open Book III
                  </button>
                </div>
              </div>

            </div>

            {/* SEPARATE INDEX / LIST VIEWS FOR ALL RULES & SITUATIONS */}
            <div className="space-y-6 pt-6 index_lists">
              <h3 className="text-xl font-bold font-mono tracking-widest uppercase">
                COMPLETE INDEX LEDGER
              </h3>

              <div className="flex space-x-2 font-mono text-xs">
                {['book1', 'book2', 'book3'].map((bId) => (
                  <button
                    key={bId}
                    onClick={() => { setCurrentBookId(bId); setSelectedItemId(bId === 'book3' ? 'human-nature-c1' : '1'); }}
                    className={`px-4 py-2 rounded border uppercase tracking-wider ${
                      currentBookId === bId 
                        ? 'bg-neutral-800 text-white border-neutral-600' 
                        : 'bg-transparent text-neutral-500 border-neutral-800 hover:text-white'
                    }`}
                  >
                    {bId === 'book1' ? 'Book I Rules (1-100)' : bId === 'book2' ? 'Book II Scenarios (1-50)' : 'Book III Chapters'}
                  </button>
                ))}
              </div>

              {/* Interactive grid of items matching selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {currentBookId === 'book1' && (
                  book1RulesList
                    .filter(r => searchQuery === '' || r.title.toLowerCase().includes(searchQuery.toLowerCase()) || r.subtitle.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((item) => (
                      <div
                        key={item.number}
                        onClick={() => { setSelectedItemId(item.number.toString()); setActiveTab('reading'); }}
                        className={`p-4 rounded border cursor-pointer transition-all flex items-center justify-between ${
                          isDarkMode 
                            ? 'bg-[#121212] border-neutral-800 hover:bg-[#1E1E1E] hover:border-neutral-500' 
                            : 'bg-white border-neutral-200 hover:bg-neutral-100 hover:border-neutral-400'
                        }`}
                      >
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono text-neutral-500 uppercase">Rule {item.number}</span>
                          <h4 className="text-xs font-bold uppercase line-clamp-1">{item.title}</h4>
                          <p className="text-[9px] font-mono text-neutral-400 line-clamp-1">{item.subtitle}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-neutral-600" />
                      </div>
                    ))
                )}

                {currentBookId === 'book2' && (
                  book2SituationsList
                    .filter(s => searchQuery === '' || s.title.toLowerCase().includes(searchQuery.toLowerCase()) || s.category.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((item) => (
                      <div
                        key={item.number}
                        onClick={() => { setSelectedItemId(item.number.toString()); setActiveTab('reading'); }}
                        className={`p-4 rounded border cursor-pointer transition-all flex items-center justify-between ${
                          isDarkMode 
                            ? 'bg-[#121212] border-neutral-800 hover:bg-[#1E1E1E] hover:border-neutral-500' 
                            : 'bg-white border-neutral-200 hover:bg-neutral-100 hover:border-neutral-400'
                        }`}
                      >
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono text-neutral-500 uppercase">Scenario {item.number}</span>
                          <h4 className="text-xs font-bold uppercase line-clamp-1">{item.title}</h4>
                          <p className="text-[9px] font-mono text-yellow-500 uppercase tracking-widest">{item.category}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-neutral-600" />
                      </div>
                    ))
                )}

                {currentBookId === 'book3' && (
                  book3ChaptersList
                    .filter(c => searchQuery === '' || c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.topic.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((item) => (
                      <div
                        key={item.id}
                        onClick={() => { setSelectedItemId(item.id); setActiveTab('reading'); }}
                        className={`p-4 rounded border cursor-pointer transition-all flex items-center justify-between ${
                          isDarkMode 
                            ? 'bg-[#121212] border-neutral-800 hover:bg-[#1E1E1E] hover:border-neutral-500' 
                            : 'bg-white border-neutral-200 hover:bg-neutral-100 hover:border-neutral-400'
                        }`}
                      >
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono text-neutral-500 uppercase">Chapter {item.chapterNumber}</span>
                          <h4 className="text-xs font-bold uppercase line-clamp-1">{item.title}</h4>
                          <p className="text-[9px] font-mono text-neutral-400 line-clamp-1">{item.topic}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-neutral-600" />
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: IMMERSIVE READING CHAMBER */}
        {activeTab === 'reading' && (
          <div id="tab_reading" className="space-y-6">
            
            {/* FOCUS CONTROLS BAR (Sepia, Size, Dark, Focus) */}
            <div className={`p-4 rounded border flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs ${
              isDarkMode ? 'bg-[#121212] border-neutral-800' : 'bg-white border-neutral-200'
            }`}>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setIsFocusMode(!isFocusMode)}
                  className={`px-3 py-1.5 rounded uppercase font-bold text-[10px] tracking-widest border transition-colors ${
                    isFocusMode 
                      ? 'bg-red-500/20 text-red-100 border-red-500/30' 
                      : 'bg-transparent text-neutral-400 border-neutral-800 hover:text-white'
                  }`}
                  title="Toggle distraction-free focus room layout"
                >
                  {isFocusMode ? '◌ FOCUS: ACTIVE' : '◌ FOCUS: INACTIVE'}
                </button>
                <button
                  onClick={() => setSepiaMode(!sepiaMode)}
                  className={`px-3 py-1.5 rounded uppercase font-bold text-[10px] tracking-widest border transition-colors ${
                    sepiaMode 
                      ? 'bg-amber-900/20 text-amber-100 border-amber-900/30' 
                      : 'bg-transparent text-neutral-400 border-neutral-800 hover:text-white'
                  }`}
                >
                  Sepia Mode
                </button>
                
                {/* Font Resizing keys */}
                <div className="flex items-center space-x-1 border border-neutral-800 rounded overflow-hidden">
                  <button onClick={() => setFontSize(prev => Math.max(14, prev - 2))} className="px-3 py-1 bg-[#1E1E1E] text-white font-bold hover:bg-neutral-800 border-r border-neutral-800">-</button>
                  <span className="px-3 text-[10px] text-neutral-400">SIZE: {fontSize}PX</span>
                  <button onClick={() => setFontSize(prev => Math.min(26, prev + 2))} className="px-3 py-1 bg-[#1E1E1E] text-white font-bold hover:bg-neutral-800">+</button>
                </div>
              </div>

              {/* Bookmark status button */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleToggleBookmark}
                  className={`px-3 py-1.5 rounded border flex items-center space-x-1.5 text-[10px] uppercase tracking-widest font-bold ${
                    bookmarks.find(b => b.targetId === `${currentBookId}-${selectedItemId}`)
                      ? 'bg-yellow-500/15 text-yellow-500 border-yellow-500/35'
                      : 'border-neutral-800 hover:text-white text-neutral-400'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>{bookmarks.find(b => b.targetId === `${currentBookId}-${selectedItemId}`) ? 'Bookmarked' : 'Bookmark'}</span>
                </button>

                <button
                  onClick={handleAddHighlight}
                  className="px-3 py-1.5 rounded border border-neutral-800 hover:text-white text-neutral-400 flex items-center space-x-1.5 text-[10px] uppercase tracking-widest font-bold"
                  title="Drag select text and tap to save highlighters"
                >
                  <PenTool className="w-3.5 h-3.5" />
                  <span>Highlight Select</span>
                </button>
              </div>
            </div>

            {/* SPLIT READING ROW (MAIN TEXT VS STUDY CORE SIDEBAR) */}
            <div className={`grid grid-cols-1 lg:grid-cols-4 gap-6 transition-all`}>
              
              {/* PRIMARY TEXT READER SHEET */}
              <div className={`lg:col-span-3 rounded border transition-all duration-300 p-6 sm:p-10 ${
                sepiaMode 
                  ? 'bg-[#F4ECD8] text-[#433422] border-[#D6C4A6]' 
                  : isDarkMode 
                    ? 'bg-[#0E0E0E] border-[#202020] text-neutral-300' 
                    : 'bg-white border-neutral-200 text-[#111111] shadow'
              }`}>
                {/* Category metadata */}
                <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-widest text-neutral-500 border-b border-neutral-500/10 pb-4 mb-6">
                  <div className="flex items-center space-x-1">
                    <span>{currentBookId === 'book1' ? 'Book VOLUME I' : currentBookId === 'book2' ? 'Book VOLUME II' : 'Book VOLUME III'}</span>
                    <span>/</span>
                    <span className="text-yellow-600 font-bold">{activeContent.category}</span>
                  </div>
                  <div>
                    <span>EST READING TIME: ~4 MINS</span>
                  </div>
                </div>

                {/* Main Titles */}
                <div className="space-y-2 mb-8">
                  <h2 className="text-2xl sm:text-3.5xl font-black uppercase tracking-tight leading-none font-mono">
                    {activeContent.title}
                  </h2>
                  <p className="text-sm font-mono italic text-neutral-500">
                    "{activeContent.subtitle}"
                  </p>
                </div>

                {/* BODY CONTENT - MARKDOWN INTERPRETING SIMULATION */}
                <div 
                  id="study_text_frame"
                  className="leading-relaxed whitespace-pre-wrap selection:bg-yellow-500 selection:text-black font-serif" 
                  style={{ fontSize: `${fontSize}px` }}
                >
                  {activeContent.text}
                </div>

                {/* REFLECTIONS AND STUDY EXERCISES BLOCK */}
                <div className={`mt-12 p-6 rounded border font-mono text-xs space-y-6 ${
                  sepiaMode 
                    ? 'bg-[#EAE2CE] border-[#C8B898] text-[#5C4A3A]' 
                    : isDarkMode 
                      ? 'bg-[#161616] border-[#292929] text-neutral-300' 
                      : 'bg-neutral-50 border-neutral-200 text-neutral-700'
                }`}>
                  <div className="space-y-4">
                    <h4 className="font-extrabold uppercase tracking-wide flex items-center gap-2 border-b border-neutral-500/10 pb-2">
                      <Brain className="w-4 h-4 text-neutral-400" />
                      <span>COGNITIVE REFLECTION PROTOCOLS</span>
                    </h4>
                    <ol className="list-decimal list-inside space-y-3">
                      {activeContent.reflectionQuestions.map((q, idx) => (
                        <li key={idx} className="leading-relaxed">{q}</li>
                      ))}
                    </ol>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-neutral-500/10">
                    <h4 className="font-extrabold uppercase tracking-wide flex items-center gap-2">
                      <Award className="w-4 h-4 text-yellow-500" />
                      <span>SYSTEMIC TAKEAWAYS</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {activeContent.keyTakeaways.map((k, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                          <span>{k}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* PROGRESSIVE HANDBOOK CONTENT EXPANSION (⚡ Allows pages to exceed 69 pages!) */}
                <div className="mt-8 border-t border-neutral-500/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold uppercase text-neutral-400 flex items-center gap-2">
                      <Layers className="w-3.5 h-3.5 text-blue-500" />
                      <span>PROGRESSIVE HANDBOOK SYSTEM</span>
                    </h4>
                    <p className="text-[10px] text-neutral-500 max-w-lg leading-tight">
                      Exceed 69 pages for each Volume. Expand current entries with server-side AI academic blueprints and strategic simulation blocks.
                    </p>
                  </div>

                  <button
                    onClick={handleDeepArchiveExpansion}
                    disabled={isExpandingPage}
                    className={`w-full sm:w-auto px-5 py-2.5 rounded font-extrabold uppercase tracking-wider text-[11px] transition-all flex items-center justify-center space-x-2 border shrink-0 ${
                      isExpandingPage 
                        ? 'bg-neutral-800 text-neutral-500 border-neutral-700 cursor-not-allowed' 
                        : 'bg-white text-black hover:bg-neutral-200 border-white font-bold'
                    }`}
                  >
                    {isExpandingPage ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>FEEDING ARCHIVAL MATRIX...</span>
                      </>
                    ) : (
                      <>
                        <Activity className="w-4 h-4 text-yellow-600 animate-pulse" />
                        <span>⚡ DEEP ARCHIVIST EXPANSION</span>
                      </>
                    )}
                  </button>
                </div>

                {/* BOTTOM CHASSIS PAGE NAVIGATION */}
                <div className="mt-8 pt-6 border-t border-neutral-500/10 flex items-center justify-between font-mono text-xs">
                  <button onClick={() => navigateItem('prev')} className="px-4 py-2 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded flex items-center gap-1 border border-neutral-800">
                    <ChevronLeft className="w-4 h-4" />
                    <span>PREVIOUS MODULE</span>
                  </button>

                  <span className="text-[11px] text-neutral-500 uppercase">
                    {currentBookId === 'book1' ? `Rule ${selectedItemId} of 100` : currentBookId === 'book2' ? `Scenario ${selectedItemId} of 50` : `Study Chapter ${selectedItemId}`}
                  </span>

                  <button onClick={() => navigateItem('next')} className="px-4 py-2 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded flex items-center gap-1 border border-neutral-800">
                    <span>NEXT MODULE</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* STUDY CHASSIS INTEGRATED SIDEBAR (NOTES & ACTIVE PAGE ASSISTANT) */}
              {!isFocusMode && (
                <div className="lg:col-span-1 space-y-6">
                  
                  {/* MEMORIAL NOTEBOX SYSTEM */}
                  <div className={`p-4 rounded border font-mono text-xs space-y-4 ${
                    isDarkMode ? 'bg-[#121212] border-neutral-800' : 'bg-white border-neutral-200'
                  }`}>
                    <h3 className="font-extrabold text-xs uppercase tracking-widest border-b border-neutral-500/15 pb-2">
                      ◌ REFLECTION REGISTER
                    </h3>
                    
                    <div className="space-y-2">
                      <textarea
                        value={newNoteText}
                        onChange={(e) => setNewNoteText(e.target.value)}
                        placeholder="Log personal observations, somatic triggers, or notes..."
                        className={`w-full h-24 p-2 text-[11px] rounded border outline-none resize-none focus:border-neutral-500 ${
                          isDarkMode ? 'bg-[#181818] border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-300 text-black'
                        }`}
                      />
                      <button
                        onClick={handleAddNote}
                        className="w-full py-1.5 bg-neutral-800 text-white rounded hover:bg-neutral-700 transition-colors uppercase text-[10px] tracking-widest font-bold border border-neutral-700"
                      >
                        Record Diagnostic Log
                      </button>
                    </div>

                    {/* Active chapter notes preview */}
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {notes.filter(n => n.targetId === `${currentBookId}-${selectedItemId}`).map(note => (
                        <div key={note.id} className="p-2 rounded bg-neutral-800/40 relative group space-y-1">
                          <p className="text-[10px] text-neutral-400 pr-4 italic">"{note.content}"</p>
                          <div className="flex items-center justify-between text-[8px] text-neutral-500">
                            <span>{note.createdAt}</span>
                            <button onClick={() => handleDeleteNote(note.id)} className="text-red-500 hover:text-red-300">Delete</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ACTIVE AI READING ASSIST COMPANION */}
                  <div className={`p-4 rounded border font-mono text-xs space-y-4 flex flex-col h-[400px] ${
                    isDarkMode ? 'bg-[#121212] border-neutral-800' : 'bg-white border-neutral-200'
                  }`}>
                    <h3 className="font-extrabold text-xs uppercase tracking-widest border-b border-neutral-500/15 pb-2">
                      ◌ CONGNITIVE COMPANION AI
                    </h3>

                    <div className="flex-1 overflow-y-auto space-y-3 p-1">
                      {readingAssistantChat.map((msg, idx) => (
                        <div key={msg.id || idx} className={`p-2.5 rounded text-[11px] ${
                          msg.role === 'user' 
                            ? 'bg-neutral-800/80 text-white ml-6 text-right' 
                            : 'bg-neutral-900/40 text-neutral-300 mr-6'
                        }`}>
                          <p className="leading-normal">{msg.text}</p>
                          <span className="text-[7px] text-neutral-500 block mt-1 uppercase">{msg.role === 'user' ? 'Training Candidate' : 'Archivist Core'} • {msg.createdAt}</span>
                        </div>
                      ))}
                      <div ref={readingAssistBottomRef} />
                    </div>

                    <div className="flex items-center space-x-1.5 pt-2 border-t border-neutral-500/10">
                      <input
                        type="text"
                        placeholder="Ask companion about text..."
                        value={readingAssistantInput}
                        onChange={(e) => setReadingAssistantInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAskReadingAssistant()}
                        disabled={isSendingReadingAssist}
                        className={`flex-1 p-2 text-[10px] rounded border outline-none ${
                          isDarkMode ? 'bg-[#181818] border-neutral-800 text-white animate-pulse-none' : 'bg-neutral-50 border-neutral-300 text-black'
                        }`}
                      />
                      <button
                        onClick={handleAskReadingAssistant}
                        disabled={isSendingReadingAssist}
                        className="p-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded border border-neutral-700 shrink-0"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>
              )}

            </div>
          </div>
        )}

        {/* TAB 4: CHAT WITH DEDICATED AI TUTOR */}
        {activeTab === 'tutor' && (
          <div id="tab_tutor" className="space-y-6">
            <div className="border-b border-neutral-800 pb-6">
              <h2 className="text-3xl font-extrabold tracking-widest uppercase font-mono">
                THE WHITE ROOM AI TRAINING CORE
              </h2>
              <p className="text-xs text-neutral-500 font-mono mt-1">
                Initiate standard cognitive diagnostics. Engage directly with our behavioral strategist.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
              
              {/* TRAINING CRITERIAS & SCENARIOS */}
              <div className="space-y-4 lg:col-span-1">
                <div className={`p-4 rounded border font-mono text-xs space-y-4 h-full ${isDarkMode ? 'bg-[#121212] border-neutral-800' : 'bg-white border-neutral-200'}`}>
                  <h3 className="font-extrabold uppercase tracking-wider text-xs border-b border-neutral-500/15 pb-2">
                    SUGGESTED DIAGNOSTIC SCRIPTS
                  </h3>
                  <div className="space-y-2">
                    {[
                      "Diagnose my social friction when taking negative review insults.",
                      "Evaluate my cognitive defenses regarding delayed gratification loops.",
                      "Formulate a calculated observation checklist for high-stakes deal negotiations.",
                      "How do I practice non-reactivity when coworkers scream or steal credit?"
                    ].map((prompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => setChatInput(prompt)}
                        className={`w-full p-2.5 rounded text-[11px] text-left transition-colors border ${
                          isDarkMode 
                            ? 'bg-[#181818] border-neutral-800 text-neutral-400 hover:bg-[#202020] hover:text-white' 
                            : 'bg-neutral-50 border-neutral-300 text-neutral-700 hover:bg-neutral-100 hover:text-black'
                        }`}
                      >
                        ◌ {prompt}
                      </button>
                    ))}
                  </div>

                  <div className="bg-red-500/10 p-3 rounded text-[10px] text-red-100 border border-red-500/20 leading-relaxed">
                    <strong>Notice:</strong> The companion analyzes responses through an unemotional, highly clinical, and logical sieve. Decouple your ego before reading answers.
                  </div>
                </div>
              </div>

              {/* CONVERTER CHAT PORT */}
              <div className="lg:col-span-3">
                <div className={`p-5 rounded border flex flex-col h-[600px] ${
                  isDarkMode ? 'bg-[#121212] border-neutral-800' : 'bg-white border-[#E5E5E5]'
                }`}>
                  <div className="flex items-center justify-between border-b border-neutral-500/15 pb-3">
                    <div className="flex items-center space-x-2 font-mono">
                      <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
                      <span className="font-black text-xs uppercase text-neutral-300">ACTIVE AI PORTPORT: GRAND_ARCHIVIST_TUTOR_3.5</span>
                    </div>
                    <span className="text-[10px] text-neutral-500 font-mono">ENCRYPTION: SECURE</span>
                  </div>

                  {/* Message scroll log */}
                  <div className="flex-1 overflow-y-auto space-y-4 p-4">
                    {tutorMessages.map(msg => (
                      <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-2xl p-4 rounded text-xs leading-relaxed font-mono ${
                          msg.role === 'user' 
                            ? 'bg-neutral-800 border border-neutral-700 text-white' 
                            : 'bg-neutral-900/60 border border-neutral-800 text-neutral-300'
                        }`}>
                          <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                          <span className="text-[8px] text-neutral-500 block mt-2 text-right uppercase">
                            {msg.role === 'user' ? 'TRAINEE' : 'WHITE ROOM ARCHIVIST'} • {msg.createdAt}
                          </span>
                        </div>
                      </div>
                    ))}
                    {isSendingChat && (
                      <div className="flex justify-start">
                        <div className="bg-neutral-900/30 p-3 rounded border border-neutral-800 text-xs font-mono text-neutral-500 animate-pulse">
                          ◌ SIFTING RELEVANT COGNITIVE ARCHIVES...
                        </div>
                      </div>
                    )}
                    <div ref={chatBottomRef} />
                  </div>

                  {/* Input form */}
                  <div className="border-t border-neutral-500/15 pt-3 gap-2 flex items-center">
                    <input
                      type="text"
                      placeholder="Type your strategic query (e.g., 'Perform an observation diagnostics drill')..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendTutorChat()}
                      disabled={isSendingChat}
                      className={`flex-1 p-3 text-xs font-mono rounded border outline-none ${
                        isDarkMode ? 'bg-[#181818] border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-300 text-black'
                      }`}
                    />
                    <button
                      onClick={handleSendTutorChat}
                      disabled={isSendingChat}
                      className="px-5 py-3 bg-white text-black hover:bg-neutral-200 uppercase tracking-widest text-xs font-bold transition-colors font-mono rounded inline-flex items-center space-x-1"
                    >
                      <span>Query</span>
                      <Send className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 5: INTEGRATED DASHBOARD & LEARNING ANALYTICS */}
        {activeTab === 'dashboard' && (
          <div id="tab_dashboard" className="space-y-8">
            <div className="border-b border-neutral-800 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl font-extrabold tracking-widest uppercase font-mono">
                  TRAINING DISCIPLINE STATION
                </h2>
                <p className="text-xs text-neutral-500 font-mono mt-1">
                  Examine your metrics. Review historic bookmarks, highlights ledger, and graph alignments.
                </p>
              </div>

              <div className="flex font-mono text-xs gap-2">
                <button 
                  onClick={() => {
                    if (window.confirm("Restore Standard Archive presets? This cleans custom cache.")) {
                      localStorage.clear();
                      location.reload();
                    }
                  }}
                  className="px-3 py-1.5 rounded border border-red-500/20 text-red-400 hover:bg-red-500/5 transition-colors uppercase text-[10px]"
                >
                  Clear Logs
                </button>
              </div>
            </div>

            {/* HIGH END PERFORMANCE STATISTICS CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-mono text-center">
              
              <div className={`p-5 rounded border ${isDarkMode ? 'bg-[#111111] border-neutral-800' : 'bg-white border-neutral-200'}`}>
                <span className="text-[10px] text-neutral-500 uppercase tracking-widest block">Study Active Streak</span>
                <span className="text-4xl font-extrabold text-yellow-500 block my-2">{userProgress.streak} DAYS</span>
                <p className="text-[10px] text-neutral-400 leading-tight">Consistently aligned daily observations successfully.</p>
              </div>

              <div className={`p-5 rounded border ${isDarkMode ? 'bg-[#111111] border-neutral-800' : 'bg-white border-neutral-200'}`}>
                <span className="text-[10px] text-neutral-500 uppercase tracking-widest block">Expanded Chapters Modules</span>
                <span className="text-4xl font-extrabold text-blue-500 block my-2">
                  {Object.keys(expandedContentCache).length}
                </span>
                <p className="text-[10px] text-neutral-400 leading-tight">Expanded strategic handbook text exceeding 69 pages.</p>
              </div>

              <div className={`p-5 rounded border ${isDarkMode ? 'bg-[#111111] border-neutral-800' : 'bg-white border-neutral-200'}`}>
                <span className="text-[10px] text-neutral-500 uppercase tracking-widest block">Archived Notes Logged</span>
                <span className="text-4xl font-extrabold text-[#BFBFBF] block my-2">{notes.length}</span>
                <p className="text-[10px] text-neutral-400 leading-tight">Unique personal realizations and cognitive blueprints cached.</p>
              </div>

              <div className={`p-5 rounded border ${isDarkMode ? 'bg-[#111111] border-neutral-800' : 'bg-white border-neutral-200'}`}>
                <span className="text-[10px] text-neutral-500 uppercase tracking-widest block">Current Progression Rank</span>
                <span className="text-md font-extrabold text-emerald-500 uppercase block my-4 leading-tight">
                  {userProgress.streak > 5 ? 'Conscious Competence' : 'Observation Student (Lvl 2)'}
                </span>
                <p className="text-[10px] text-neutral-400 leading-tight">Next boundary check: Sovereign Mastermind level.</p>
              </div>

            </div>

            {/* DUAL COGNITION GRID: DYNAMIC DAILY TRAINING BENTO */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* CURRENT ACTIVE DAILY LESSON */}
              <div className={`p-5 rounded border space-y-4 ${
                isDarkMode ? 'bg-[#111111] border-[#252525]' : 'bg-white border-neutral-200 shadow-sm'
              }`}>
                <div className="flex items-center justify-between border-b border-neutral-500/15 pb-2 font-mono">
                  <span className="text-[10px] text-neutral-500 uppercase">CHAMBER LESSON OF THE DAY</span>
                  <span className="text-xs font-bold text-yellow-500 uppercase">COGNITION</span>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-extrabold text-lg uppercase tracking-tight leading-tight">
                    {dailyLessons[activeDailyLesson].title}
                  </h3>
                  <p className="text-[10px] font-mono text-neutral-400 uppercase">
                    SYSTEM MATICES FOR: {dailyLessons[activeDailyLesson].category}
                  </p>
                  <p className="text-xs leading-relaxed italic text-neutral-300 pt-2 font-mono">
                    "{dailyLessons[activeDailyLesson].psychologyInsight}"
                  </p>
                  <div className="text-[10px] font-mono text-neutral-500">
                    Sourced from: {dailyLessons[activeDailyLesson].wisdomSrc} | Author: {dailyLessons[activeDailyLesson].author}
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-500/10 flex items-center justify-between font-mono gap-4">
                  <button
                    onClick={() => setActiveDailyLesson(prev => (prev + 1) % dailyLessons.length)}
                    className="text-[10px] text-[#BFBFBF] hover:text-white uppercase transition-colors"
                  >
                    Load Next Insight
                  </button>
                  
                  <button
                    onClick={completeDailyLesson}
                    disabled={dailyLessonCompleted}
                    className={`px-3 py-1.5 rounded text-[10px] uppercase tracking-widest font-bold border transition-colors ${
                      dailyLessonCompleted 
                        ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                        : 'bg-white text-black hover:bg-neutral-200 border-white'
                    }`}
                  >
                    {dailyLessonCompleted ? '✓ Insights Absorbed' : '✓ Mark Absorbed'}
                  </button>
                </div>
              </div>

              {/* DAILY DISCIPLINE HIGH-FRICTION CHALLENGE */}
              <div className={`p-5 rounded border space-y-4 ${
                isDarkMode ? 'bg-[#111111] border-[#252525]' : 'bg-white border-neutral-200 shadow-sm'
              }`}>
                <div className="flex items-center justify-between border-b border-neutral-500/15 pb-2 font-mono">
                  <span className="text-[10px] text-neutral-500 uppercase">DISCIPLINE ENFORCEMENT</span>
                  <span className="text-xs font-bold text-red-500 uppercase">Friction Level: HIGH</span>
                </div>

                <div className="space-y-2">
                  <h3 className="font-extrabold text-lg uppercase tracking-tight leading-normal">
                    Voluntary Discomfort Challenge
                  </h3>
                  <p className="text-xs leading-relaxed text-neutral-300 font-mono">
                    {dailyLessons[activeDailyLesson].disciplineChallenge}
                  </p>
                  <span className="text-[9px] font-mono text-neutral-500 block pt-2 uppercase">
                    Warning: Fake completions erode internal sovereignty. Hold yourself strictly accountable.
                  </span>
                </div>

                <div className="pt-4 border-t border-neutral-500/10 font-mono text-right">
                  <button
                    onClick={completeDailyChallenge}
                    disabled={dailyChallengeCompleted}
                    className={`w-full py-2.5 rounded text-[10px] uppercase tracking-widest font-black border transition-colors ${
                      dailyChallengeCompleted 
                        ? 'bg-green-500/10 text-green-400 border-green-500/25' 
                        : 'bg-transparent text-[#BFBFBF] border-neutral-800 hover:border-white'
                    }`}
                  >
                    {dailyChallengeCompleted ? '✓ Voluntary Friction Met' : '✓ Confirm Completion'}
                  </button>
                </div>
              </div>

              {/* ARCHIVAL EARNED BADGES COLLECTION */}
              <div className={`p-5 rounded border space-y-4 ${
                isDarkMode ? 'bg-[#111111] border-[#252525]' : 'bg-white border-neutral-200 shadow-sm'
              }`}>
                <div className="flex items-center justify-between border-b border-neutral-500/15 pb-2 font-mono">
                  <span className="text-[10px] text-neutral-500 uppercase">MASTER CREDITS REGISTER</span>
                  <span className="text-[10px] font-mono text-yellow-600 font-bold uppercase">BADGES STATUS</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-left font-mono">
                  {badgesList.map((badge) => {
                    const isEarned = userProgress.badgeIds.includes(badge.id);
                    return (
                      <div
                        key={badge.id}
                        className={`p-3 rounded border transition-colors flex items-center space-x-2.5 ${
                          isEarned 
                            ? isDarkMode ? 'bg-[#202020]/40 border-neutral-700' : 'bg-neutral-50 border-neutral-300' 
                            : 'opacity-40 border-dashed border-neutral-800'
                        }`}
                        title={badge.criteria}
                      >
                        <span className="text-xl shrink-0">{isEarned ? badge.icon : '🔒'}</span>
                        <div className="min-w-0">
                          <h4 className="text-[10px] font-black uppercase truncate text-neutral-300">{badge.title}</h4>
                          <p className="text-[8px] text-neutral-500 line-clamp-1">{badge.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* DYNAMIC SVG KNOWLEDGE GRAPH INTEGRATED MAP */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold font-mono tracking-widest uppercase">
                  COGNITIVE CORRELATION GRAPH
                </h3>
                <p className="text-xs text-neutral-500 font-mono">
                  Synthesizing behavioral disciplines. Hover or click a node to decrunch the cognitive alignment vector.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
                
                {/* INTERACTIVE SVG MAP */}
                <div className={`lg:col-span-3 rounded border p-6 min-h-[350px] relative flex items-center justify-center ${
                  isDarkMode ? 'bg-[#0E0E0E] border-[#2A2A2A]' : 'bg-white border-neutral-300 shadow-sm'
                }`}>
                  <svg viewBox="0 0 600 300" className="w-full h-full text-neutral-300 relative z-20">
                    {/* Graph Grid Overlay */}
                    <defs>
                      <pattern id="grid_pattern" width="30" height="30" patternUnits="userSpaceOnUse">
                        <path d="M 30 0 L 0 0 0 30" fill="none" stroke={isDarkMode ? "#222" : "#eee"} strokeWidth="1" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid_pattern)" />

                    {/* Node Connections */}
                    <line x1="100" y1="150" x2="300" y2="70" stroke={isDarkMode ? "#555" : "#ccc"} strokeWidth="2" strokeDasharray="5,5" />
                    <line x1="100" y1="150" x2="300" y2="230" stroke={isDarkMode ? "#555" : "#ccc"} strokeWidth="2" strokeDasharray="5,5" />
                    <line x1="300" y1="70" x2="500" y2="150" stroke={isDarkMode ? "#555" : "#ccc"} strokeWidth="2" />
                    <line x1="300" y1="230" x2="500" y2="150" stroke={isDarkMode ? "#555" : "#ccc"} strokeWidth="2" />
                    <line x1="300" y1="70" x2="300" y2="230" stroke={isDarkMode ? "#555" : "#ccc"} strokeWidth="1.5" />

                    {/* Interactive SVG Nodes */}
                    {[
                      { x: 100, y: 150, name: "Sovereignty of Mind", desc: "First principle of The White Room: Decouple your mind strictly from emotional variables. If external noise dictates your action, you have surrendered executive power.", type: "Discipline" },
                      { x: 300, y: 70, name: "Delayed Gratification", desc: "Forgo comfort today. Program voluntary friction to accumulate strategic dopamine assets for tomorrow's complex maneuvers.", type: "Self-Mastery" },
                      { x: 300, y: 230, name: "Observation Gap", desc: "Quarantine raw social stimuli for 5 seconds. Bypassing the emotional amygdala gives your prefrontal cortex absolute reasoning primacy.", type: "Strategy" },
                      { x: 500, y: 150, name: "Non-Reactivity Shield", desc: "Calculated silence. Aggressing with extreme tranquility forces the counterparty to over-verbalize and compromise their layout metrics.", type: "Social Intel" }
                    ].map((node, index) => {
                      const isSelected = selectedGraphNode?.name === node.name;
                      return (
                        <g 
                          key={index} 
                          onClick={() => setSelectedGraphNode({ name: node.name, rule: node.desc, type: node.type })}
                          className="cursor-pointer group"
                        >
                          <circle 
                            cx={node.x} 
                            cy={node.y} 
                            r={isSelected ? 16 : 12} 
                            fill={isSelected ? "#F59E0B" : isDarkMode ? "#1A1A1A" : "#FFF"} 
                            stroke={isSelected ? "#FFF" : isDarkMode ? "#444" : "#BBB"} 
                            strokeWidth="3.5"
                            className="transition-all duration-300 group-hover:scale-125"
                          />
                          <text 
                            x={node.x} 
                            y={node.y - 24} 
                            textAnchor="middle" 
                            fill={isDarkMode ? "#E5E5E5" : "#111111"} 
                            className="font-mono text-[9px] font-bold uppercase tracking-wider"
                          >
                            {node.name}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>

                {/* GRAPH DECIPHER LOG INFO FIELD */}
                <div className="lg:col-span-1">
                  <div className={`p-5 rounded border space-y-4 font-mono text-xs h-full flex flex-col justify-between ${
                    isDarkMode ? 'bg-[#121212] border-neutral-800' : 'bg-white border-neutral-200'
                  }`}>
                    {selectedGraphNode ? (
                      <div className="space-y-4">
                        <div className="border-b border-neutral-500/10 pb-2">
                          <span className="text-[10px] text-yellow-500 font-bold uppercase">SELECTED CORRELATOR NODE</span>
                          <h4 className="text-base font-black uppercase tracking-tight leading-tight mt-1">{selectedGraphNode.name}</h4>
                          <span className="text-[9px] text-neutral-500 uppercase mt-0.5 inline-block bg-neutral-800 text-neutral-300 px-1.5 py-0.5 rounded">
                            CLASSIFICATION: {selectedGraphNode.type}
                          </span>
                        </div>
                        
                        <p className="text-[11px] leading-relaxed text-neutral-300 prose italic">
                          "{selectedGraphNode.rule}"
                        </p>
                      </div>
                    ) : (
                      <p className="text-neutral-500">
                        Tap any graph circle node to analyze strategic dependencies, feedback guidelines, and behavioral calibration vectors.
                      </p>
                    )}

                    <div className="bg-neutral-900/40 p-3 rounded text-[9px] border border-neutral-800 text-neutral-500 leading-tight">
                      <strong>Node rule:</strong> Sovereign strategic thinkers see actions as systems of weights. Decoupling links protects the central balance.
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* THREE PANELS: LOGGED SELECTION INSIGHTS (NOTES, HIGHLIGHTS, BOOKMARKS) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono text-xs">
              
              {/* BOOKMARKS LIST */}
              <div className={`p-4 rounded border space-y-4 h-[350px] flex flex-col ${isDarkMode ? 'bg-[#121212] border-neutral-800' : 'bg-white border-neutral-200'}`}>
                <h3 className="font-extrabold uppercase tracking-widest border-b border-neutral-500/15 pb-2 flex items-center gap-2">
                  <BookMarked className="w-4 h-4 text-neutral-400" />
                  <span>STUDY DEPOSITS (BOOKMARKS)</span>
                </h3>
                <div className="flex-1 overflow-y-auto space-y-2">
                  {bookmarks.length === 0 ? (
                    <p className="text-neutral-500 italic p-2">No chapters bookmarked yet. Tap standard bookmarks in the Reading Room.</p>
                  ) : (
                    bookmarks.map(bm => (
                      <div
                        key={bm.id}
                        onClick={() => {
                          const parts = bm.targetId.split('-');
                          const bId = parts[0];
                          const itemId = parts.length > 2 ? parts.slice(1).join('-') : parts[1];
                          setActiveTab('reading');
                          setCurrentBookId(bId);
                          setSelectedItemId(itemId);
                        }}
                        className={`p-3 rounded border hover:border-yellow-500 cursor-pointer transition-all flex items-center justify-between ${
                          isDarkMode ? 'bg-[#181818] border-neutral-800 hover:bg-[#202020]' : 'bg-neutral-50 border-neutral-300 hover:bg-neutral-100'
                        }`}
                      >
                        <div>
                          <h4 className="font-bold uppercase tracking-tight text-[11px]">{bm.targetTitle}</h4>
                          <span className="text-[8px] text-neutral-500 uppercase">Book: {bm.bookId}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-neutral-500" />
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* HIGHLIGHTED QUOTES LOGGED */}
              <div className={`p-4 rounded border space-y-4 h-[350px] flex flex-col ${isDarkMode ? 'bg-[#121212] border-neutral-800' : 'bg-white border-neutral-200'}`}>
                <h3 className="font-extrabold uppercase tracking-widest border-b border-neutral-500/15 pb-2 flex items-center gap-2">
                  <PenTool className="w-4 h-4 text-neutral-400" />
                  <span>DECRUNCHED SCRAPS (HIGHLIGHTS)</span>
                </h3>
                <div className="flex-1 overflow-y-auto space-y-2">
                  {highlights.length === 0 ? (
                    <p className="text-neutral-500 italic p-2">Highlight Log is empty. Drags-select text inside the read suite to freeze lines.</p>
                  ) : (
                    highlights.map(hl => (
                      <div key={hl.id} className="p-3 rounded bg-neutral-900/50 border border-neutral-800 relative space-y-1 group">
                        <p className="text-[10px] italic text-[#BFBFBF] leading-normal">"{hl.text}"</p>
                        <div className="flex items-center justify-between text-[8px] text-neutral-500 pt-1 border-t border-neutral-800/50">
                          <span>LOG: {hl.createdAt}</span>
                          <button onClick={() => deleteHighlight(hl.id)} className="text-red-500 hover:text-red-300 font-bold uppercase">Discard</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* ALL PERSONAL REFLECTIONS LOG BOOK */}
              <div className={`p-4 rounded border space-y-4 h-[350px] flex flex-col ${isDarkMode ? 'bg-[#121212] border-neutral-800' : 'bg-white border-neutral-200'}`}>
                <h3 className="font-extrabold uppercase tracking-widest border-b border-neutral-500/15 pb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-neutral-400" />
                  <span>STUDY REALIZATIONS (ALL NOTES)</span>
                </h3>
                <div className="flex-1 overflow-y-auto space-y-2">
                  {notes.length === 0 ? (
                    <p className="text-neutral-500 italic p-2">Notebook ledger is empty. Write and record notes directly in the read suite panel.</p>
                  ) : (
                    notes.map(note => (
                      <div key={note.id} className="p-3 rounded bg-neutral-900/50 border border-neutral-800 space-y-2">
                        <div className="flex items-center justify-between border-b border-neutral-800 pb-1 text-[8px] text-neutral-500">
                          <span className="font-bold truncate text-neutral-400">{note.targetTitle}</span>
                          <span>{note.createdAt}</span>
                        </div>
                        <p className="text-[10px] leading-relaxed italic pr-4">"{note.content}"</p>
                        <div className="text-right">
                          <button onClick={() => handleDeleteNote(note.id)} className="text-[8px] text-red-500 hover:text-red-300 font-bold uppercase">Erase Entry</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

          </div>
        )}

      </main>

      {/* FOOTER CONTAINER */}
      <footer id="global_footer" className={`border-t py-8 text-center font-mono text-[10px] uppercase tracking-widest leading-loose ${isDarkMode ? 'bg-[#000000] border-[#1C1C1C] text-neutral-600' : 'bg-[#FFFFFF] border-neutral-200 text-neutral-500'}`}>
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-extrabold text-neutral-400">THE WHITE ROOM ARCHIVES — EST_2026</p>
          <p>Strictly free forever. No trackers, upsales, or paywalls. Sovereign focus guaranteed.</p>
          <div className="flex items-center justify-center space-x-2 font-black text-neutral-500 pt-2">
            <span>PLATFORM: ACTIVE</span>
            <span>|</span>
            <span>DIAGNOSTIC STATUS: ABSOLUTE SECURE</span>
            <span>|</span>
            <span>PORT_3000_UPTIME: 100%</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
