import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { confirmAlert } from 'react-confirm-alert';

import { apiFetch } from '../../utils/api-fetch';
import { Palette } from '../../utils/api-return-types';
import { redirectToLogin } from '../../utils/login';
import { PaletteCard } from './palette-card';
import Constants from "../../utils/constants.json";

export interface SavedPaletteProps {
  onChange: (palette: Palette) => unknown;
  onColorPick?: (color: string) => unknown;
}

@observer
export class SavedPalettes extends React.Component<SavedPaletteProps> {
  @observable private loaded = false;
  @observable private palettes: Array<Palette> = [];
  @observable private notLoggedIn = false;

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
        onClick: () => { return; }
      }, {
        label: "Yep",
        onClick: () => this.deletePalette(palette)
      }],
      message: `Are you sure you want to delete ${palette.name}?`,
      title: "Confirm Delete"
    });
  }

  private async deletePalette(palette: Palette): Promise<void> {
    await apiFetch<Palette>(`/palette/me/${palette.id}`, "DELETE");
    this.loadPalettes();
  }

  public componentDidMount(): void {
    this.loadPalettes();
  }

  public render(): React.ReactNode {
    return (
      <section className="saved-palettes">
        {!this.loaded && !this.notLoggedIn && (
          <section className="loading-hint">
            <img src="/images/undraw_in_thought.svg" className="illustration" />
            Loading palettes
          </section>
        )}
        {this.loaded && !this.notLoggedIn && this.palettes.length === Constants.EMPTY_LENGHT && (
          <section className="loading-hint">
            <img src="/images/undraw_empty.svg" className="illustration" />
            No palettes saved yet
          </section>
        )}
        {this.loaded && this.palettes.length !== Constants.EMPTY_LENGHT && (
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
                  onColorPick={this.props.onColorPick}
                />
              ))}
            </section>
          </>
        )}
        {this.notLoggedIn && (
          <section className="loading-hint">
            <img src="/images/undraw_enter.svg" className="illustration" />
            <button className="button" onClick={() => redirectToLogin()}>
              You need to log in first
            </button>
          </section>
        )}
      </section>
    )
  }
}