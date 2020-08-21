import * as React from 'react';
import interact from 'interactjs';
import { MdArrowDropDown } from 'react-icons/md';

export interface PanelDragHandleProps {
  onPositionChange?: (x: number, y: number) => unknown;
  getSelfPosition?: (rect: DOMRect) => unknown;
  onDock?: () => unknown;
}

export class PanelDragHandle extends React.Component<PanelDragHandleProps> {
  private handleRef = React.createRef<HTMLDivElement>();

  public componentDidMount(): void {
    if (!this.handleRef.current) return;
    this.props.getSelfPosition && this.props.getSelfPosition(this.handleRef.current.getBoundingClientRect());

    interact(this.handleRef.current)
      .draggable({
        inertia: true,
        listeners: {
          move: (event: Interact.DragEvent) => {
            const { page: { x: x, y: y } } = event;
            this.props.onPositionChange && this.props.onPositionChange(x, y);
          }
        }
      });
  }

  public render(): React.ReactNode {
    return (
      <div className="panel-drag-handle-container" ref={this.handleRef}>
        <div className="panel-drag-handle" />
        Pull Up
        <button className="button text dock-btn" onClick={this.props.onDock}>
          <MdArrowDropDown className="icon" /> Dock
        </button>
      </div>
    );
  }
}