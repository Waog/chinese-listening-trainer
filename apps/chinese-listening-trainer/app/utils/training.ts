import { VALID_SYLLABLES } from '../data/phonetics';
import { AppSettings, PinyinSyllable, Settings } from '../types';
import { StatsManager, loadSettings } from '../utils/storage';

export class TrainingGenerator {
  static generateTrainingSequence(settings?: AppSettings): PinyinSyllable[] {
    // Load settings if not provided
    const appSettings = settings || loadSettings();

    // Convert AppSettings to the format expected by the generator
    const convertedSettings = this.convertAppSettings(appSettings);

    // Check if any valid combinations exist with current settings
    const availableSyllables = this.getAvailableSyllables(convertedSettings);
    if (availableSyllables.length === 0) {
      throw new Error(
        'No valid syllable combinations available with current settings. Please adjust your filters.'
      );
    }

    const count = this.getRandomSyllableCount(convertedSettings);
    const syllables: PinyinSyllable[] = [];

    for (let i = 0; i < count; i++) {
      const syllable = this.generateWeightedSyllable(
        convertedSettings,
        syllables,
        availableSyllables
      );
      if (syllable) {
        syllables.push(syllable);
      }
    }

    // Ensure we have at least one syllable
    if (syllables.length === 0) {
      throw new Error(
        'Failed to generate any valid syllables. Please check your settings.'
      );
    }

    // Apply heuristics to ensure realistic combinations
    return this.applyRealisticHeuristics(syllables);
  }
  private static convertAppSettings(appSettings: AppSettings): Settings {
    // Convert the AppSettings format to Settings format
    const enabledInitials = appSettings.initials
      .filter((initial) => initial !== null && initial !== undefined)
      .map((initial) => {
        if (initial === '-') return ''; // Handle empty initial
        return initial.replace(/^(.+)-$/, '$1'); // Remove trailing dash
      });

    const enabledFinals = appSettings.finals
      .filter((final) => final !== null && final !== undefined)
      .map((final) => final.replace(/^-(.+)$/, '$1')); // Remove leading dash

    return {
      syllableCount: appSettings.syllableCount,
      enabledInitials,
      enabledFinals,
      enabledTones: appSettings.tones,
    };
  }
  private static getAvailableSyllables(
    settings: Settings
  ): Array<{ hanzi: string; pinyin: string; tone: number }> {
    return VALID_SYLLABLES.filter((char) => {
      // Filter based on settings
      const pinyin = char.pinyin;
      const tone = char.tone;

      // Extract initial and final
      let initial = '';
      let final = pinyin;

      // Check for initials in order of length (longest first to avoid conflicts)
      // Filter out empty string and null values for the sorting
      const nonEmptyInitials = settings.enabledInitials.filter(
        (init) => init && init.length > 0
      );
      const sortedInitials = [...nonEmptyInitials].sort(
        (a, b) => b.length - a.length
      );

      for (const init of sortedInitials) {
        if (pinyin.startsWith(init)) {
          initial = init;
          final = pinyin.substring(init.length);
          break;
        }
      }

      return (
        settings.enabledInitials.includes(initial) &&
        settings.enabledFinals.includes(final) &&
        settings.enabledTones.includes(tone)
      );
    });
  }
  private static getRandomSyllableCount(settings: Settings): number {
    const counts = settings.syllableCount;
    if (!counts || counts.length === 0) {
      return 1; // Default to 1 syllable
    }

    // Pick a random count from the enabled counts
    return counts[Math.floor(Math.random() * counts.length)];
  }
  private static generateWeightedSyllable(
    settings: Settings,
    existingSyllables: PinyinSyllable[],
    availableSyllables: Array<{ hanzi: string; pinyin: string; tone: number }>
  ): PinyinSyllable | null {
    // Select initial, final, and tone independently based on their individual training weights
    const selectedInitial = this.selectWeightedComponent(
      settings.enabledInitials,
      'initial'
    );
    const selectedFinal = this.selectWeightedComponent(
      settings.enabledFinals,
      'final'
    );
    const selectedTone = this.selectWeightedComponent(
      settings.enabledTones.map((t) => t.toString()),
      'tone'
    );

    if (!selectedFinal || selectedTone === null) {
      return null;
    }

    const toneNumber = parseInt(selectedTone);
    const pinyinString = (selectedInitial || '') + selectedFinal;

    // Check if this syllable combination actually exists in VALID_SYLLABLES
    const validSyllable = availableSyllables.find(
      (char) => char.pinyin === pinyinString && char.tone === toneNumber
    );

    if (!validSyllable) {
      // If the combination doesn't exist, fall back to a valid syllable
      // Weight available syllables based on how close they are to our selected components
      const weights = availableSyllables.map((char) => {
        let weight = 1;

        // Extract initial and final from the valid syllable
        const { initial: charInitial, final: charFinal } =
          this.extractInitialFinal(char.pinyin);

        // Boost weight if components match our selections
        if (charInitial === (selectedInitial || '')) weight *= 3;
        if (charFinal === selectedFinal) weight *= 3;
        if (char.tone === toneNumber) weight *= 3;

        return { character: char, weight };
      });

      return this.selectFromWeightedList(weights);
    }

    return {
      initial: selectedInitial || '',
      final: selectedFinal,
      tone: toneNumber,
    };
  }

  private static selectWeightedComponent(
    components: string[],
    componentType: string
  ): string | null {
    if (components.length === 0) return null;

    // Create weights for each component based on training statistics
    const weights = components.map((component) => {
      const weight = StatsManager.getTrainingWeight(componentType, component);
      return { component, weight };
    });

    const totalWeight = weights.reduce((sum, w) => sum + w.weight, 0);
    if (totalWeight === 0) {
      // Fallback to random selection
      return components[Math.floor(Math.random() * components.length)];
    }

    let random = Math.random() * totalWeight;
    for (const weightedItem of weights) {
      random -= weightedItem.weight;
      if (random <= 0) {
        return weightedItem.component;
      }
    }

    // Fallback
    return components[Math.floor(Math.random() * components.length)];
  }

  private static extractInitialFinal(pinyin: string): {
    initial: string;
    final: string;
  } {
    // Use the same logic as characterToSyllable to extract initial and final
    const initials = [
      'zh',
      'ch',
      'sh',
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
      'r',
      'z',
      'c',
      's',
      'y',
      'w',
    ];

    let initial = '';
    let final = pinyin;

    for (const init of initials) {
      if (pinyin.startsWith(init)) {
        initial = init;
        final = pinyin.substring(init.length);
        break;
      }
    }

    return { initial, final };
  }

  private static selectFromWeightedList(
    weights: Array<{
      character: { hanzi: string; pinyin: string; tone: number };
      weight: number;
    }>
  ): PinyinSyllable | null {
    const totalWeight = weights.reduce((sum, w) => sum + w.weight, 0);
    if (totalWeight === 0) {
      return null;
    }

    let random = Math.random() * totalWeight;
    for (const weightedItem of weights) {
      random -= weightedItem.weight;
      if (random <= 0) {
        return this.characterToSyllable(weightedItem.character);
      }
    }

    return null;
  }

  private static characterToSyllable(char: {
    hanzi: string;
    pinyin: string;
    tone: number;
  }): PinyinSyllable {
    const pinyin = char.pinyin;
    let initial = '';
    let final = pinyin;

    // Extract initial from pinyin
    const initials = [
      'zh',
      'ch',
      'sh',
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
      'r',
      'z',
      'c',
      's',
      'y',
      'w',
    ];

    for (const init of initials) {
      if (pinyin.startsWith(init)) {
        initial = init;
        final = pinyin.substring(init.length);
        break;
      }
    }

    return {
      initial,
      final,
      tone: char.tone,
    };
  }
  private static applyRealisticHeuristics(
    syllables: PinyinSyllable[]
  ): PinyinSyllable[] {
    const improved = [...syllables];

    // Heuristic 1: Neutral tone should never be first (only for multi-syllable sequences)
    if (improved.length > 1 && improved[0].tone === 5) {
      improved[0] = this.getAlternativeSyllable(improved[0], [1, 2, 3, 4]);
    }

    // Heuristic 2: Avoid three consecutive Tone 3 syllables
    for (let i = 0; i < improved.length - 2; i++) {
      if (
        improved[i].tone === 3 &&
        improved[i + 1].tone === 3 &&
        improved[i + 2].tone === 3
      ) {
        // Change the middle one to a different tone
        improved[i + 1] = this.getAlternativeSyllable(
          improved[i + 1],
          [1, 2, 4]
        );
      }
    }

    // Heuristic 3: Limit neutral tone to two occurrences maximum (relaxed from one)
    const neutralCount = improved.filter((s) => s.tone === 5).length;
    if (neutralCount > 2) {
      let neutralFixed = 0;
      for (
        let i = 0;
        i < improved.length && neutralFixed < neutralCount - 2;
        i++
      ) {
        if (improved[i].tone === 5) {
          improved[i] = this.getAlternativeSyllable(improved[i], [1, 2, 3, 4]);
          neutralFixed++;
        }
      }
    }

    return improved;
  }

  private static getAlternativeSyllable(
    original: PinyinSyllable,
    allowedTones: number[]
  ): PinyinSyllable {
    const pinyin = original.initial + original.final;

    // Try to find same syllable with different tone
    const alternatives = VALID_SYLLABLES.filter(
      (char) => char.pinyin === pinyin && allowedTones.includes(char.tone)
    );

    if (alternatives.length > 0) {
      const selected =
        alternatives[Math.floor(Math.random() * alternatives.length)];
      return this.characterToSyllable(selected);
    }

    // If no alternative found, just change the tone
    const newTone =
      allowedTones[Math.floor(Math.random() * allowedTones.length)];
    return {
      ...original,
      tone: newTone,
    };
  }
  // Validation function to check if syllable combination sounds natural
  static isNaturalCombination(syllables: PinyinSyllable[]): boolean {
    if (syllables.length === 0) return false;

    // Check basic heuristics
    // Only restrict neutral tone first for multi-syllable sequences
    if (syllables.length > 1 && syllables[0].tone === 5) return false;

    // Check for three consecutive Tone 3
    for (let i = 0; i < syllables.length - 2; i++) {
      if (
        syllables[i].tone === 3 &&
        syllables[i + 1].tone === 3 &&
        syllables[i + 2].tone === 3
      ) {
        return false;
      }
    }

    // Check neutral tone count (relaxed to allow up to 2)
    const neutralCount = syllables.filter((s) => s.tone === 5).length;
    if (neutralCount > 2) return false;

    return true;
  }
}
