/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ArchiveBook {
  id: string;
  title: string;
  category: string;
  description: string;
  totalPages: number;
}

export interface RuleOutline {
  number: number;
  title: string;
  subtitle: string;
  vibe: string;
}

export interface RuleContent {
  ruleNumber: number;
  title: string;
  subtitle: string;
  explanation: string;
  whyItMatters: string;
  realLifeExample: string;
  commonMistakes: string;
  practicalExercise: string;
  reflectionQuestions: string[];
  keyTakeaways: string[];
}

export interface SituationOutline {
  number: number;
  title: string;
  category: string;
  preview: string;
}

export interface SituationContent {
  situationNumber: number;
  title: string;
  scenario: string;
  commonResponse: string;
  strategicResponse: string;
  analysis: string;
  psychologyBehindIt: string;
  lessonsLearned: string[];
  practicalApplication: string;
  reflectionExercise: string;
}

export interface ChapterOutline {
  id: string;
  chapterNumber: number;
  title: string;
  topic: string;
  description: string;
}

export interface ChapterContent {
  chapterId: string;
  chapterNumber: number;
  title: string;
  introduction: string;
  concepts: {
    name: string;
    description: string;
    example: string;
  }[];
  explanation: string;
  caseStudy: {
    title: string;
    setup: string;
    outcome: string;
    lessons: string[];
  };
  exercises: string[];
  reflectionQuestions: string[];
  keyLessons: string[];
}

export interface UserNote {
  id: string;
  targetId: string; // e.g., 'rule-43', 'situation-12', 'chapter-3'
  targetTitle: string;
  bookId: string; // 'book1', 'book2', 'book3'
  content: string;
  createdAt: string;
}

export interface Bookmark {
  id: string;
  targetId: string; // e.g., 'rule-43', 'situation-12', 'chapter-3'
  targetTitle: string;
  bookId: string;
  createdAt: string;
}

export interface Highlight {
  id: string;
  targetId: string;
  text: string;
  color: string;
  createdAt: string;
}

export interface UserProgress {
  book1CompletedCount: number; // Rules read count
  book2CompletedCount: number; // Situations read count
  book3CompletedCount: number; // Chapters read count
  completedIds: string[]; // List of completed item IDs
  streak: number;
  lastActiveDate: string;
  badgeIds: string[];
  notesCount: number;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  criteria: string;
  icon: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  createdAt: string;
}

export interface DailyLesson {
  title: string;
  category: string;
  psychologyInsight: string;
  wisdomSrc: string;
  author: string;
  disciplineChallenge: string;
}
