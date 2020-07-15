import * as React from 'react';
import { observer } from "mobx-react";
import { observable } from "mobx";
import Head from 'next/head';
import { ColorPicker } from '../components/color-picker/color-picker';
import { PageTitle } from '../components/page-title/page-title';

@observer
class Palette extends React.Component<{}> {
  public render() {
    return (
      <section className="picker-container">
        <Head>
          <title>Color Palette: Mealie.Moe</title>
        </Head>
        <aside className="color-picker-container">
          <ColorPicker />
        </aside>
        <main className="content">
          <PageTitle title="Color Palette" />
        </main>
      </section>
    )
  }
}

export default Palette;