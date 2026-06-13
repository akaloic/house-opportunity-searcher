import * as React from 'react';

export interface BadgeProps {
  tone?: 'neutral' | 'brand' | 'gold' | 'success' | 'warning' | 'danger' | 'info';
  /** Leading status dot. */
  dot?: boolean;
  /** Leading icon node. */
  icon?: React.ReactNode;
  /** Filled instead of soft-tinted. */
  solid?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

/** Compact status / category badge. */
export function Badge(props: BadgeProps): JSX.Element;
