import { toHumanReadableStx } from "../../lib/unit-converts";
import {
  InfoCard,
  InfoCardLabel,
  InfoCardRow,
  InfoCardSection,
  InfoCardValue,
} from "../InfoCard";
import { PoolStatus, getPoolInfo } from "./get-pool-info";
import { ClarityType, cvToString } from "@stacks/transactions";
import { Box, Flex, Stack, Text } from "@stacks/ui";
import { useEffect, useState } from "react";

export function Status({ cycleId }: { cycleId: number }) {
  const [poolStatus, setPoolStatus] = useState<PoolStatus>();

  useEffect(() => {
    getPoolInfo(cycleId).then((info) => setPoolStatus(info));
  }, [cycleId]);

  if (!poolStatus) return <>Loading..</>;

  return (
    <Box m="loose">
      <Stack>
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
      </Stack>
      <InfoCardSection>
        <InfoCardRow>
          <InfoCardLabel>Last Commit</InfoCardLabel>
          <InfoCardValue>
            {poolStatus.lastAggregationCommit.type === ClarityType.OptionalSome
              ? poolStatus.lastAggregationCommit.value.value.toString()
              : null}
          </InfoCardValue>
        </InfoCardRow>
      </InfoCardSection>
      <InfoCardSection>
        <InfoCardRow>
          <InfoCardLabel>PoxRowId</InfoCardLabel>
          <InfoCardValue>
            {poolStatus.poxAddrIndex
              ? poolStatus.poxAddrIndex.value.value.toString()
              : "none"}
          </InfoCardValue>
        </InfoCardRow>
        <InfoCardRow>
          <InfoCardLabel>Locked</InfoCardLabel>
          <InfoCardValue>
            {poolStatus.lockedAmount
              ? toHumanReadableStx(poolStatus.lockedAmount.value)
              : "none"}
          </InfoCardValue>
        </InfoCardRow>
      </InfoCardSection>
    </Box>
  );
}
