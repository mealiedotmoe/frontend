import * as React from 'react';
import { observer } from "mobx-react";
import { observable, action } from "mobx";
import Head from 'next/head';
import { default as ColorPicker } from '../components/color-picker/color-picker';
import { PageTitle } from '../components/page-title/page-title';
import { ROLES } from '../utils/roles';
import { RoleDisplay } from '../components/role-display/role-display';
import Color, { lab } from 'color';
import { MdCheck, MdClose } from "react-icons/md";
import { Navigator } from '../components/navigator/navigator';

@observer
class Palette extends React.Component<{}> {
  @observable private picker: "image" | "palette" = "palette";
  @observable private roleColorMap: { [key: string]: string; } = {};
  @observable private selectedRole: string = "Clover";
  @observable private displayText: string = "Sample";

  public constructor(props: {}) {
    super(props);
    ROLES.forEach(role => this.roleColorMap[role] = '#428AE9');
  } 
  
  @action private changeSelectedColor(color: string): void {
    this.roleColorMap[this.selectedRole] = color;
  }

  @action private selectRole(role: string): void {
    this.selectedRole = role;
  }
  
  public render() {
    return (
      <section className="picker-container">
        <Head>
          <title>Color Palette: Mealie.Moe</title>
        </Head>
        <aside className="color-picker-container">
          <ColorPicker color={this.roleColorMap[this.selectedRole]} onChange={(color) => this.changeSelectedColor(color.hex)} />
          <button className="context-change-text-button">
            Use {this.picker === "image" ? "color palette" : "an image"} instead
          </button>
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
          <Navigator />
        </main>
      </section>
    )
  }
}

export default Palette;