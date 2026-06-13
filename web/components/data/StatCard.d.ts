import * as React from 'react';

export interface StatCardProps {
  /** Uppercase eyebrow label. */
  label: React.ReactNode;
  /** Headline value (string or number). */
  value: React.ReactNode;
  /** Unit shown after the value (€, /m², %). */
  unit?: React.ReactNode;
  /** Delta string, e.g. "+12%" or "-3". Sign drives default color. */
  delta?: React.ReactNode;
  /** Force delta tone. */
  deltaTone?: 'success' | 'danger' | 'warning' | 'muted';
  /** Accent icon (top-right). */
  icon?: React.ReactNode;
  accent?: string;
  /** Optional sparkline / mini-chart node. */
  spark?: React.ReactNode;
  style?: React.CSSProperties;
}

/**
 * KPI card — big mono number, delta, optional sparkline.
 * @startingPoint section="Data" subtitle="KPI metric card" viewport="700x150"
 */
export function StatCard(props: StatCardProps): JSX.Element;
