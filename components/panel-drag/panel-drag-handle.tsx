import * as React from 'react';
import interact from 'interactjs';

export interface PanelDragHandleProps {
  onPositionChange?: (x: number, y: number) => any;
  getSelfPosition?: (rect: DOMRect) => any;
}

export class PanelDragHandle extends React.Component<PanelDragHandleProps> {
  private handleRef = React.createRef<HTMLDivElement>();

  public componentDidMount() {
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

  public render() {
    return (
      <div className="panel-drag-handle-container" ref={this.handleRef}>
        <div className="panel-drag-handle" />
        Pull Up
      </div>
    );
  }
}