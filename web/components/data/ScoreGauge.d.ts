import * as React from 'react';

export interface ScoreGaugeProps {
  /** Score 0–100. */
  value: number;
  /** Diameter in px. */
  size?: number;
  /** Ring thickness in px. */
  thickness?: number;
  /** Caption under the ring. */
  label?: React.ReactNode;
  /** Show the numeric value in the center. */
  showValue?: boolean;
  style?: React.CSSProperties;
}

/**
 * Radial 0–100 score gauge, colored by the opportunity scale.
 * @startingPoint section="Data" subtitle="Radial score gauge" viewport="700x150"
 */
export function ScoreGauge(props: ScoreGaugeProps): JSX.Element;
