import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('./routes/training.tsx'),
  route('statistics', './routes/statistics.tsx'),
  route('settings', './routes/settings.tsx'),
  route('about', './routes/about.tsx'),
] satisfies RouteConfig;
