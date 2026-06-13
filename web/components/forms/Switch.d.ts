import * as React from 'react';

export interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  /** Optional text rendered to the right. */
  label?: React.ReactNode;
  size?: 'sm' | 'md';
  onChange?: (checked: boolean) => void;
  style?: React.CSSProperties;
}

/** On/off toggle for strict filters & alert switches. */
export function Switch(props: SwitchProps): JSX.Element;
