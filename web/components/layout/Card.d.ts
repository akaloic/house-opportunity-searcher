import * as React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Hover lift + border highlight (use for clickable list cards). */
  interactive?: boolean;
  /** Gold glow ring — flag a pépite card. */
  glow?: boolean;
  children?: React.ReactNode;
}

/** Base surface container — the building block for panels and list cards. */
export function Card(props: CardProps): JSX.Element;
