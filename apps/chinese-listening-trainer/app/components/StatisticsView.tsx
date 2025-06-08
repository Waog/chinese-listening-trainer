import { useEffect, useMemo, useState } from 'react';
import { Statistics } from '../types';
import { StatsManager } from '../utils/storage';
import styles from './StatisticsView.module.scss';

type SortBy =
  | 'component'
  | 'value'
  | 'attempts'
  | 'successRate'
  | 'lastTrained';
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
  const [filterComponent, setFilterComponent] =
    useState<FilterComponent>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = () => {
    const stats = StatsManager.getStatistics();
    setStatistics(stats);
  };

  const filteredAndSortedStats = useMemo(() => {
    let filtered = statistics;

    // Filter by component type
    if (filterComponent !== 'all') {
      filtered = filtered.filter((stat) => stat.component === filterComponent);
    }

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
        case 'component':
        case 'value':
          valueA = a[sortBy].toLowerCase();
          valueB = b[sortBy].toLowerCase();
          break;
        case 'attempts':
        case 'successRate':
        case 'lastTrained':
          valueA = a[sortBy];
          valueB = b[sortBy];
          break;
        default:
          return 0;
      }

      if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [statistics, sortBy, sortOrder, filterComponent, searchTerm]);

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

  const formatLastTrained = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const getComponentDisplayName = (component: string) => {
    switch (component) {
      case 'initial':
        return 'Initial';
      case 'final':
        return 'Final';
      case 'tone':
        return 'Tone';
      case 'syllable':
        return 'Syllable';
      case 'combination':
        return 'Combination';
      default:
        return component;
    }
  };

  const formatValue = (component: string, value: string) => {
    switch (component) {
      case 'tone':
        return `Tone ${value}`;
      case 'initial':
        return value || '∅ (empty)';
      case 'syllable':
        return value.replace('_', ' T');
      case 'combination':
        return value.replace(/\+/g, ' + ').replace(/_/g, ' T');
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
      </div>

      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label htmlFor="componentFilter">Component Type:</label>
          <select
            id="componentFilter"
            value={filterComponent}
            onChange={(e) =>
              setFilterComponent(e.target.value as FilterComponent)
            }
            className={styles.select}
          >
            <option value="all">All Components</option>
            <option value="initial">Initials</option>
            <option value="final">Finals</option>
            <option value="tone">Tones</option>
            <option value="syllable">Syllables</option>
            <option value="combination">Combinations</option>
          </select>
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
          <table className={styles.statsTable}>
            <thead>
              <tr>
                <th onClick={() => handleSort('component')}>
                  Component {getSortIcon('component')}
                </th>
                <th onClick={() => handleSort('value')}>
                  Value {getSortIcon('value')}
                </th>
                <th onClick={() => handleSort('attempts')}>
                  Attempts {getSortIcon('attempts')}
                </th>
                <th onClick={() => handleSort('successRate')}>
                  Success Rate {getSortIcon('successRate')}
                </th>
                <th onClick={() => handleSort('lastTrained')}>
                  Last Trained {getSortIcon('lastTrained')}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedStats.map((stat, index) => (
                <tr
                  key={`${stat.component}-${stat.value}`}
                  className={styles.statRow}
                >
                  <td className={styles.componentCell}>
                    <span className={styles.componentBadge}>
                      {getComponentDisplayName(stat.component)}
                    </span>
                  </td>
                  <td className={styles.valueCell}>
                    {formatValue(stat.component, stat.value)}
                  </td>
                  <td className={styles.attemptsCell}>
                    <span className={styles.attempts}>{stat.attempts}</span>
                    <span className={styles.successes}>
                      ({stat.successes} correct)
                    </span>
                  </td>
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
                  </td>
                  <td className={styles.lastTrainedCell}>
                    {formatLastTrained(stat.lastTrained)}
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
