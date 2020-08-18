import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { confirmAlert } from 'react-confirm-alert';

import { apiFetch } from '../../utils/api-fetch';
import { Palette } from '../../utils/api-return-types';
import { redirectToLogin } from '../../utils/login';
import { PaletteCard } from './palette-card';

export interface SavedPaletteProps {
  onChange: (palette: Palette) => any;
}

@observer
export class SavedPalettes extends React.Component<SavedPaletteProps> {
  @observable private loaded: boolean = false;
  @observable private palettes: Array<Palette> = [];
  @observable private notLoggedIn: boolean = false;

  @action private async loadPalettes(): Promise<void> {
    try {
      const palettes = await apiFetch<Array<Palette>>("/palette/me/", "GET");
      this.palettes = palettes;
      this.loaded = true;
    } catch (e) {
      this.notLoggedIn = true;
    }
  }

  private confirmPaletteDelete(palette: Palette): void {
    confirmAlert({
      buttons: [{
        label: "Cancel",
        onClick: () => { }
      }, {
        label: "Yep",
        onClick: () => this.deletePalette(palette)
      }],
      message: `Are you sure you want to delete ${palette.name}?`,
      title: "Confirm Delete"
    });
  }

  private async deletePalette(palette: Palette): Promise<void> {
    const result = await apiFetch<Palette>(`/palette/me/${palette.id}`, "DELETE");
    this.loadPalettes();
  }

  public componentDidMount(): void {
    this.loadPalettes();
  }

  public render() {
    return (
      <section className="saved-palettes">
        {!this.loaded && (
          <section className="loading-hint">
            Loading palettes...
          </section>
        )}
        {this.loaded && this.palettes.length === 0 && (
          <section className="loading-hint">
            No palettes saved yet
          </section>
        )}
        {this.loaded && this.palettes.length !== 0 && (
          <>
            <header className="title">
              Saved Palettes
            </header>
            <section className="palettes-container">
              {this.palettes.map(palette => (
                <PaletteCard
                  palette={palette}
                  onUse={this.props.onChange}
                  onDelete={(palette) => this.confirmPaletteDelete(palette)}
                  key={palette.id}
                />
              ))}
            </section>
          </>
        )}
        {this.notLoggedIn && (
          <button className="button" onClick={() => redirectToLogin()}>
            You need to log in first
          </button>
        )}
      </section>
    )
  }
}