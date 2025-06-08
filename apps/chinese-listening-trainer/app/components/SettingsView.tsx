import React, { useEffect, useState } from 'react';
import { AppSettings } from '../types';
import { loadSettings, saveSettings } from '../utils/storage';
import styles from './SettingsView.module.scss';

export const SettingsView: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>({
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
  });

  const [testAudio, setTestAudio] = useState<string>('');

  useEffect(() => {
    const loadedSettings = loadSettings();
    setSettings(loadedSettings);
  }, []);

  const handleSettingChange = <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    saveSettings(newSettings);
  };
  const handleArrayToggle = <K extends keyof AppSettings>(
    key: K,
    item: AppSettings[K] extends (infer U)[] ? U : never
  ) => {
    const currentArray = settings[key] as Array<string | number>;
    const isActive = currentArray.includes(item as string | number);

    let newArray;
    if (isActive) {
      // Don't allow removing the last item
      if (currentArray.length === 1) {
        return;
      }
      newArray = currentArray.filter((i) => i !== item);
    } else {
      newArray = [...currentArray, item];
    }
    handleSettingChange(key, newArray as AppSettings[K]);
  };

  const handleResetData = () => {
    if (
      window.confirm(
        'Are you sure you want to reset all app data? This will clear all settings, statistics, and training history. This action cannot be undone.'
      )
    ) {
      // Clear all localStorage data
      localStorage.clear();

      // Reset settings to defaults
      const defaultSettings = loadSettings();
      setSettings(defaultSettings);

      // Show confirmation
      alert('All app data has been reset successfully!');

      // Optionally reload the page to ensure clean state
      window.location.reload();
    }
  };

  const testTTS = async () => {
    try {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance('你好世界');
        utterance.lang = 'zh-CN';
        utterance.rate = settings.speechRate;
        utterance.volume = settings.volume;

        if (settings.voice !== 'auto') {
          const voices = speechSynthesis.getVoices();
          const selectedVoice = voices.find(
            (voice) => voice.name === settings.voice
          );
          if (selectedVoice) {
            utterance.voice = selectedVoice;
          }
        }

        setTestAudio('Playing: "你好世界" (Hello World)');
        speechSynthesis.speak(utterance);

        utterance.onend = () => {
          setTimeout(() => setTestAudio(''), 2000);
        };
      }
    } catch (error) {
      console.error('TTS test failed:', error);
      setTestAudio('TTS test failed');
      setTimeout(() => setTestAudio(''), 2000);
    }
  };

  const getAvailableVoices = () => {
    if ('speechSynthesis' in window) {
      return speechSynthesis
        .getVoices()
        .filter(
          (voice) => voice.lang.includes('zh') || voice.lang.includes('cmn')
        );
    }
    return [];
  };
  const allInitials = [
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
  ];

  const allFinals = [
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
  ];

  const allTones = [
    { tone: 1, accent: 'ˉ' },
    { tone: 2, accent: 'ˊ' },
    { tone: 3, accent: 'ˇ' },
    { tone: 4, accent: 'ˋ' },
    { tone: 5, accent: '˙' },
  ];
  return (
    <div className={styles.settingsContainer}>
      <div className={styles.header}>
        <h1>Settings</h1>
      </div>

      <div className={styles.settingsContent}>
        {/* Audio Settings */}
        <section className={styles.settingsSection}>
          <h2>Audio Settings</h2>

          <div className={styles.settingGroup}>
            <label className={styles.settingLabel}>Chinese Voice</label>
            <select
              value={settings.voice}
              onChange={(e) => handleSettingChange('voice', e.target.value)}
              className={styles.settingSelect}
            >
              <option value="auto">Auto (Browser Default)</option>
              {getAvailableVoices().map((voice) => (
                <option key={voice.name} value={voice.name}>
                  {voice.name} ({voice.lang})
                </option>
              ))}
            </select>
          </div>

          <div className={styles.settingGroup}>
            <label className={styles.settingLabel}>
              Speech Rate: {settings.speechRate.toFixed(1)}x
            </label>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={settings.speechRate}
              onChange={(e) =>
                handleSettingChange('speechRate', parseFloat(e.target.value))
              }
              className={styles.settingSlider}
            />
          </div>

          <div className={styles.settingGroup}>
            <label className={styles.settingLabel}>
              Volume: {Math.round(settings.volume * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={settings.volume}
              onChange={(e) =>
                handleSettingChange('volume', parseFloat(e.target.value))
              }
              className={styles.settingSlider}
            />
          </div>

          <div className={styles.settingGroup}>
            <button onClick={testTTS} className={styles.testButton}>
              Test Audio
            </button>
            {testAudio && <p className={styles.testFeedback}>{testAudio}</p>}
          </div>
        </section>

        {/* Training Filters */}
        <section className={styles.settingsSection}>
          <h2>Training Filters</h2>

          <div className={styles.settingGroup}>
            <label className={styles.settingLabel}>Syllable Count</label>
            <div className={styles.toggleGroup}>
              {[1, 2, 3].map((count) => (
                <button
                  key={count}
                  className={`${styles.toggleButton} ${
                    settings.syllableCount.includes(count) ? styles.active : ''
                  }`}
                  onClick={() => handleArrayToggle('syllableCount', count)}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.threeColumnGroup}>
            <div className={styles.settingGroup}>
              <label className={styles.settingLabel}>Tones</label>
              <div className={styles.toggleGroup}>
                {allTones.map(({ tone, accent }) => (
                  <button
                    key={tone}
                    className={`${styles.toggleButton} ${styles.toneButton} ${
                      settings.tones.includes(tone) ? styles.active : ''
                    }`}
                    onClick={() => handleArrayToggle('tones', tone)}
                  >
                    {tone} <span className={styles.accent}>{accent}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.settingGroup}>
              <label className={styles.settingLabel}>Initials</label>
              <div className={styles.toggleGroup}>
                {allInitials.map((initial) => (
                  <button
                    key={initial}
                    className={`${styles.toggleButton} ${
                      settings.initials.includes(initial) ? styles.active : ''
                    }`}
                    onClick={() => handleArrayToggle('initials', initial)}
                  >
                    {initial}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.settingGroup}>
              <label className={styles.settingLabel}>Finals</label>
              <div className={styles.toggleGroup}>
                {allFinals.map((final) => (
                  <button
                    key={final}
                    className={`${styles.toggleButton} ${
                      settings.finals.includes(final) ? styles.active : ''
                    }`}
                    onClick={() => handleArrayToggle('finals', final)}
                  >
                    {final}
                  </button>
                ))}
              </div>{' '}
            </div>
          </div>
        </section>

        {/* Reset Section */}
        <section className={styles.settingsSection}>
          <h2>Reset Data</h2>
          <div className={styles.resetSection}>
            <button className={styles.resetButton} onClick={handleResetData}>
              Reset All App Data
            </button>
            <p className={styles.resetWarning}>
              This will clear all settings, statistics, and training history.
              This action cannot be undone.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};
