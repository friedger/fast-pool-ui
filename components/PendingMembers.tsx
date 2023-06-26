import { fastPool } from "../lib/constants";
import { getPendingMembers } from "../lib/pox3events";
import { InfoCard, InfoCardRow, InfoCardSection } from "./InfoCard";
import { useConnect } from "@stacks/connect-react";
import { StacksMainnet } from "@stacks/network";
import { StackingClient } from "@stacks/stacking";
import {
  AnchorMode,
  PostConditionMode,
  listCV,
  principalCV,
} from "@stacks/transactions";
import { Box, Button, Flex, Stack } from "@stacks/ui";
import { useEffect, useState } from "react";

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
    <Flex height="100%" justify="center" align="center">
      <InfoCard>
        <Box mx={["loose", "extra-loose"]}>
          <Flex flexDirection="column" pt="extra-loose" pb="base-loose">
            <h3>Pending Members cycle {cycleId}</h3>
            <p>
              List of largest members who are not yet stacking for the next
              cycle, up to 30.
            </p>
            <InfoCardSection>
              {pendingMembers.map((member) => (
                <InfoCardRow key={member}>{member}</InfoCardRow>
              ))}
            </InfoCardSection>
            <Button onClick={delegateStackStxMany}>Self-service extend</Button>
          </Flex>
        </Box>
      </InfoCard>
    </Flex>
  );
}
