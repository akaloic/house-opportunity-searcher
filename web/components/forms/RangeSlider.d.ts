import * as React from 'react';

export interface RangeSliderProps {
  /** Controlled value. Omit for uncontrolled. */
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  /** Label shown above the track. */
  label?: React.ReactNode;
  /** Unit appended to the value pill (e.g. "%"). */
  valueSuffix?: string;
  /** Fill + handle color (CSS var or hex) — color-code each scoring criterion. */
  accent?: string;
  /** Hide the live value pill. */
  showValue?: boolean;
  disabled?: boolean;
  onChange?: (value: number, event: React.ChangeEvent<HTMLInputElement>) => void;
  style?: React.CSSProperties;
}

/**
 * Weight slider for the scoring engine — live value pill, per-criterion accent.
 * @startingPoint section="Forms" subtitle="Scoring weight sliders" viewport="700x150"
 */
export function RangeSlider(props: RangeSliderProps): JSX.Element;
