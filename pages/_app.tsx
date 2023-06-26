import { Connect } from "@stacks/connect-react";
import { ThemeProvider } from "@stacks/ui";
import { AppProps } from "next/app";
import { userSession } from "../components/ConnectWallet";

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
        <Component {...pageProps} />
      </ThemeProvider>
    </Connect>
  );
}

export default MyApp;
