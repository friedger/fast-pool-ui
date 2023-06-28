import { userSession } from "../components/ConnectWallet";
import { Connect } from "@stacks/connect-react";
import { CSSReset, ThemeProvider } from "@stacks/ui";
import { AppProps } from "next/app";

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
        <Component {...pageProps} />
      </ThemeProvider>
    </Connect>
  );
}

export default MyApp;
