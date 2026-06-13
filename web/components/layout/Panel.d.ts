import * as React from 'react';

export interface PanelProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Icon left of the title. */
  icon?: React.ReactNode;
  /** Header-right actions (buttons, selects). */
  actions?: React.ReactNode;
  /** Remove body padding (for maps / tables / consoles). */
  noPadding?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  bodyStyle?: React.CSSProperties;
}

/**
 * Titled dashboard panel with header bar + actions.
 * @startingPoint section="Layout" subtitle="Titled dashboard panel" viewport="700x260"
 */
export function Panel(props: PanelProps): JSX.Element;
