import { useConnect } from "@stacks/connect-react";
import { StacksMainnet } from "@stacks/network";
import {
  AnchorMode,
  ClarityType,
  ListCV,
  PostConditionMode,
  cvToString,
  hexToCV,
  listCV,
  principalCV,
} from "@stacks/transactions";
import { Box, Button, Flex } from "@stacks/ui";
import { useEffect, useState } from "react";
import { fastPool } from "../lib/constants";
import { getDelegateStackStxManyTxs } from "../lib/fpTxs";
import { getPendingMembers } from "../lib/pox3events";
import { getPox3RevokeTx } from "../lib/pox3txs";
import { toHumanReadableStx } from "../lib/unit-converts";
import {
  InfoCard,
  InfoCardLabel,
  InfoCardRow,
  InfoCardSection,
  InfoCardValue,
} from "./InfoCard";

function hasMemberRevoked(member: string, revokeTxs: any[]) {
  return revokeTxs.some((tx) => tx.sender_address === member);
}

function extendFailed(member: string, delegateStackStxManyTxs: any[]) {
  return delegateStackStxManyTxs.some((tx) =>
    (hexToCV(tx.contract_call.function_args[0].hex) as ListCV).list.some(
      (stacker, index) =>
        cvToString(stacker) === member &&
        (tx.tx_status === "pending" ||
          (hexToCV(tx.tx_result.hex) as any).value.data["locking-result"].list[
            index
          ].type === ClarityType.ResponseErr)
    )
  );
}

export function PendingMembers({ cycleId }: { cycleId: number }) {
  const { doContractCall } = useConnect();

  const [pendingMembers, setPendingMembers] = useState<{
    stackers: string[];
    amountsUstx: string[];
  }>({
    stackers: [],
    amountsUstx: [],
  });
  const [revokeTxs, setRevokeTxs] = useState([]);
  const [delegateStackStxManyTxs, setDelegateStackStxManyTxs] = useState([]);
  useEffect(() => {
    getPendingMembers(cycleId).then((queryResult) =>
      setPendingMembers(queryResult)
    );
    getPox3RevokeTx().then((pox3RevokeTxs) => setRevokeTxs(pox3RevokeTxs));
    getDelegateStackStxManyTxs().then((txs) => setDelegateStackStxManyTxs(txs));
  }, [cycleId, setPendingMembers, setRevokeTxs, setDelegateStackStxManyTxs]);

  function delegateStackStxMany(start: number, end: number) {
    const [contractAddress, contractName] = fastPool.stacks.split(".");
    doContractCall({
      network: new StacksMainnet(),
      anchorMode: AnchorMode.Any,
      contractAddress,
      contractName,
      functionName: "delegate-stack-stx-many",
      functionArgs: [
        listCV(
          filteredStackers.slice(start, end).map((user) => principalCV(user))
        ),
      ],
      postConditionMode: PostConditionMode.Deny,
      postConditions: [],
      onFinish: (data) => {
        console.log("onFinish:", data);
        if (end > filteredStackers.length || end >= 300) {
          window
            .open(`https://explorer.hiro.so/txid/${data.txId}`, "_blank")
            .focus();
        } else {
          delegateStackStxMany(end, end + 30);
        }
      },
      onCancel: () => {
        console.log("onCancel:", "Transaction was canceled");
      },
    });
  }

  const filteredStackers = pendingMembers.stackers.filter(
    (user) =>
      !hasMemberRevoked(user, revokeTxs) &&
      !extendFailed(user, delegateStackStxManyTxs)
  );

  console.log(delegateStackStxManyTxs);

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
              {pendingMembers.stackers.map((member, index) => (
                <InfoCardRow key={index}>
                  {hasMemberRevoked(member, revokeTxs) ? (
                    <>
                      {" "}
                      <InfoCardLabel>
                        <s>{member}</s>
                      </InfoCardLabel>
                      <InfoCardValue>(revoked)</InfoCardValue>
                    </>
                  ) : extendFailed(member, delegateStackStxManyTxs) ? (
                    <>
                      {" "}
                      <InfoCardLabel>
                        <s>{member}</s>
                      </InfoCardLabel>
                      <InfoCardValue>
                        {toHumanReadableStx(
                          pendingMembers.amountsUstx[index],
                          0
                        )}
                      </InfoCardValue>
                    </>
                  ) : (
                    <>
                      <InfoCardLabel>{member}</InfoCardLabel>
                      <InfoCardValue>
                        {toHumanReadableStx(
                          pendingMembers.amountsUstx[index],
                          0
                        )}
                      </InfoCardValue>
                    </>
                  )}
                </InfoCardRow>
              ))}
            </InfoCardSection>
            <Button onClick={() => delegateStackStxMany(0, 30)}>
              Self-service extend
            </Button>
          </Flex>
        </Box>
      </InfoCard>
    </Flex>
  );
}
