import * as React from 'react';

export interface DeltaProps {
  /** Number (auto-signs) or preformatted string. */
  value: number | string;
  suffix?: string;
  /** When true, negative is good (e.g. price below market). */
  invert?: boolean;
  size?: 'sm' | 'md';
  style?: React.CSSProperties;
}

/** Inline signed delta with arrow — comparisons vs market / previous. */
export function Delta(props: DeltaProps): JSX.Element;
