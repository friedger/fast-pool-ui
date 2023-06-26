import { cvToString } from "@stacks/transactions";
import { Box, Flex, Text } from "@stacks/ui";
import { useEffect, useState } from "react";
import { toHumanReadableStx } from "../../lib/unit-converts";
import {
  InfoCard,
  InfoCardLabel,
  InfoCardRow,
  InfoCardSection,
  InfoCardValue,
} from "../InfoCard";
import { PoolStatus, getPoolInfo } from "./get-pool-info";

export function Status({ cycleId }: { cycleId: number }) {
  const [poolStatus, setPoolStatus] = useState<PoolStatus>();

  useEffect(() => {
    getPoolInfo(cycleId).then((info) => setPoolStatus(info));
  }, [cycleId]);

  if (!poolStatus) return <>Loading..</>;

  return (
    <InfoCard>
      <Box mx={["loose", "extra-loose"]}>
        <Flex flexDirection="column" pt="extra-loose" pb="base-loose">
          <Text textStyle="body.large.medium">Reward Set for</Text>
          <Text
            fontSize="24px"
            fontFamily="Open Sauce"
            fontWeight={500}
            letterSpacing="-0.02em"
            mt="extra-tight"
            pb="base-loose"
          >
            Cycle {cycleId}
          </Text>
        </Flex>
        <InfoCardSection>
          <InfoCardRow>
            <InfoCardLabel>Last Commit</InfoCardLabel>
            <InfoCardValue>
              {cvToString(poolStatus.lastAggregationCommit)}
            </InfoCardValue>
          </InfoCardRow>
        </InfoCardSection>
        <InfoCardSection>
          <InfoCardRow>
            <InfoCardLabel>PoxRowId</InfoCardLabel>
            <InfoCardValue>
              {poolStatus.poxAddrIndex
                ? cvToString(poolStatus.poxAddrIndex)
                : "none"}
            </InfoCardValue>
          </InfoCardRow>
          <InfoCardRow>
            <InfoCardLabel>Locked STX</InfoCardLabel>
            <InfoCardValue>
              {poolStatus.lockedAmount
                ? toHumanReadableStx(poolStatus.lockedAmount.value)
                : "none"}
            </InfoCardValue>
          </InfoCardRow>
        </InfoCardSection>
      </Box>
    </InfoCard>
  );
}
