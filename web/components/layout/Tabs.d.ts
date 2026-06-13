import * as React from 'react';

export interface TabItem {
  id: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  /** Optional count chip. */
  count?: number;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: TabItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (id: string) => void;
  size?: 'sm' | 'md';
  style?: React.CSSProperties;
}

/** Underline tab bar with optional icon + count chips. */
export function Tabs(props: TabsProps): JSX.Element;
