import * as React from 'react';
import { PanelDragHandle } from './panel-drag-handle';
import Constants from "../../utils/constants.json";

export interface DraggablePanelProps {
  children: React.ReactElement;
  className?: string;
  noBottomNav?: boolean;
}

export class DraggablePanel extends React.Component<DraggablePanelProps> {
  private panelRef = React.createRef<HTMLDivElement>();
  private handleDistance = Constants.DRAGABBLE_PANEL.handleDistance;
  private lastYAxis = Constants.DRAGABBLE_PANEL.yAxisInit;

  private dragHandleHeight = Constants.DRAGABBLE_PANEL.handleHeight;

  public componentDidMount(): void {
    window.addEventListener('resize', () => this.movePanel(Constants.DRAGABBLE_PANEL.yAxisInit, this.lastYAxis));
  }

  private calculateDistance(rect: DOMRect) {
    if (!this.panelRef.current) return;
    this.handleDistance = Math.abs(this.panelRef.current.getBoundingClientRect().top - rect.top);
  }

  private movePanel(x: number, y: number) {
    if (!this.panelRef.current) return;

    const screenHeight = window.innerHeight;
    const position = y - this.handleDistance;
    if (position <= screenHeight * Constants.DRAGABBLE_PANEL.minimumDockScreenFactor) return;
    if (this.props.noBottomNav) {
      if (position >= screenHeight - this.dragHandleHeight) return;
    } else {
      // This is the height for the bottom nav, set in /styles/navigator.scss
      if (position >= (screenHeight - (this.dragHandleHeight + Constants.DRAGABBLE_PANEL.navBarHeight))) return;
    }
    this.lastYAxis = y;
    this.panelRef.current.style.top = `${position}px`;
    this.panelRef.current.style.height = `
      ${screenHeight - (
        this.props.noBottomNav
          ? Constants.DRAGABBLE_PANEL.offsetWithoutBottomNav
          : Constants.DRAGABBLE_PANEL.bottomNavOffset
      ) - y}px
    `;
  }

  private dockPanel(): void {
    if (!this.panelRef.current) return;

    const screenHeight = window.innerHeight;
    let position = 0;
    if (this.props.noBottomNav) {
      position = screenHeight - this.dragHandleHeight;
    } else {
      // This is the height for the bottom nav, set in /styles/navigator.scss
      position = screenHeight - (this.dragHandleHeight + Constants.DRAGABBLE_PANEL.navBarHeight);
    }
    this.panelRef.current.style.top = `${position}px`;
    this.panelRef.current.style.height = `
      ${screenHeight - (
        this.props.noBottomNav
          ? Constants.DRAGABBLE_PANEL.offsetWithoutBottomNav
          : Constants.DRAGABBLE_PANEL.bottomNavOffset
      ) - (position + this.handleDistance)}px
    `;
  }

  public render(): React.ReactNode {
    return (
      <div className={this.props.className} ref={this.panelRef} style={{ zIndex: 7, borderRadius: "22px 22px 0 0" }}>
        <PanelDragHandle
          onPositionChange={(x, y) => this.movePanel(x, y)}
          getSelfPosition={(rect) => this.calculateDistance(rect)}
          onDock={() => this.dockPanel()}
        />
        {this.props.children}
      </div>
    )
  }
}