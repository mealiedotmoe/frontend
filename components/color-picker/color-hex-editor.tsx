import * as React from 'react';
import { HSLColor } from './color-picker';

export interface ColorHexEditorProps {
  value: string
}

export const ColorHexEditor: React.FunctionComponent<ColorHexEditorProps> = ({ value }): JSX.Element => (
  <form className="color-hex-editor">
    <input className="hex-input" value={value} />
  </form>
)