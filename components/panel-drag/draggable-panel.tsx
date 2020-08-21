import * as React from 'react';
import { PanelDragHandle } from './panel-drag-handle';

export interface DraggablePanelProps {
  children: React.ReactElement;
  className?: string;
  noBottomNav?: boolean;
}

export class DraggablePanel extends React.Component<DraggablePanelProps> {
  private panelRef = React.createRef<HTMLDivElement>();
  private handleDistance = 8;

  private calculateDistance(rect: DOMRect) {
    if (!this.panelRef.current) return;
    this.handleDistance = Math.abs(this.panelRef.current.getBoundingClientRect().top - rect.top);
    console.log(this.handleDistance);
  }

  private movePanel(x: number, y: number) {
    if (!this.panelRef.current) return;

    const screenHeight = window.innerHeight;
    const position = y - this.handleDistance;
    if (position <= screenHeight * 0.2) return;
    if (this.props.noBottomNav) {
      if (position >= screenHeight * 0.825) return;
    } else {
      // This is the height for the bottom nav, set in /styles/navigator.scss
      if (position >= (screenHeight * 8.25 / 10) - 50) return;
    }
    this.panelRef.current.style.top = `${position}px`;
    this.panelRef.current.style.height = `${screenHeight - (this.props.noBottomNav ? 0 : 40) - y}px`;
  }

  public render(): React.ReactNode {
    return (
      <section className={this.props.className} ref={this.panelRef} style={{ zIndex: 7, borderRadius: "22px 22px 0 0" }}>
        <PanelDragHandle onPositionChange={(x, y) => this.movePanel(x, y)} getSelfPosition={(rect) => this.calculateDistance(rect)} />
        {this.props.children}
      </section>
    )
  }
}