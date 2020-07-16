import * as React from 'react';
import { observer } from "mobx-react";
import { observable, action } from "mobx";
import Head from 'next/head';
import { ColorPicker, HSLColor } from '../components/color-picker/color-picker';
import { PageTitle } from '../components/page-title/page-title';

@observer
class Palette extends React.Component<{}> {
  @observable private picker: "image" | "palette" = "palette";
  @action private changeContextColor(color: HSLColor): void {
  }
  
  public render() {
    return (
      <section className="picker-container">
        <Head>
          <title>Color Palette: Mealie.Moe</title>
        </Head>
        <aside className="color-picker-container">
          <ColorPicker onChange={(color) => this.changeContextColor(color)} />
          <button className="context-change-text-button">
            Use {this.picker === "image" ? "color palette" : "an image"} instead
          </button>
        </aside>
        <main className="content">
          <PageTitle title="Color Palette" />
        </main>
      </section>
    )
  }
}

export default Palette;