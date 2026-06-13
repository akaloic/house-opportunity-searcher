import * as React from 'react';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'ghost' | 'solid' | 'brand';
  /** Render in active/pressed state (e.g. toggled toolbar tool). */
  active?: boolean;
  /** Accessible label + tooltip (required — icon has no text). */
  label: string;
  children?: React.ReactNode;
}

/** Square icon-only button for dense toolbars and map controls. */
export function IconButton(props: IconButtonProps): JSX.Element;
