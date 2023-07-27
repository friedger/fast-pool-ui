import ConnectWallet from "../components/ConnectWallet";
import { PendingMembers } from "../components/PendingMembers";
import SetUsers from "../components/SetUsers";
import { NEXT_CYCLE } from "../lib/constants";

const Helper = () => {
  return (
    <>
      <ConnectWallet />
      <SetUsers />
      <PendingMembers cycleId={NEXT_CYCLE} />
    </>
  );
};
export default Helper;
