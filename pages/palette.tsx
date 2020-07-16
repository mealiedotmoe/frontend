import * as React from 'react';
import { observer } from "mobx-react";
import { observable, action } from "mobx";
import Head from 'next/head';
import { ColorPicker, HSLColor } from '../components/color-picker/color-picker';
import { PageTitle } from '../components/page-title/page-title';
import { ROLES } from '../utils/roles';
import { RoleDisplay } from '../components/role-display/role-display';
import Color from 'color';
import { MdCheck, MdClose } from "react-icons/md";

@observer
class Palette extends React.Component<{}> {
  @observable private picker: "image" | "palette" = "palette";
  @observable private roleColorMap: { [key: string]: string; } = {};
  @observable private selectedRole: string = "Clover";
  @observable private displayText: string = "Sample";
  private lastColor = "#FF0000";

  public constructor(props: {}) {
    super(props);
    ROLES.forEach(role => this.roleColorMap[role] = "#FF0000");
  } 
  
  @action private changeSelectedColor(color: HSLColor): void {
    const hex = Color(`hsl(${color.hue}, ${color.saturation * 100}%, ${color.luminance}%)`).hex();
    this.roleColorMap[this.selectedRole] = hex;
    this.lastColor = hex;
  }

  @action private selectRole(role: string): void {
    this.selectedRole = role;
    this.roleColorMap[role] = this.lastColor;
  }
  
  public render() {
    return (
      <section className="picker-container">
        <Head>
          <title>Color Palette: Mealie.Moe</title>
        </Head>
        <aside className="color-picker-container">
          <ColorPicker onChange={(color) => this.changeSelectedColor(color)} />
          <button className="context-change-text-button">
            Use {this.picker === "image" ? "color palette" : "an image"} instead
          </button>
        </aside>
        <main className="content">
          <PageTitle title="Color Palette" />
          <section className="roles-representations">
            <section className="list-view">
              <section className="display-text-input">
                <label className="label">Text to use</label>
                <input
                  className="text-field"
                  style={{ width: 140 }}
                  value={this.displayText}
                  onChange={ev => this.displayText = ev.target.value}
                  placeholder="Start typing to view"
                  maxLength={8}
                />
              </section>
              {ROLES.map(role => (
                <RoleDisplay
                  role={role}
                  key={role}
                  displayText={this.displayText}
                  color={this.roleColorMap[role]}
                  onClick={() => this.selectRole(role)}
                  className={role === this.selectedRole ? "selected" : ""}
                />
              ))}
            </section>
            <section className="contrast-warn-list">
              <section className="contrast-check-title">
                Contrast
              </section>
              {ROLES.map(role => (
                <section className="warn-container">
                  {Color(this.roleColorMap[role]).contrast(Color("#36393F")) < 3.1 ? (
                    <div className="warn">
                      <MdClose className="icon close" /> Dark
                    </div>
                  ) : (
                    <div className="warn">
                      <MdCheck className="icon check" /> Dark
                    </div>
                  )}
                  {Color(this.roleColorMap[role]).contrast(Color("#FFFFFF")) < 3.1 ? (
                    <div className="warn">
                      <MdClose className="icon close" /> Light
                    </div>
                  ) : (
                    <div className="warn">
                      <MdCheck className="icon check" /> Light
                    </div>
                  )}
                </section>
              ))}
            </section>
          </section>
        </main>
      </section>
    )
  }
}

export default Palette;