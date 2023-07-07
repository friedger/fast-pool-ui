import { toHumanReadableStx } from "../../lib/unit-converts";
import { Hr } from "../Hr";
import {
  InfoCardLabel,
  InfoCardRow,
  InfoCardSection,
  InfoCardValue,
} from "../InfoCard";
import { PoolStatus, getPoolInfo } from "./get-pool-info";
import { ClarityType } from "@stacks/transactions";
import { Box, Stack, Text } from "@stacks/ui";
import { useEffect, useState } from "react";

export function Status({ cycleId }: { cycleId: number }) {
  const [poolStatus, setPoolStatus] = useState<PoolStatus>();

  useEffect(() => {
    if (poolStatus !== undefined) return;
    getPoolInfo(cycleId).then((info) => setPoolStatus(info));
  }, [cycleId, poolStatus]);

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
            &nbsp;
            {poolStatus.lockedAmount
              ? toHumanReadableStx(poolStatus.lockedAmount.value)
              : "none"}
          </InfoCardValue>
        </InfoCardRow>
      </InfoCardSection>
    </Box>
  );
}
