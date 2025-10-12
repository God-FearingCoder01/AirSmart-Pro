import '../output.css';
import type { AppProps } from "next/app";
import Layout from "../components/Layout";
import "../styles/globals.css";

type NextComponentWithNoLayout = AppProps['Component'] & { noLayout?: boolean };

export default function MyApp({ Component, pageProps }: AppProps) {
  const Comp = Component as NextComponentWithNoLayout;
  if (Comp.noLayout) {
    return <Component {...pageProps} />;
  }
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}