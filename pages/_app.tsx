import { userSession } from "../components/ConnectWallet";
import { Connect } from "@stacks/connect-react";
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
      <Component {...pageProps} />
    </Connect>
  );
}

export default MyApp;
