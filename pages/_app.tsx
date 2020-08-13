import "../styles/index.scss";
import "../components/color-picker/color-picker.scss";
import "../styles/palette.scss";
import "../components/role-display/role-display.scss";
import "../styles/faq.scss";
import "../components/navigator/navigator.scss";
import "../components/faq/faq-card.scss";
import "../styles/markdown-content.scss";
import "../styles/admin/home.scss";
import "../styles/admin/faq.scss";
import "../styles/markdown-guide.scss";
import "../components/alert/alert.scss";
import "../styles/admin/pages.scss";
import "../styles/pages.scss";
import "../components/page-card/page-card.scss";
import "../styles/not-found.scss";
import "../components/image-color-picker/image-color-picker.scss";

export default function MyApp({ Component, pageProps }: { Component: any; pageProps: any; }) {
  return (
    <Component {...pageProps} />
  );
}