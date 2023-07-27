import ConnectWallet from "../components/ConnectWallet";
import { PendingMembers } from "../components/PendingMembers";
import SetUsers from "../components/SetUsers";
import { CURRENT_CYCLE } from "../lib/constants";

const Helper = () => {
  return (
    <>
      <ConnectWallet />
      <SetUsers />
      <PendingMembers cycleId={CURRENT_CYCLE} />
    </>
  );
};
export default Helper;
