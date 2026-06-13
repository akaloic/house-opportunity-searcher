export interface ScoreRadarAxis {
  /** Full criterion name. */
  label: string;
  /** Short label used on the chart (falls back to label). */
  short?: string;
  /** Axis value, 0..max. */
  value: number;
}

export interface ScoreRadarProps {
  /** One entry per criterion axis (3–8 reads best). */
  axes: ScoreRadarAxis[];
  /** Square px size of the chart. Default 200. */
  size?: number;
  /** Max axis value. Default 100. */
  max?: number;
  /** Stroke/fill color of the data polygon. Default brand teal. */
  color?: string;
  /** Number of concentric grid rings. Default 4. */
  rings?: number;
  /** Render axis labels around the perimeter. Default true. */
  showLabels?: boolean;
  style?: React.CSSProperties;
}

export function ScoreRadar(props: ScoreRadarProps): JSX.Element;
