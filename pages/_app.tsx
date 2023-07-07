import { userSession } from "../components/ConnectWallet";
import { Connect } from "@stacks/connect-react";
import { CSSReset, Flex, Text, ThemeProvider } from "@stacks/ui";
import { AppProps } from "next/app";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
  let icon;
  if (typeof window !== "undefined") {
    icon = window.location.origin + "/android-icon-192x192.png";
  }

  return (
    <Connect
      authOptions={{
        appDetails: {
          name: "FAST Pool Community",
          icon,
        },
        redirectTo: "/",
        onFinish: () => {
          window.location.reload();
        },
        userSession,
      }}
    >
      <ThemeProvider>
        {CSSReset}
        <>
          <Head>
            <title>Fast Pool Community</title>
            <meta
              name="description"
              content="Community page for FAST Pool (v2)"
            />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <Flex height="100%" justify="center" align="center" m="extra-loose">
            <Text textStyle="body.large">Fast Pool Community</Text>
          </Flex>
          <Component {...pageProps} />
        </>
      </ThemeProvider>
    </Connect>
  );
}

export default MyApp;
