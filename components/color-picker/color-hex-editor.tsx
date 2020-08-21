import * as React from 'react';

export interface ColorHexEditorProps {
  value: string
}

export const ColorHexEditor: React.FunctionComponent<ColorHexEditorProps> = ({ value }: ColorHexEditorProps): JSX.Element => (
  <form className="color-hex-editor">
    <input className="hex-input" value={value} />
  </form>
)