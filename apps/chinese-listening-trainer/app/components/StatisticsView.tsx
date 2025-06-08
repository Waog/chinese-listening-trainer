import { useEffect, useMemo, useState } from 'react';
import { formatPinyinWithTones } from '../data/phonetics';
import { Statistics } from '../types';
import { StatsManager } from '../utils/storage';
import { getTrainingWeightColor } from '../utils/training-weights';
import styles from './StatisticsView.module.scss';

type SortBy = 'value' | 'attempts' | 'successRate' | 'probability';
type SortOrder = 'asc' | 'desc';
type FilterComponent =
  | 'all'
  | 'initial'
  | 'final'
  | 'tone'
  | 'syllable'
  | 'combination';

export function StatisticsView() {
  const [statistics, setStatistics] = useState<Statistics[]>([]);
  const [sortBy, setSortBy] = useState<SortBy>('successRate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  // Initialize activeFilters from localStorage or use default
  const [activeFilters, setActiveFilters] = useState<Set<FilterComponent>>(
    () => {
      const savedFilters = StatsManager.loadStatisticsFilters();
      if (savedFilters) {
        return new Set(savedFilters as FilterComponent[]);
      }
      return new Set(['initial', 'final', 'tone', 'syllable', 'combination']);
    }
  );

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadStatistics();
  }, []);

  // Save filters to localStorage whenever they change
  useEffect(() => {
    StatsManager.saveStatisticsFilters(Array.from(activeFilters));
  }, [activeFilters]);

  const loadStatistics = () => {
    const stats = StatsManager.getStatistics();
    setStatistics(stats);
  };
  const filteredAndSortedStats = useMemo(() => {
    let filtered = statistics;

    // Filter by component type - only show components that are in activeFilters
    filtered = filtered.filter((stat) =>
      activeFilters.has(stat.component as FilterComponent)
    );

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (stat) =>
          stat.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
          stat.component.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } // Sort
    filtered.sort((a, b) => {
      let valueA: string | number, valueB: string | number;

      switch (sortBy) {
        case 'value':
          valueA = a[sortBy].toLowerCase();
          valueB = b[sortBy].toLowerCase();
          break;
        case 'attempts':
        case 'successRate':
          valueA = a[sortBy];
          valueB = b[sortBy];
          break;
        case 'probability': {
          // Use shared training weight calculation
          valueA = StatsManager.getTrainingWeight(a.component, a.value);
          valueB = StatsManager.getTrainingWeight(b.component, b.value);
          break;
        }
        default:
          return 0;
      }

      if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [statistics, sortBy, sortOrder, activeFilters, searchTerm]);

  const handleSort = (column: SortBy) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (column: SortBy) => {
    if (sortBy !== column) return '↕️';
    return sortOrder === 'asc' ? '⬆️' : '⬇️';
  };
  const getSuccessRateColor = (rate: number) => {
    if (rate >= 90) return styles.excellent;
    if (rate >= 75) return styles.good;
    if (rate >= 50) return styles.okay;
    return styles.poor;
  };
  const formatValue = (component: string, value: string) => {
    switch (component) {
      case 'tone':
        return `Tone ${value}`;
      case 'initial':
        return value ? `${value}-` : '-';
      case 'final':
        return `-${value}`;
      case 'syllable': {
        // Convert "wu_3" to pinyin with accents
        const [syllablePinyin, toneStr] = value.split('_');
        if (toneStr) {
          const tone = parseInt(toneStr);
          return formatPinyinWithTones({
            initial: '',
            final: syllablePinyin,
            tone: tone,
          });
        }
        return value;
      }
      case 'combination': {
        // Convert "wu_3+guan_1" to "wǔ guān" (space instead of plus)
        return value
          .split('+')
          .map((part) => {
            const [syllablePinyin, toneStr] = part.split('_');
            if (toneStr) {
              const tone = parseInt(toneStr);
              return formatPinyinWithTones({
                initial: '',
                final: syllablePinyin,
                tone: tone,
              });
            }
            return part;
          })
          .join(' ');
      }
      default:
        return value;
    }
  };

  const overallStats = useMemo(() => {
    if (statistics.length === 0) return null;

    const totalAttempts = statistics.reduce(
      (sum, stat) => sum + stat.attempts,
      0
    );
    const totalSuccesses = statistics.reduce(
      (sum, stat) => sum + stat.successes,
      0
    );
    const averageSuccessRate =
      totalAttempts > 0 ? (totalSuccesses / totalAttempts) * 100 : 0;

    const componentCounts = statistics.reduce((acc, stat) => {
      acc[stat.component] = (acc[stat.component] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalAttempts,
      totalSuccesses,
      averageSuccessRate,
      componentCounts,
      uniqueItems: statistics.length,
    };
  }, [statistics]);
  const clearAllStats = () => {
    if (
      window.confirm(
        'Are you sure you want to clear all statistics? This action cannot be undone.'
      )
    ) {
      StatsManager.resetStatistics();
      loadStatistics();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Training Statistics</h2>

        {overallStats && (
          <div className={styles.overallStats}>
            <div className={styles.overallStat}>
              <span className={styles.statNumber}>
                {overallStats.totalAttempts}
              </span>
              <span className={styles.statLabel}>Total Attempts</span>
            </div>
            <div className={styles.overallStat}>
              <span className={styles.statNumber}>
                {overallStats.totalSuccesses}
              </span>
              <span className={styles.statLabel}>Successful</span>
            </div>
            <div className={styles.overallStat}>
              <span className={styles.statNumber}>
                {Math.round(overallStats.averageSuccessRate)}%
              </span>
              <span className={styles.statLabel}>Average Success</span>
            </div>
            <div className={styles.overallStat}>
              <span className={styles.statNumber}>
                {overallStats.uniqueItems}
              </span>
              <span className={styles.statLabel}>Items Trained</span>
            </div>
          </div>
        )}
      </div>{' '}
      <div className={styles.filters}>
        {' '}
        <div className={styles.componentToggleGroup}>
          <label>Component Type:</label>
          <div className={styles.toggleButtons}>
            {[
              { value: 'initial', label: 'Initials' },
              { value: 'final', label: 'Finals' },
              { value: 'tone', label: 'Tones' },
              { value: 'syllable', label: 'Syllables' },
              { value: 'combination', label: 'Combinations' },
            ].map((filter) => (
              <button
                key={filter.value}
                className={`${styles.toggleButton} ${
                  activeFilters.has(filter.value as FilterComponent)
                    ? styles.active
                    : ''
                }`}
                onClick={() => {
                  const newFilters = new Set(activeFilters);
                  if (newFilters.has(filter.value as FilterComponent)) {
                    newFilters.delete(filter.value as FilterComponent);
                  } else {
                    newFilters.add(filter.value as FilterComponent);
                  }
                  setActiveFilters(newFilters);
                }}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.filterGroup}>
          <label htmlFor="search">Search:</label>
          <input
            id="search"
            type="text"
            placeholder="Search components..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <button onClick={clearAllStats} className={styles.clearButton}>
          Clear All Stats
        </button>
      </div>
      {filteredAndSortedStats.length === 0 ? (
        <div className={styles.emptyState}>
          <h3>No Statistics Yet</h3>
          <p>Start training to see your progress statistics here!</p>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          {' '}
          <table className={styles.statsTable}>
            <thead>
              <tr>
                <th onClick={() => handleSort('value')}>
                  Value {getSortIcon('value')}
                </th>
                <th onClick={() => handleSort('attempts')}>
                  Attempts {getSortIcon('attempts')}
                </th>
                <th onClick={() => handleSort('successRate')}>
                  Success Rate {getSortIcon('successRate')}
                </th>{' '}
                <th onClick={() => handleSort('probability')}>
                  Training Weight {getSortIcon('probability')}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedStats.map((stat, index) => (
                <tr
                  key={`${stat.component}-${stat.value}`}
                  className={styles.statRow}
                >
                  <td className={styles.valueCell}>
                    {formatValue(stat.component, stat.value)}
                  </td>{' '}
                  <td className={styles.attemptsCell}>
                    <span className={styles.attempts}>
                      {stat.successes} / {stat.attempts}
                    </span>
                  </td>{' '}
                  <td className={styles.successRateCell}>
                    <div
                      className={`${styles.successRate} ${getSuccessRateColor(
                        stat.successRate
                      )}`}
                    >
                      {Math.round(stat.successRate)}%
                    </div>
                    <div className={styles.progressBar}>
                      <div
                        className={styles.progressFill}
                        style={{ width: `${stat.successRate}%` }}
                      ></div>
                    </div>
                  </td>{' '}
                  <td className={styles.probabilityCell}>
                    <div
                      className={styles.probability}
                      style={{
                        color: getTrainingWeightColor(
                          StatsManager.getTrainingWeight(
                            stat.component,
                            stat.value
                          )
                        ),
                      }}
                    >
                      {Math.round(
                        StatsManager.getTrainingWeight(
                          stat.component,
                          stat.value
                        )
                      )}
                      %
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className={styles.summary}>
        <p>
          Showing {filteredAndSortedStats.length} of {statistics.length} items
        </p>
      </div>
    </div>
  );
}
