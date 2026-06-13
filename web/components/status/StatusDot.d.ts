import * as React from 'react';

export interface StatusDotProps {
  status?: 'online' | 'running' | 'idle' | 'warning' | 'error' | 'blocked';
  /** Override the default localized label. */
  label?: React.ReactNode;
  showLabel?: boolean;
  size?: number;
  style?: React.CSSProperties;
}

/** Pulsing status dot for the monitoring view (scraper / proxy / bot health). */
export function StatusDot(props: StatusDotProps): JSX.Element;
