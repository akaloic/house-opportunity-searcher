import * as React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style. */
  variant?: 'primary' | 'gold' | 'secondary' | 'ghost' | 'danger';
  /** Control height. */
  size?: 'sm' | 'md' | 'lg';
  /** Icon node rendered before the label. */
  leftIcon?: React.ReactNode;
  /** Icon node rendered after the label. */
  rightIcon?: React.ReactNode;
  /** Stretch to container width. */
  fullWidth?: boolean;
  /** Show spinner + disable. */
  loading?: boolean;
  children?: React.ReactNode;
}

/**
 * Primary action button for the Pépite interface.
 * @startingPoint section="Forms" subtitle="Button variants & sizes" viewport="700x180"
 */
export function Button(props: ButtonProps): JSX.Element;
