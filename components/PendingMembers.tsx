import { fastPool } from "../lib/constants";
import { getPendingMembers } from "../lib/pox3events";
import { getPox3RevokeTx } from "../lib/pox3txs";
import { InfoCard, InfoCardRow, InfoCardSection } from "./InfoCard";
import { useConnect } from "@stacks/connect-react";
import { StacksMainnet } from "@stacks/network";
import {
  AnchorMode,
  PostConditionMode,
  listCV,
  principalCV,
} from "@stacks/transactions";
import { Box, Button, Flex } from "@stacks/ui";
import { useEffect, useState } from "react";

function hasMemberRevoked(member: string, revokeTxs: any[]) {
  return revokeTxs.some((tx) => tx.sender_address === member);
}

export function PendingMembers({ cycleId }: { cycleId: number }) {
  const { doContractCall } = useConnect();

  const [pendingMembers, setPendingMembers] = useState([]);
  const [revokeTxs, setRevokeTxs] = useState([]);

  useEffect(() => {
    getPendingMembers(cycleId).then((queryResult) =>
      setPendingMembers(queryResult)
    );
    getPox3RevokeTx().then((pox3RevokeTxs) => setRevokeTxs(pox3RevokeTxs));
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

  console.log({ pendingMembers }, revokeTxs.map(t => t.sender_address));
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
                <>
                  {hasMemberRevoked(member, revokeTxs) ? (
                    <InfoCardRow key={member}><s>{member}</s> (revoked)</InfoCardRow>
                  ) : (
                    <InfoCardRow key={member}>{member}</InfoCardRow>
                  )}
                </>
              ))}
            </InfoCardSection>
            <Button onClick={delegateStackStxMany}>Self-service extend</Button>
          </Flex>
        </Box>
      </InfoCard>
    </Flex>
  );
}
