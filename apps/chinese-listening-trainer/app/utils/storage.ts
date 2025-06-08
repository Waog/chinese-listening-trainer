import { AppSettings, Settings, Statistics, TrainingSession } from '../types';

const STORAGE_KEYS = {
  STATISTICS: 'chinese-trainer-statistics',
  SESSIONS: 'chinese-trainer-sessions',
  SETTINGS: 'chinese-trainer-settings',
};

// Default settings
const DEFAULT_SETTINGS: Settings = {
  syllableCount: [1, 2, 3],
  enabledInitials: [
    '',
    'b',
    'p',
    'm',
    'f',
    'd',
    't',
    'n',
    'l',
    'g',
    'k',
    'h',
    'j',
    'q',
    'x',
    'zh',
    'ch',
    'sh',
    'r',
    'z',
    'c',
    's',
    'y',
    'w',
  ],
  enabledFinals: [
    'a',
    'o',
    'e',
    'i',
    'u',
    'ü',
    'ai',
    'ei',
    'ao',
    'ou',
    'an',
    'en',
    'ang',
    'eng',
    'ong',
    'er',
    'ia',
    'ie',
    'iao',
    'iou',
    'ian',
    'in',
    'iang',
    'ing',
    'iong',
    'ua',
    'uo',
    'uai',
    'uei',
    'uan',
    'uen',
    'uang',
    'ueng',
    'üe',
    'üan',
    'ün',
  ],
  enabledTones: [1, 2, 3, 4, 5],
};

// Statistics management
export class StatsManager {
  static getStatistics(): Statistics[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.STATISTICS);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading statistics:', error);
      return [];
    }
  }

  static updateStatistic(
    component: string,
    value: string,
    correct: boolean
  ): void {
    const stats = this.getStatistics();
    const existing = stats.find(
      (s) => s.component === component && s.value === value
    );

    if (existing) {
      existing.attempts++;
      if (correct) existing.successes++;
      existing.successRate = (existing.successes / existing.attempts) * 100;
      existing.lastTrained = Date.now();
    } else {
      stats.push({
        component,
        value,
        attempts: 1,
        successes: correct ? 1 : 0,
        successRate: correct ? 100 : 0,
        lastTrained: Date.now(),
      });
    }

    this.saveStatistics(stats);
  }

  static saveStatistics(stats: Statistics[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.STATISTICS, JSON.stringify(stats));
    } catch (error) {
      console.error('Error saving statistics:', error);
    }
  }

  static resetStatistics(): void {
    localStorage.removeItem(STORAGE_KEYS.STATISTICS);
  }

  static getComponentStatistics(component: string): Statistics[] {
    return this.getStatistics().filter((s) => s.component === component);
  }

  static getSuccessRate(component: string, value: string): number {
    const stat = this.getStatistics().find(
      (s) => s.component === component && s.value === value
    );
    return stat ? stat.successRate : -1; // -1 indicates never trained
  }

  // Get error rate for prioritization (higher error rate = more frequent training)
  static getErrorRate(component: string, value: string): number {
    const successRate = this.getSuccessRate(component, value);
    if (successRate === -1) return 1000; // High priority for untrainied items
    return 100 - successRate;
  }
}

// Training session management
export class SessionManager {
  static getSessions(): TrainingSession[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading sessions:', error);
      return [];
    }
  }

  static saveSession(session: TrainingSession): void {
    const sessions = this.getSessions();
    sessions.push(session);

    // Keep only last 1000 sessions to prevent storage bloat
    if (sessions.length > 1000) {
      sessions.splice(0, sessions.length - 1000);
    }

    try {
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
    } catch (error) {
      console.error('Error saving session:', error);
    }
  }

  static getRecentSessions(limit = 10): TrainingSession[] {
    return this.getSessions()
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  static clearSessions(): void {
    localStorage.removeItem(STORAGE_KEYS.SESSIONS);
  }
}

// Settings management
export class SettingsManager {
  static getSettings(): Settings {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return stored
        ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) }
        : DEFAULT_SETTINGS;
    } catch (error) {
      console.error('Error loading settings:', error);
      return DEFAULT_SETTINGS;
    }
  }

  static saveSettings(settings: Partial<Settings>): void {
    const current = this.getSettings();
    const updated = { ...current, ...settings };

    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }

  static resetSettings(): void {
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  }
}

// AppSettings helper functions for SettingsView compatibility
const DEFAULT_APP_SETTINGS: AppSettings = {
  syllableCount: [1, 2, 3],
  voice: 'auto',
  speechRate: 1.0,
  volume: 1.0,
  initials: [
    '-',
    'b-',
    'p-',
    'm-',
    'f-',
    'd-',
    't-',
    'n-',
    'l-',
    'g-',
    'k-',
    'h-',
    'j-',
    'q-',
    'x-',
    'zh-',
    'ch-',
    'sh-',
    'r-',
    'z-',
    'c-',
    's-',
    'y-',
    'w-',
  ],
  finals: [
    '-a',
    '-o',
    '-e',
    '-i',
    '-u',
    '-ü',
    '-ai',
    '-ei',
    '-ui',
    '-ao',
    '-ou',
    '-iu',
    '-ie',
    '-üe',
    '-er',
    '-an',
    '-en',
    '-in',
    '-un',
    '-ün',
    '-ang',
    '-eng',
    '-ing',
    '-ong',
    '-ia',
    '-iao',
    '-iou',
    '-uan',
    '-uai',
    '-uang',
    '-üan',
    '-iong',
    '-iang',
    '-ueng',
  ],
  tones: [1, 2, 3, 4, 5],
  theme: 'dark',
};

export function loadSettings(): AppSettings {
  try {
    const stored = localStorage.getItem('chinese-trainer-app-settings');
    if (stored) {
      const parsed = JSON.parse(stored);
      // Merge with defaults to ensure all properties exist
      return { ...DEFAULT_APP_SETTINGS, ...parsed };
    }
  } catch (error) {
    console.error('Error loading app settings:', error);
  }
  return DEFAULT_APP_SETTINGS;
}

export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(
      'chinese-trainer-app-settings',
      JSON.stringify(settings)
    );
  } catch (error) {
    console.error('Error saving app settings:', error);
  }
}

// Training algorithm - weighted random selection based on error rates
export class TrainingAlgorithm {
  static selectWeightedSyllables(count: number, settings: Settings): string[] {
    const enabledSyllables = this.getEnabledSyllables(settings);

    // Create weighted selection based on error rates
    const weights: { syllable: string; weight: number }[] =
      enabledSyllables.map((syllable) => {
        const errorRate = StatsManager.getErrorRate('syllable', syllable);
        // Higher error rate = higher weight, but ensure minimum weight for mastered items
        const weight = Math.max(errorRate, 10);
        return { syllable, weight };
      });

    const selected: string[] = [];

    for (let i = 0; i < count; i++) {
      const totalWeight = weights.reduce((sum, w) => sum + w.weight, 0);
      let random = Math.random() * totalWeight;

      for (const weightedItem of weights) {
        random -= weightedItem.weight;
        if (random <= 0) {
          selected.push(weightedItem.syllable);
          // Reduce weight for selected item to avoid immediate repetition
          weightedItem.weight = Math.max(weightedItem.weight * 0.1, 1);
          break;
        }
      }
    }

    return selected;
  }

  private static getEnabledSyllables(settings: Settings): string[] {
    // This would return all enabled syllable combinations based on settings
    // For now, return a simplified list
    const syllables: string[] = [];

    for (const initial of settings.enabledInitials) {
      for (const final of settings.enabledFinals) {
        for (const tone of settings.enabledTones) {
          const syllable = `${initial}${final}_${tone}`;
          syllables.push(syllable);
        }
      }
    }

    return syllables;
  }
}
