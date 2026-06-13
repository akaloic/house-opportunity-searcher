import * as React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  size?: 'sm' | 'md' | 'lg';
  /** Node shown inside, before the field (icon or label). */
  prefix?: React.ReactNode;
  /** Node shown inside, after the field (unit like € or m²). */
  suffix?: React.ReactNode;
  /** Error styling. */
  invalid?: boolean;
  /** Style for the outer wrapper. */
  wrapStyle?: React.CSSProperties;
}

/** Text / number input with affixes — built for filter forms (prix max, surface). */
export function Input(props: InputProps): JSX.Element;
