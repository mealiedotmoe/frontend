import "../styles/index.scss";

export default function MyApp({ Component, pageProps }: { Component: any; pageProps: any; }) {
  return <Component {...pageProps} />
}