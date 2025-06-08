import { StatsManager } from './storage';

export interface ComponentWeightInfo {
  text: string;
  weight: number;
  color: string;
}

/**
 * Get color for training weight with neutral handling for 1000% (untrained)
 */
export function getTrainingWeightColor(weight: number): string {
  if (weight >= 1000) return '#888888'; // Gray for untrained items (1000%)
  if (weight >= 100) return '#ff4444'; // Red for high weight (needs practice)
  if (weight >= 50) return '#ff8800'; // Orange for medium weight
  if (weight >= 25) return '#ffbb00'; // Yellow for moderate weight
  return '#44bb44'; // Green for low weight (mastered)
}

/**
 * Get darkened color for training weight backgrounds
 */
export function getDarkenedTrainingWeightColor(weight: number): string {
  if (weight >= 1000) return '#444444'; // Darker gray for untrained items
  if (weight >= 100) return '#aa2222'; // Darker red for high weight
  if (weight >= 50) return '#bb5500'; // Darker orange for medium weight
  if (weight >= 25) return '#cc8800'; // Darker yellow for moderate weight
  return '#227722'; // Darker green for low weight
}

/**
 * Format component with training weight and color for display
 */
export function formatComponentWithWeight(
  component: string,
  componentType: string,
  addDashes = true
): ComponentWeightInfo {
  const weight = StatsManager.getTrainingWeight(componentType, component);
  const percentage = Math.round(weight);
  const color = getTrainingWeightColor(weight);

  let displayComponent = component;
  if (componentType === 'initial' && component === '') {
    displayComponent = '∅';
  }

  if (addDashes) {
    if (componentType === 'initial') {
      displayComponent = displayComponent + '-';
    } else if (componentType === 'final') {
      displayComponent = '-' + displayComponent;
    }
  }

  const text = `${displayComponent} ${percentage}%`;
  return { text, weight, color };
}

/**
 * Get training weight for a component (shared across all components)
 */
export function getComponentTrainingWeight(
  componentType: string,
  component: string
): number {
  return StatsManager.getTrainingWeight(componentType, component);
}
