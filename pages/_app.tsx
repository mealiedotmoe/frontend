import "../styles/index.scss";
import "../components/color-picker/color-picker.scss";
import "../styles/palette.scss";
import "../components/role-display/role-display.scss";

export default function MyApp({ Component, pageProps }: { Component: any; pageProps: any; }) {
  return <Component {...pageProps} />
}