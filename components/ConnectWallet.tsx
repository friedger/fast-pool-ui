import { AppConfig, UserSession, showConnect } from "@stacks/connect";
import { useConnect } from "@stacks/connect-react";
import { Button } from "@stacks/ui";
import { useEffect, useState } from "react";

const appConfig = new AppConfig(["store_write", "publish_data"]);

export const userSession = new UserSession({ appConfig });

function disconnect() {
  userSession.signUserOut("/");
}

const ConnectWallet = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const { doOpenAuth } = useConnect();

  if (mounted && userSession.isUserSignedIn()) {
    return (
      <div>
        <Button onClick={disconnect}>Disconnect Wallet</Button>
        <p>mainnet: {userSession.loadUserData().profile.stxAddress.mainnet}</p>
        <p>testnet: {userSession.loadUserData().profile.stxAddress.testnet}</p>
      </div>
    );
  }

  return <Button onClick={() => doOpenAuth()}>Connect Wallet</Button>;
};

export default ConnectWallet;
