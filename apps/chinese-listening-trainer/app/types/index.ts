// Chinese phonetics data types
export interface PinyinSyllable {
  initial: string; // consonant prefix (b, p, m, f, etc.)
  final: string; // vowel suffix (a, o, e, i, u, etc.)
  tone: number; // 1-5 (1-4 are tones, 5 is neutral)
}

export interface ChineseCharacter {
  hanzi: string;
  pinyin: string;
  tone: number;
}

export interface TrainingSession {
  syllables: PinyinSyllable[];
  audioText: string;
  timestamp: number;
  correct?: boolean;
}

export interface Statistics {
  component: string; // prefix, final, tone, or full syllable
  value: string; // the actual component value
  attempts: number;
  successes: number;
  successRate: number;
  lastTrained: number;
}

export interface Settings {
  syllableCount: number[];
  enabledInitials: string[];
  enabledFinals: string[];
  enabledTones: number[];
}

export interface AppSettings {
  syllableCount: number[];
  voice: string;
  speechRate: number;
  volume: number;
  initials: string[];
  finals: string[];
  tones: number[];
  theme: 'dark';
  showTrainingWeightColors: boolean;
}

export interface TrainingFilters {
  syllableCount: number[];
  initials: string[];
  finals: string[];
  tones: number[];
}
