import { syllableToHanzi } from '../data/phonetics';
import { PinyinSyllable } from '../types';

export class TTSManager {
  private static synthesis: SpeechSynthesis | null = null;
  private static voices: SpeechSynthesisVoice[] = [];
  private static isInitialized = false;

  static async initialize(): Promise<void> {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      throw new Error('Speech synthesis not supported');
    }

    this.synthesis = window.speechSynthesis;

    // Load voices
    await this.loadVoices();
    this.isInitialized = true;
  }

  private static async loadVoices(): Promise<void> {
    return new Promise((resolve) => {
      if (!this.synthesis) {
        resolve();
        return;
      }

      const loadVoicesHandler = () => {
        this.voices = this.synthesis!.getVoices();
        this.synthesis!.removeEventListener('voiceschanged', loadVoicesHandler);
        resolve();
      };

      // Voices might already be loaded
      this.voices = this.synthesis.getVoices();
      if (this.voices.length > 0) {
        resolve();
        return;
      }

      // Wait for voices to load
      this.synthesis.addEventListener('voiceschanged', loadVoicesHandler);

      // Fallback timeout
      setTimeout(() => {
        this.voices = this.synthesis!.getVoices();
        this.synthesis!.removeEventListener('voiceschanged', loadVoicesHandler);
        resolve();
      }, 1000);
    });
  }

  static getChineseVoice(): SpeechSynthesisVoice | null {
    if (!this.isInitialized) return null;

    // Priority order for Chinese voices
    const chineseVoicePatterns = [
      /zh.*CN/i, // Chinese (China)
      /zh.*Hans/i, // Chinese Simplified
      /Chinese/i, // Generic Chinese
      /Mandarin/i, // Mandarin
      /zh/i, // Any Chinese
    ];

    for (const pattern of chineseVoicePatterns) {
      const voice = this.voices.find(
        (v) => pattern.test(v.lang) || pattern.test(v.name)
      );
      if (voice) return voice;
    }

    // Fallback to first available voice if no Chinese voice found
    return this.voices[0] || null;
  }

  static async speak(syllables: PinyinSyllable[]): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (!this.synthesis) {
      throw new Error('Speech synthesis not available');
    }

    // Convert syllables to Chinese characters for TTS
    const hanziText = syllables.map(syllableToHanzi).join('');

    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(hanziText);

      // Configure utterance
      const voice = this.getChineseVoice();
      if (voice) {
        utterance.voice = voice;
      }

      utterance.rate = 0.8; // Slightly slower for learning
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      utterance.lang = 'zh-CN'; // Chinese Simplified

      utterance.onend = () => resolve();
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        reject(new Error(`Speech synthesis failed: ${event.error}`));
      };

      // Cancel any ongoing speech and speak new text
      this.synthesis.cancel();
      this.synthesis.speak(utterance);
    });
  }

  static async speakText(text: string): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (!this.synthesis) {
      throw new Error('Speech synthesis not available');
    }

    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text);

      const voice = this.getChineseVoice();
      if (voice) {
        utterance.voice = voice;
      }

      utterance.rate = 0.8;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      utterance.lang = 'zh-CN';

      utterance.onend = () => resolve();
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        reject(new Error(`Speech synthesis failed: ${event.error}`));
      };

      this.synthesis.cancel();
      this.synthesis.speak(utterance);
    });
  }

  static stop(): void {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
  }

  static getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.voices;
  }

  static isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }
}
