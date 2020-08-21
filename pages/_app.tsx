import '../components/alert/alert.scss';
import '../components/color-picker/color-picker.scss';
import '../components/faq/faq-card.scss';
import '../components/image-color-picker/image-color-picker.scss';
import '../components/navigator/navigator.scss';
import '../components/page-card/page-card.scss';
import '../components/panel-drag/panel-drag-handle.scss';
import '../components/role-display/role-display.scss';
import '../components/saved-palette/saved-palettes.scss';
import '../styles/admin/faq.scss';
import '../styles/admin/home.scss';
import '../styles/admin/pages.scss';
import '../styles/custom-react-confirm.scss';
import '../styles/faq.scss';
import '../styles/index.scss';
import '../styles/login-redirect.scss';
import '../styles/logout.scss';
import '../styles/markdown-content.scss';
import '../styles/markdown-guide.scss';
import '../styles/not-found.scss';
import '../styles/pages.scss';
import '../styles/palette.scss';
import '../styles/server-map.scss';

import Head from 'next/head';
import * as React from 'react';
import { AppProps } from 'next/app';

export default function MyApp({ Component, pageProps }: AppProps): React.ReactNode {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}