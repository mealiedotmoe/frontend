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
import { DraggablePanel } from '../components/panel-drag/draggable-panel';

@observer
class Palette extends React.Component<InferGetServerSidePropsType<typeof getServerSideProps>> {
  @observable private picker: "image" | "palette" | "saved" = "palette";
  @observable private roleColorMap: { [key: string]: string; } = {};
  @observable private selectedRole = "Clover";
  @observable private displayText = "Sample";
  @observable private generatedPaletteImageSrc?: string;
  @observable private paletteName: string = uniqueNamesGenerator({ dictionaries: [colors, animals], length: 2, separator: " ", style: "capital" });
  @observable private saved = false;
  @observable private isMobile = false;
  @observable private tabIndex = 0;

  public constructor(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
    super(props);
    ROLES.forEach(role => this.roleColorMap[role] = '#428AE9');
  } 
  
  public componentDidMount(): void {
    const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
    this.isMobile = mobileRegex.test(navigator.userAgent.toLowerCase());
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
    await apiFetch<APIPalette>("/palette/me", "POST", {
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
    if (this.isMobile) {
      // It's a mobile device
      return (
        <>
          <nav className="picker-tab-container">
            <button
              className={`picker-tab ${this.tabIndex === 0 && "selected"}`}
              onClick={() => this.tabIndex = 0}
            >
              Color
            </button>
            <button
              className={`picker-tab ${this.tabIndex === 1 && "selected"}`}
              onClick={() => this.tabIndex = 1}
            >
              Image
            </button>
            <button
              className={`picker-tab ${this.tabIndex === 2 && "selected"}`}
              onClick={() => this.tabIndex = 2}
            >
              Saved
            </button>
          </nav>
          <section className="picker-tabs-container">
            {this.tabIndex === 0 && (
              <ColorPicker
                color={this.roleColorMap[this.selectedRole]}
                onChange={(color) => this.changeSelectedColor(color.hex)}
              />
            )}
            {this.tabIndex === 1 && (
              <ImageColorPicker
                onChange={color => this.changeSelectedColor(color)}
              />
            )}
            {this.tabIndex === 2 && (
              <SavedPalettes
                onChange={(palette: APIPalette) => this.initPaletteFromSaved(palette)}
                onColorPick={(color: string) => this.changeSelectedColor(color)}
              />
            )}
          </section>
        </>
      );
    }

    switch (this.picker) {
      case 'image':
        return (
          <ImageColorPicker
            onChange={color => this.changeSelectedColor(color)}
          />
        );
      case 'palette':
        return (
          <ColorPicker
            color={this.roleColorMap[this.selectedRole]}
            onChange={(color) => this.changeSelectedColor(color.hex)}
          />
        );
      case 'saved':
        return (
          <SavedPalettes
            onChange={(palette: APIPalette) => this.initPaletteFromSaved(palette)}
            onColorPick={(color: string) => this.changeSelectedColor(color)}
          />
        );
    }
  }
  
  public render(): React.ReactNode {
    return (
      <section className="picker-container">
        <Head>
          <title>Color Palette: Mealie.Moe</title>
        </Head>
        <DraggablePanel className="color-picker-container">
          <>
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
          </>
        </DraggablePanel>
        <section className="content">
          <PageTitle title="Color Palette" />
          <section className="roles-display">
            <header className="col-header input-header">
              <label className="input-label">Text to display</label>
              <input className="text-field" value={this.displayText} onChange={ev => this.displayText = ev.target.value} maxLength={12} />
            </header>
            <div className="check-container header">
              <header className="col-header">
                Dark
              </header>
              <header className="col-header">
                Light
              </header>
            </div>
            {ROLES.map(role => (
              <>
                <RoleDisplay
                  color={this.roleColorMap[role]}
                  displayText={this.displayText}
                  onClick={() => this.selectRole(role)}
                  key={role}
                  role={role} className={role === this.selectedRole ? "selected" : ""}
                />
                <div className="check-container">
                  {Color(this.roleColorMap[role]).contrast(Color("#36393F")) < 3.1 ? (
                    <div className="icon-container">
                      <MdClose className="status-icon warn" />
                      <span className="contrast-label">Dark</span>
                </div>
                  ) : (
                    <div className="icon-container">
                      <MdCheck className="status-icon check" />
                      <span className="contrast-label">Dark</span>
                    </div>
                  )}
                  {Color(this.roleColorMap[role]).contrast(Color("#FFFFFF")) < 3.1 ? (
                    <div className="icon-container">
                      <MdClose className="status-icon warn" />
                      <span className="contrast-label">Light</span>
                    </div>
                  ) : (
                    <div className="icon-container">
                      <MdCheck className="status-icon check" />
                      <span className="contrast-label">Light</span>
                    </div>
                  )}
                </div>
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
        </section>
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
