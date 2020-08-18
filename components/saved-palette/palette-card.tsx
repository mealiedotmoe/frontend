import * as React from 'react';
import { MdDelete } from 'react-icons/md';

import { Palette } from '../../utils/api-return-types';
import { confirmAlert } from 'react-confirm-alert';

export interface PaletteCardProps {
  palette: Palette;
  onUse: (palette: Palette) => any;
  onDelete: (palette: Palette) => any;
}

export const PaletteCard: React.FunctionComponent<PaletteCardProps> = ({ palette, onUse, onDelete }): JSX.Element => (
  <section className="palette-card">
    <section className="palette">
      {Object.keys(palette).filter(key => (
        key !== "id"
        && key !== "user_id"
        && key !== "name"
        && key !== "created_at"
        && key !== "updated_at"
      )).map((key: string) => <div style={{ background: palette[key].toString() }} className="palette-color" />)}
    </section>
    <section className="details">
      <header className="info">
        <div className="name">
          {palette.name}
        </div>
        <div className="date">
          {(new Date(palette.created_at)).toLocaleDateString()}
        </div>
      </header>
      <button className="button small" onClick={() => onUse(palette)}>
        Use Palette
      </button>
      <button className="button text warn delete-btn" onClick={() => onDelete(palette)}>
        <MdDelete />
      </button>
    </section>
  </section>
)
