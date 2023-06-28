import { PoolMember, getStackedAmounts } from "../lib/pox3events";
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
import { Box, Flex, Text } from "@stacks/ui";
import { Fragment, useEffect, useState } from "react";

export function PoolMembers({ cycleId }: { cycleId: number }) {
  const [poolMembers, setPoolMembers] = useState<{
    [key: string]: PoolMember;
  }>({});
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState<bigint | undefined>();

  useEffect(() => {
    setLoading(true);
    getStackedAmounts(cycleId).then((queryResult) => {
      let sum = BigInt(0);
      for (let member of Object.keys(queryResult)) {
        sum = sum + queryResult[member].stackedAmount;
      }
      setPoolMembers(queryResult);
      setTotal(sum);
      setLoading(false);
    });
  }, [cycleId, setLoading, setPoolMembers]);

  const poolAddresses = Object.keys(poolMembers);

  return (
    <Flex height="100%" justify="center" align="center">
      <InfoCard>
        <Box mx={["loose", "extra-loose"]}>
          <Flex flexDirection="column" pt="extra-loose" pb="base-loose">
            <Text textStyle="display.large">
              Pool Members for cycle #{cycleId}
            </Text>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <>
                <Text textStyle="body.large.medium">
                  {toHumanReadableStx(total, 0)} locked by{" "}
                  {poolAddresses.length} pool members.
                </Text>
                <Hr my="loose" />
                {poolAddresses.map((addr) => (
                  <Fragment key={addr}>
                    <InfoCardSection>
                      <InfoCardRow>
                        <InfoCardLabel>{addr}</InfoCardLabel>
                      </InfoCardRow>
                      <InfoCardRow>
                        <InfoCardLabel>Stacked amount</InfoCardLabel>
                        <InfoCardValue>
                          {toHumanReadableStx(
                            poolMembers[addr].stackedAmount,
                            0
                          )}
                        </InfoCardValue>
                      </InfoCardRow>
                      <InfoCardRow>
                        <InfoCardLabel>Tx</InfoCardLabel>
                        <InfoCardValue>
                          <a
                            href={`https://explorer.hiro.so/txid/${poolMembers[addr].txid}`}
                          >
                            {truncateMiddle(poolMembers[addr].txid)}
                          </a>
                        </InfoCardValue>
                      </InfoCardRow>
                    </InfoCardSection>
                    <Hr my="loose" />
                  </Fragment>
                ))}
              </>
            )}
          </Flex>
        </Box>
      </InfoCard>
    </Flex>
  );
}
