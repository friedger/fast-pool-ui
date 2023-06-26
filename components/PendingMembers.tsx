import { StacksMainnet } from "@stacks/network";
import { getPendingMembers } from "../lib/pox3events";
import { InfoCardRow } from "./InfoCard";
import { StackingClient } from "@stacks/stacking";
import { Button, Stack } from "@stacks/ui";
import { useEffect, useState } from "react";
import { AnchorMode, PostConditionMode, listCV, principalCV } from "@stacks/transactions";
import { useConnect } from "@stacks/connect-react";
import { fastPool } from "../lib/constants";

export function PendingMembers({ cycleId }: { cycleId: number }) {
  const { doContractCall } = useConnect();

  const [pendingMembers, setPendingMembers] = useState([]);
  useEffect(() => {
    getPendingMembers(cycleId).then((queryResult) =>
      setPendingMembers(queryResult)
    );
  }, [cycleId, setPendingMembers]);


  function delegateStackStxMany() {
    const [contractAddress, contractName] = fastPool.stacks.split(".");
    doContractCall({
      network: new StacksMainnet(),
      anchorMode: AnchorMode.Any,
      contractAddress,
      contractName,
      functionName: "delegate-stack-stx-many",
      functionArgs: [listCV(pendingMembers.map((user) => principalCV(user)))],
      postConditionMode: PostConditionMode.Deny,
      postConditions: [],
      onFinish: (data) => {
        console.log("onFinish:", data);
        window
          .open(`https://explorer.hiro.so/txid/${data.txId}`, "_blank")
          .focus();
      },
      onCancel: () => {
        console.log("onCancel:", "Transaction was canceled");
      },
    });
  }
  return (
    <Stack>
      <>
        <h3>Pending Members cycle {cycleId}</h3>
        <p>
          List of largest members who are not yet stacking for the next cycle,
          up to 30.
        </p>
        {pendingMembers.map((member) => (
          <InfoCardRow key={member}>{member}</InfoCardRow>
        ))}
        <Button onClick={delegateStackStxMany}>Self-service extend</Button>
      </>
    </Stack>
  );
}
