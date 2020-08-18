import Color from 'color';
import { action, computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import cookies from 'next-cookies';
import Head from 'next/head';
import * as React from 'react';
import { MdCheck, MdClose } from 'react-icons/md';
import { animals, colors, uniqueNamesGenerator } from 'unique-names-generator';

import ColorPicker from '../components/color-picker/color-picker';
import { ImageColorPicker } from '../components/image-color-picker/image-color-picker';
import { ImagePanel } from '../components/image-panel/image-panel';
import { Navigator } from '../components/navigator/navigator';
import { PageTitle } from '../components/page-title/page-title';
import { RoleDisplay } from '../components/role-display/role-display';
import { SavedPalettes } from '../components/saved-palette/saved-palettes';
import { apiFetch } from '../utils/api-fetch';
import { Palette as APIPalette, User } from '../utils/api-return-types';
import { redirectToLogin } from '../utils/login';
import { paletteCreator } from '../utils/palette-creator';
import { ROLES } from '../utils/roles';

@observer
class Palette extends React.Component<InferGetServerSidePropsType<typeof getServerSideProps>> {
  @observable private picker: "image" | "palette" | "saved" = "palette";
  @observable private roleColorMap: { [key: string]: string; } = {};
  @observable private selectedRole: string = "Clover";
  @observable private displayText: string = "Sample";
  @observable private generatedPaletteImageSrc?: string;
  @observable private paletteName: string = uniqueNamesGenerator({ dictionaries: [colors, animals], length: 2, separator: " ", style: "capital" });
  @observable private saved: boolean = false;

  public constructor(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
    super(props);
    ROLES.forEach(role => this.roleColorMap[role] = '#428AE9');
  } 
  
  @action private changeSelectedColor(color: string): void {
    this.roleColorMap[this.selectedRole] = color;
  }

  @action private selectRole(role: string): void {
    this.selectedRole = role;
  }

  private async createPalette(): Promise<void> {
    try {
      const currentUser = await apiFetch<User>("/user/me", "GET");

      const canvas = paletteCreator(this.roleColorMap, currentUser.username);
      this.generatedPaletteImageSrc = canvas.toDataURL();
    } catch (e) {
      // Possible error is that we aren't logged in yet;
      const canvas = paletteCreator(this.roleColorMap, "Anonymous");
      this.generatedPaletteImageSrc = canvas.toDataURL();
    }
  }

  private async savePaletteToAPI(ev: React.FormEvent): Promise<void> {
    ev.preventDefault();
    if (!this.props.loggedIn) redirectToLogin();
    const result = await apiFetch<APIPalette>("/palette/me", "POST", {
      clover: this.roleColorMap["Clover"],
      member: this.roleColorMap["Member"],
      active: this.roleColorMap["Active"],
      regular: this.roleColorMap["Regular"],
      contributor: this.roleColorMap["Contributor"],
      addicted: this.roleColorMap["Addicted"],
      insomniac: this.roleColorMap["Insomniac"],
      nolifer: this.roleColorMap["No Lifer"],
      birthday: this.roleColorMap["Birthday"],
      name: this.paletteName
    });
    this.saved = true;
  }

  @action private cancelImagePanel(): void {
    this.generatedPaletteImageSrc = undefined;
    this.saved = false;
    this.paletteName = uniqueNamesGenerator({ dictionaries: [colors, animals], length: 2, separator: " ", style: "capital" });
  }

  @action private initPaletteFromSaved(palette: APIPalette): void {
    this.roleColorMap = {
      Clover: palette["clover"],
      Member: palette["member"],
      Active: palette["active"],
      Regular: palette["regular"],
      Contributor: palette["contributor"],
      Addicted: palette["addicted"],
      Insomniac: palette["insomniac"],
      "No Lifer": palette["nolifer"],
      Birthday: palette["birthday"],
    };
  }

  @computed private get imagePanel(): React.ReactNode {
    if (!this.generatedPaletteImageSrc) return null;

    return (
      <ImagePanel
        paletteImageSrc={this.generatedPaletteImageSrc || ""}
        onClose={() => this.cancelImagePanel()}
        paletteName={this.paletteName}
        onPaletteNameChange={ev => this.paletteName = ev.target.value}
        onSave={ev => this.savePaletteToAPI(ev)}
        loggedIn={this.props.loggedIn}
        saved={this.saved}
      />
    );
  }

  @computed private get renderPickerComponent(): React.ReactNode {
    switch (this.picker) {
      case 'image':
        return <ImageColorPicker onChange={color => this.changeSelectedColor(color)} />;
      case 'palette':
        return <ColorPicker color={this.roleColorMap[this.selectedRole]} onChange={(color) => this.changeSelectedColor(color.hex)} />;
      case 'saved':
        return <SavedPalettes onChange={(palette: APIPalette) => this.initPaletteFromSaved(palette)} />;
    }
  }
  
  public render() {
    return (
      <section className="picker-container">
        <Head>
          <title>Color Palette: Mealie.Moe</title>
        </Head>
        <aside className="color-picker-container">
          {this.renderPickerComponent}
          <section className="actions">
            <button className="button text" onClick={() => this.picker = this.picker === "image" ? "palette" : "image"}>
              Use {this.picker === "image" ? "color picker" : "an image"} instead
            </button>
            <button className="button text" onClick={() => this.picker = this.picker === "saved" ? "palette" : "saved"}>
              {this.picker === "saved" ? (
                "Back to color picker"
              ) : (
                "View saved palettes"
              )}
            </button>
          </section>
        </aside>
        <main className="content">
          <PageTitle title="Color Palette" />
          <section className="roles-display">
            <header className="col-header input-header">
              <label className="input-label">Text to display</label>
              <input className="text-field" value={this.displayText} onChange={ev => this.displayText = ev.target.value} />
            </header>
            <header className="col-header">
              Dark
            </header>
            <header className="col-header">
              Light
            </header>
            {ROLES.map(role => (
              <>
                <RoleDisplay
                  color={this.roleColorMap[role]}
                  displayText={this.displayText}
                  onClick={() => this.selectRole(role)}
                  key={role}
                  role={role} className={role === this.selectedRole ? "selected" : ""}
                />
                {Color(this.roleColorMap[role]).contrast(Color("#36393F")) < 3.1 ? (
                  <div className="icon-container"><MdClose className="status-icon warn" /></div>
                ) : (
                  <div className="icon-container"><MdCheck className="status-icon check" /></div>
                )}
                {Color(this.roleColorMap[role]).contrast(Color("#FFFFFF")) < 3.1 ? (
                  <div className="icon-container"><MdClose className="status-icon warn" /></div>
                ) : (
                  <div className="icon-container"><MdCheck className="status-icon check" /></div>
                )}
              </>
            ))}
          </section>
          <section className="actions">
            <button className="button" onClick={() => this.createPalette()}>
              Create Palette
            </button>
          </section>
          {this.imagePanel}
          <Navigator loggedIn={this.props.loggedIn} />
        </main>
      </section>
    )
  }
}

export default Palette;

export const getServerSideProps: GetServerSideProps<{
  loggedIn: boolean;
}> = async (context: GetServerSidePropsContext) => {
  const token = cookies(context)['session-jwt'];
  if (!token) {
    return {
      props: {
        loggedIn: Boolean(token),
      }
    };
  }

  return {
    props: {
      loggedIn: Boolean(token)
    },
  };
}
