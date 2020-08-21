import * as React from 'react';

import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../../utils/palette-creator';

export interface ImagePanelProps {
  paletteImageSrc: string;
  onClose: () => unknown;
  onSave: (ev: React.FormEvent) => unknown;
  saved?: boolean;
  loggedIn?: boolean;
  paletteName: string;
  onPaletteNameChange: (ev: React.ChangeEvent<HTMLInputElement>) => unknown;
}

export const ImagePanel: React.FunctionComponent<ImagePanelProps> = (props: ImagePanelProps): JSX.Element => (
  <section className="backdrop" onClick={props.onClose}>
    <aside className="image-panel" onClick={ev => ev.stopPropagation()}>
      <img src={props.paletteImageSrc} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />
      <section className="info-container">
        <header className="info-header">
          Actions
        </header>
        <article className="info-content">
          <form className="flex v-center" onSubmit={props.onSave}>
            <input
              disabled={props.saved}
              className="text-field flex-grow"
              value={props.paletteName}
              onChange={props.onPaletteNameChange}
            />
            &nbsp;
            <button className="button text" disabled={props.saved} type="submit">
              Save{props.saved && "d"} {!props.loggedIn && (`(Log in required)`)}
            </button>
          </form>
          <a className="button" href={props.paletteImageSrc} download={`palette.png`}>
            Download this image
          </a>
          <button className="button warn" onClick={props.onClose}>
            Make some more changes
          </button>
        </article>
      </section>
      <section className="info-container">
        <header className="info-header">
          How to use this
        </header>
        <article className="info-content">
          Download this image, or copy it by right clicking / long-holding it
          and post it in #palette-event in the server to get your palette into
          the palette pool for the next month!
        </article>
      </section>
    </aside>
  </section>
);