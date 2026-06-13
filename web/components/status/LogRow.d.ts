import * as React from 'react';

export interface LogRowProps {
  /** Timestamp string, e.g. "14:22:07". */
  time?: string;
  level?: 'info' | 'ok' | 'warn' | 'error' | 'debug';
  /** Subsystem tag, e.g. "[seloger]". */
  source?: React.ReactNode;
  message: React.ReactNode;
  style?: React.CSSProperties;
}

/** One monospace line in the scraping log console. */
export function LogRow(props: LogRowProps): JSX.Element;
