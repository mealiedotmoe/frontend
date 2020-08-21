import * as React from 'react';
import { MdDelete } from 'react-icons/md';

import { Palette } from '../../utils/api-return-types';
import ReactTooltip from 'react-tooltip';

export interface PaletteCardProps {
  palette: Palette;
  onUse: (palette: Palette) => unknown;
  onDelete: (palette: Palette) => unknown;
  onColorPick?: (color: string) => unknown;
}

export const PaletteCard: React.FunctionComponent<PaletteCardProps> = ({ palette, onUse, onDelete, onColorPick }: PaletteCardProps): JSX.Element => (
  <section className="palette-card">
    <section className="palette">
      {Object.keys(palette).filter(key => (
        key !== "id"
        && key !== "user_id"
        && key !== "name"
        && key !== "created_at"
        && key !== "updated_at"
      )).map((key: string) => (
        <>
          <div
            style={{
              background: palette[key].toString(),
              border: `2px solid ${palette[key]}`
            }}
            className="palette-color"
            onClick={() => onColorPick && onColorPick(palette[key].toString())}
            data-tip
            data-for={`color-tooltip-${palette[key]}`}
          />
          <ReactTooltip type="light" id={`color-tooltip-${palette[key]}`} effect="solid" place="right">
            Use color: {palette[key].toString().toUpperCase()}
          </ReactTooltip>
        </>
      ))}
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
