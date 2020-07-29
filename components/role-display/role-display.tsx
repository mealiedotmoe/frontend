import * as React from 'react';
import { HSLColor } from 'react-color';

export interface RoleDisplayProps {
  role: string;
  color: string;
  onClick?: () => any;
  className?: string;
  displayText: string;
}

export class RoleDisplay extends React.Component<RoleDisplayProps> {
  public render() {
    return (
      <section
        className={`role-display ${this.props.className}`}
        onClick={() => this.props.onClick && this.props.onClick()}
        style={{ cursor: this.props.onClick ? "pointer" : "default" }}
      >
        <div className="role-name">
          {this.props.role}
        </div>
        <div className="display dark-display" style={{ color: this.props.color }}>
          {this.props.displayText}
        </div>
        <div className="display light-display" style={{ color: this.props.color }}>
          {this.props.displayText}
        </div>
      </section>
    )
  }
}