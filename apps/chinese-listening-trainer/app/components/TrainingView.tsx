import { useCallback, useEffect, useState } from 'react';
import { formatPinyinWithTones } from '../data/phonetics';
import { PinyinSyllable, TrainingSession } from '../types';
import { SessionManager, StatsManager, loadSettings } from '../utils/storage';
import { TrainingGenerator } from '../utils/training';
import { formatComponentWithWeight } from '../utils/training-weights';
import { TTSManager } from '../utils/tts';
import styles from './TrainingView.module.scss';

export function TrainingView() {
  const [currentSyllables, setCurrentSyllables] = useState<PinyinSyllable[]>(
    []
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionStats, setSessionStats] = useState({ correct: 0, total: 0 });

  // Touch handling for swipe gestures
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(
    null
  );
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(
    null
  );

  // Initialize TTS and generate first syllables
  const initializeTraining = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Initialize TTS
      if (TTSManager.isSupported()) {
        await TTSManager.initialize();
      } else {
        setError('Speech synthesis is not supported in this browser');
        return;
      }

      // Generate first training sequence
      try {
        const settings = loadSettings();
        const syllables = TrainingGenerator.generateTrainingSequence(settings);
        setCurrentSyllables(syllables);
        setShowAnswer(false);

        // Auto-play the first audio after initialization
        setTimeout(async () => {
          if (syllables.length > 0) {
            try {
              setIsPlaying(true);
              await TTSManager.speak(syllables);
            } catch (err) {
              console.error('Failed to play initial audio:', err);
            } finally {
              setIsPlaying(false);
            }
          }
        }, 500);
      } catch (generationError: unknown) {
        const errorMessage =
          generationError instanceof Error
            ? generationError.message
            : 'Failed to generate training sequence. Please check your settings.';
        setError(errorMessage);
        return;
      }
    } catch (err) {
      console.error('Failed to initialize training:', err);
      setError(
        'Failed to initialize audio. Please check your browser settings.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeTraining();
  }, [initializeTraining]);
  const playAudio = useCallback(async () => {
    if (isPlaying || currentSyllables.length === 0) return;

    try {
      setIsPlaying(true);
      setError(null);
      await TTSManager.speak(currentSyllables);
    } catch (err) {
      console.error('Failed to play audio:', err);
      setError('Failed to play audio. Please try again.');
    } finally {
      setIsPlaying(false);
    }
  }, [isPlaying, currentSyllables]);
  const generateNewSequence = useCallback(async () => {
    try {
      const settings = loadSettings();
      const syllables = TrainingGenerator.generateTrainingSequence(settings);
      setCurrentSyllables(syllables);
      setShowAnswer(false);

      // Auto-play the audio after a brief delay
      setTimeout(async () => {
        if (syllables.length > 0) {
          try {
            setIsPlaying(true);
            await TTSManager.speak(syllables);
          } catch (err) {
            console.error('Failed to play audio:', err);
          } finally {
            setIsPlaying(false);
          }
        }
      }, 500);
    } catch (generationError: unknown) {
      const errorMessage =
        generationError instanceof Error
          ? generationError.message
          : 'Failed to generate new sequence. Please check your settings.';
      setError(errorMessage);
    }
  }, []);

  const revealAnswer = () => {
    setShowAnswer(true);
  };
  const handleAnswer = useCallback(
    (correct: boolean) => {
      // Update statistics
      currentSyllables.forEach((syllable) => {
        const syllableKey = `${syllable.initial}${syllable.final}_${syllable.tone}`;

        // Update component statistics
        StatsManager.updateStatistic('initial', syllable.initial, correct);
        StatsManager.updateStatistic('final', syllable.final, correct);
        StatsManager.updateStatistic('tone', syllable.tone.toString(), correct);
        StatsManager.updateStatistic('syllable', syllableKey, correct);

        // Update combination statistics if multiple syllables
        if (currentSyllables.length > 1) {
          const combinationKey = currentSyllables
            .map((s) => `${s.initial}${s.final}_${s.tone}`)
            .join('+');
          StatsManager.updateStatistic('combination', combinationKey, correct);
        }
      });

      // Save training session
      const session: TrainingSession = {
        syllables: currentSyllables,
        audioText: currentSyllables
          .map((s) => `${s.initial}${s.final}_${s.tone}`)
          .join(' '),
        timestamp: Date.now(),
        correct,
      };
      SessionManager.saveSession(session);

      // Update session stats
      setSessionStats((prev) => ({
        correct: prev.correct + (correct ? 1 : 0),
        total: prev.total + 1,
      }));

      // Generate next sequence
      setTimeout(() => {
        generateNewSequence();
      }, 1000); // Brief delay to show feedback
    },
    [currentSyllables, generateNewSequence]
  );

  // Touch gesture handling
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const deltaX = touchStart.x - touchEnd.x;
    const deltaY = touchStart.y - touchEnd.y;
    const isLeftSwipe = deltaX > 50 && Math.abs(deltaY) < 50;
    const isRightSwipe = deltaX < -50 && Math.abs(deltaY) < 50;

    if (showAnswer && (isLeftSwipe || isRightSwipe)) {
      handleAnswer(isRightSwipe); // Right swipe = correct, left swipe = incorrect
    }
  };

  // Touch/click to reveal answer
  const handleScreenTap = () => {
    if (!showAnswer) {
      revealAnswer();
    }
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Initializing audio...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h3>Audio Error</h3>
          <p>{error}</p>
          <button onClick={initializeTraining} className={styles.retryButton}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const sessionSuccessRate =
    sessionStats.total > 0
      ? Math.round((sessionStats.correct / sessionStats.total) * 100)
      : 0;

  return (
    <div className={styles.container}>
      {/* Session Stats */}
      <div className={styles.sessionStats}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{sessionStats.correct}</span>
          <span className={styles.statLabel}>Correct</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{sessionStats.total}</span>
          <span className={styles.statLabel}>Total</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{sessionSuccessRate}%</span>
          <span className={styles.statLabel}>Success</span>
        </div>
      </div>{' '}
      {/* Main Training Area */}
      <div
        className={styles.trainingArea}
        onClick={handleScreenTap}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className={styles.audioSection}>
          <button
            onClick={playAudio}
            disabled={isPlaying || currentSyllables.length === 0}
            className={styles.playButton}
          >
            {isPlaying ? (
              <div className={styles.playingIndicator}>
                <div className={styles.wave}></div>
                <div className={styles.wave}></div>
                <div className={styles.wave}></div>
              </div>
            ) : (
              <span className={styles.playIcon} role="img" aria-label="speaker">
                🔊
              </span>
            )}
          </button>{' '}
          <div className={styles.instructions}>
            {showAnswer && <p>Was your guess correct?</p>}
          </div>
        </div>

        {/* Answer Display */}
        {showAnswer && (
          <div className={styles.answerSection}>
            <div className={styles.pinyinDisplay}>
              {currentSyllables.map((syllable, index) => (
                <span key={index} className={styles.syllable}>
                  {formatPinyinWithTones(syllable)}
                </span>
              ))}
            </div>{' '}
            <div className={styles.syllableBreakdown}>
              {currentSyllables.map((syllable, index) => {
                const initialInfo = formatComponentWithWeight(
                  syllable.initial || '',
                  'initial'
                );
                const finalInfo = formatComponentWithWeight(
                  syllable.final,
                  'final'
                );
                const toneInfo = formatComponentWithWeight(
                  syllable.tone.toString(),
                  'tone',
                  false
                );

                return (
                  <div key={index} className={styles.breakdown}>
                    <span
                      className={styles.component}
                      style={{ color: initialInfo.color }}
                      title={`Training weight: ${Math.round(
                        initialInfo.weight
                      )}%`}
                    >
                      {initialInfo.text}
                    </span>
                    <span
                      className={styles.component}
                      style={{ color: finalInfo.color }}
                      title={`Training weight: ${Math.round(
                        finalInfo.weight
                      )}%`}
                    >
                      {finalInfo.text}
                    </span>
                    <span
                      className={styles.toneNumber}
                      style={{ color: toneInfo.color }}
                      title={`Training weight: ${Math.round(toneInfo.weight)}%`}
                    >
                      T{syllable.tone} {Math.round(toneInfo.weight)}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      {/* Action Buttons */}
      {showAnswer && (
        <div className={styles.actionButtons}>
          <button
            onClick={() => handleAnswer(false)}
            className={`${styles.actionButton} ${styles.incorrectButton}`}
          >
            <span role="img" aria-label="incorrect">
              ❌
            </span>{' '}
            Incorrect
          </button>

          <button
            onClick={() => handleAnswer(true)}
            className={`${styles.actionButton} ${styles.correctButton}`}
          >
            <span role="img" aria-label="correct">
              ✅
            </span>{' '}
            Correct{' '}
          </button>
        </div>
      )}
    </div>
  );
}
