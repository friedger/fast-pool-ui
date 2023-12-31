import { fastPool } from "../lib/constants";
import { getDelegateStackStxManyTxs } from "../lib/fpTxs";
import { getPendingMembers } from "../lib/pox3events";
import { getPox3RevokeTx } from "../lib/pox3txs";
import { toHumanReadableStx } from "../lib/unit-converts";
import { userSession } from "./ConnectWallet";
import {
  InfoCard,
  InfoCardLabel,
  InfoCardRow,
  InfoCardSection,
  InfoCardValue,
} from "./InfoCard";
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
import { Box, Button, Flex, Text } from "@stacks/ui";
import { useEffect, useState } from "react";

function hasMemberRevoked(
  member: string,
  blockHeight: number,
  revokeTxs: any[]
) {
  return revokeTxs.some(
    (tx) => tx.block_height > blockHeight && tx.sender_address === member
  );
}

function pendingOrExtendFailed(
  member: string,
  blockHeight: number,
  delegateStackStxManyTxs: any[]
) {
  return delegateStackStxManyTxs.find(
    (tx) =>
      (tx.tx_status === "pending" || tx.block_height > blockHeight) &&
      (hexToCV(tx.contract_call.function_args[0].hex) as ListCV).list.some(
        (stacker, index) =>
          cvToString(stacker) === member &&
          (tx.tx_status === "pending" ||
            (hexToCV(tx.tx_result.hex) as any).value.data["locking-result"]
              .list[index].type === ClarityType.ResponseErr)
      )
  );
}

export function PendingMembers({ cycleId }: { cycleId: number }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { doContractCall, doOpenAuth } = useConnect();

  const address =
    (mounted && userSession.isUserSignedIn()) ??
    userSession.loadUserData()?.profile?.stxAddress;

  const [pendingMembers, setPendingMembers] = useState<{
    stackers: string[];
    amountsUstx: string[];
    totalRows: number[];
    blockHeights: number[];
  }>({
    stackers: [],
    amountsUstx: [],
    totalRows: [],
    blockHeights: [],
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
    (user, index) =>
      !hasMemberRevoked(user, pendingMembers.blockHeights[index], revokeTxs) &&
      !pendingOrExtendFailed(
        user,
        pendingMembers.blockHeights[index],
        delegateStackStxManyTxs
      )
  );

  console.log(delegateStackStxManyTxs);

  return (
    <Flex height="100%" justify="center" align="center">
      <InfoCard>
        <Box mx={["loose", "extra-loose"]}>
          <Flex flexDirection="column" pt="extra-loose" pb="base-loose">
            <Text textStyle="body.large">Pending Members cycle #{cycleId}</Text>
            <p>
              List of largest members who are not yet stacking for the next
              cycle,{" "}
              {pendingMembers.totalRows.length > 0 ? (
                <>
                  showing {pendingMembers.totalRows.length} out of{" "}
                  {pendingMembers.totalRows[0]}
                </>
              ) : (
                "up to 300"
              )}
              .
            </p>
            <p>
              The list is filtered by {revokeTxs.length} revoke transactions and{" "}
              by{" "}
              {
                delegateStackStxManyTxs.filter((t) => t.tx_status === "pending")
                  .length
              }{" "}
              pending delegate-stack-stx-many transactions out of{" "}
              {delegateStackStxManyTxs.length}.
            </p>
            {pendingMembers.totalRows.length > 0 && (
              <>
                <Box my="loose">
                  {filteredStackers.length > 0 ? (
                    <>
                      Self-service extend allows to extend up to 30 members per
                      tansactions.
                      <br />
                      Helpers can extend {filteredStackers.length} pending
                      members.
                    </>
                  ) : (
                    <b>
                      All pending members have been extended for cycle #
                      {cycleId}.
                    </b>
                  )}
                </Box>
              </>
            )}

            <InfoCardSection>
              {pendingMembers.stackers.map((member, index) => (
                <InfoCardRow key={index}>
                  {hasMemberRevoked(
                    member,
                    pendingMembers.blockHeights[index],
                    revokeTxs
                  ) ? (
                    <>
                      <InfoCardLabel>
                        <s>
                          <a href={`/u/${member}`}>{member}</a>
                        </s>
                      </InfoCardLabel>
                      <InfoCardValue>(revoked)</InfoCardValue>
                    </>
                  ) : pendingOrExtendFailed(
                      member,
                      pendingMembers.blockHeights[index],
                      delegateStackStxManyTxs
                    ) ? (
                    <>
                      <InfoCardLabel>
                        <s>
                          <a href={`/u/${member}`}>{member}</a>
                        </s>
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
                      <InfoCardLabel>
                        <a href={`/u/${member}`}>{member}</a>
                      </InfoCardLabel>
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
            {address ? (
              <Button onClick={() => delegateStackStxMany(0, 30)}>
                Self-service extend
              </Button>
            ) : (
              <Button onClick={() => doOpenAuth()}>Authenticate</Button>
            )}
          </Flex>
        </Box>
      </InfoCard>
    </Flex>
  );
}
