import React from 'react';
import { Link, useLocation } from 'react-router';
import styles from './AppNavigation.module.scss';

export const AppNavigation: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Training', icon: '🎯' },
    { path: '/statistics', label: 'Statistics', icon: '📊' },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <nav className={styles.navigation}>
      <div className={styles.navContainer}>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`${styles.navItem} ${
              location.pathname === item.path ? styles.active : ''
            }`}
          >
            <span className={styles.navIcon} role="img" aria-label={item.label}>
              {item.icon}
            </span>
            <span className={styles.navLabel}>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};
