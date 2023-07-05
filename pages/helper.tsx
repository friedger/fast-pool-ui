import ConnectWallet from "../components/ConnectWallet";
import { PendingMembers } from "../components/PendingMembers";
import SetUsers from "../components/SetUsers";

const Helper = () => {
  return (
    <>
      <ConnectWallet />
      <SetUsers />
      <PendingMembers cycleId={63} />
    </>
  );
};
export default Helper;
