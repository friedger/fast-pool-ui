import { LastPox3EventResult, getLastPox3Events } from "../lib/pox3events";
import { truncateMiddle } from "../lib/transactions";
import { toHumanReadableStx } from "../lib/unit-converts";
import { Hr } from "./Hr";
import {
  InfoCard,
  InfoCardLabel,
  InfoCardRow,
  InfoCardSection,
  InfoCardValue,
} from "./InfoCard";
import { Box, Flex } from "@stacks/ui";
import { useEffect, useState } from "react";

function burnHeightToCycle(burnHeight: number) {
  if (burnHeight < 666050) return null;
  return <>{Math.floor((burnHeight - 666050) / 2100)}</>;
}

function Event({
  pox3Events,
  index,
}: {
  pox3Events: LastPox3EventResult;
  index: number;
}) {
  switch (pox3Events.name[index]) {
    case "delegate-stx":
      return (
        <>
          <InfoCardRow>
            <InfoCardLabel>Pooled Stacking</InfoCardLabel>
            <InfoCardValue>Delegated STX</InfoCardValue>
          </InfoCardRow>
          <InfoCardRow>
            <InfoCardLabel>Delegated</InfoCardLabel>
            <InfoCardValue>
              {toHumanReadableStx(pox3Events.amount_ustx[index])}
            </InfoCardValue>
          </InfoCardRow>
        </>
      );

    case "delegate-stack-stx":
      return (
        <>
          <InfoCardRow>
            <InfoCardLabel>Pooled Stacking</InfoCardLabel>
            <InfoCardValue>Locked STX</InfoCardValue>
          </InfoCardRow>
          <InfoCardRow>
            <InfoCardLabel>Unlock cycle</InfoCardLabel>
            <InfoCardValue>
              #{burnHeightToCycle(pox3Events.unlock_burn_height[index])}
            </InfoCardValue>
          </InfoCardRow>
          <InfoCardRow>
            <InfoCardLabel>Locked</InfoCardLabel>
            <InfoCardValue>
              {toHumanReadableStx(pox3Events.locked[index])}
            </InfoCardValue>
          </InfoCardRow>
        </>
      );
    case "delegate-stack-increase":
      return (
        <>
          <InfoCardRow>
            <InfoCardLabel>Pooled Stacking</InfoCardLabel>
            <InfoCardValue>Locked amount increased</InfoCardValue>
          </InfoCardRow>
          <InfoCardRow>
            <InfoCardLabel>Locked</InfoCardLabel>
            <InfoCardValue>
              {toHumanReadableStx(pox3Events.locked[index])}
            </InfoCardValue>
          </InfoCardRow>
        </>
      );
    case "delegate-stack-extend":
      return (
        <>
          <InfoCardRow>
            <InfoCardLabel>Pooled Stacking</InfoCardLabel>
            <InfoCardValue>Locking period extended</InfoCardValue>
          </InfoCardRow>
          <InfoCardRow>
            <InfoCardLabel>Unlock cycle</InfoCardLabel>
            <InfoCardValue>
              #{burnHeightToCycle(pox3Events.unlock_burn_height[index])}
            </InfoCardValue>
          </InfoCardRow>
          <InfoCardRow>
            <InfoCardLabel>Locked</InfoCardLabel>
            <InfoCardValue>
              {toHumanReadableStx(pox3Events.locked[index])}
            </InfoCardValue>
          </InfoCardRow>
        </>
      );
    default:
      return (
        <>
          <InfoCardRow>
            <InfoCardLabel>Event</InfoCardLabel>
            <InfoCardValue>{pox3Events.name[index]}</InfoCardValue>
          </InfoCardRow>
          <InfoCardRow>
            <InfoCardLabel>Unlock cycle</InfoCardLabel>
            <InfoCardValue>
              #{burnHeightToCycle(pox3Events.unlock_burn_height[index])}
            </InfoCardValue>
          </InfoCardRow>
          <InfoCardRow>
            <InfoCardLabel>Locked</InfoCardLabel>
            <InfoCardValue>
              {toHumanReadableStx(pox3Events.locked[index])}
            </InfoCardValue>
          </InfoCardRow>
        </>
      );
  }
}

export function LastPox3Events({ address }: { address: string }) {
  const [pox3Events, setPox3Events] = useState<LastPox3EventResult>({
    block_height: [],
    name: [],
    contract_call_contract_id: [],
    contract_call_function_name: [],
    burn_block_height: [],
    unlock_burn_height: [],
    locked: [],
    amount_ustx: [],
    block_time: [],
    txid: [],
  });

  useEffect(() => {
    getLastPox3Events(address).then((queryResult) => {
      setPox3Events(queryResult);
    });
  }, [address, setPox3Events]);

  return (
    <Flex height="100%" justify="center" align="center">
      <InfoCard>
        <Box mx={["loose", "extra-loose"]}>
          <Flex flexDirection="column" pt="extra-loose" pb="base-loose">
            <h3>{truncateMiddle(address)}</h3>
            {pox3Events.block_height.map((blockHeight, index) => (
              <>
                <InfoCardSection m="loose" key={index}>
                  {index === 0 ||
                  pox3Events.txid[index - 1] !== pox3Events.txid[index] ? (
                    <>
                      <InfoCardRow>
                        Block height {blockHeight} (cycle #
                        {burnHeightToCycle(pox3Events.burn_block_height[index])}
                        )
                      </InfoCardRow>
                      <InfoCardRow>
                        <a
                          href={`https://explorer.hiro.so/txid/0x${pox3Events.txid[index]}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {truncateMiddle(
                            pox3Events.contract_call_contract_id[index]
                          )}
                          .{pox3Events.contract_call_function_name[index]}
                        </a>
                      </InfoCardRow>
                    </>
                  ) : null}
                  <Event pox3Events={pox3Events} index={index} />
                </InfoCardSection>
                <Hr />
              </>
            ))}
          </Flex>
        </Box>
      </InfoCard>
    </Flex>
  );
}
