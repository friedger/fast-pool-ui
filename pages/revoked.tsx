import ConnectWallet from "../components/ConnectWallet";
import { Revoked } from "../components/Revoked";

const LastRevokedTransactions = () => {
  return (
    <>
      <ConnectWallet />
      <Revoked />
    </>
  );
};
export default LastRevokedTransactions;
