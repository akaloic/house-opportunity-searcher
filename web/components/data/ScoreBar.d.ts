import * as React from 'react';

export interface ScoreBarProps {
  label: React.ReactNode;
  value: number;
  max?: number;
  /** Override the auto score color. */
  accent?: string;
  /** Unit after the value (e.g. "%", " pts"). */
  suffix?: string;
  size?: 'sm' | 'md';
  style?: React.CSSProperties;
}

/** Labeled horizontal bar — breaks a composite score into criteria. */
export function ScoreBar(props: ScoreBarProps): JSX.Element;
