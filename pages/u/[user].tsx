import { InfoCard } from "../../components/InfoCard";
import { LastPox3Events } from "../../components/LastPox3Events";
import { StackingAmount } from "../../components/StackingAmount";
import { StackingStatus } from "../../components/StackingStatus";
import { NEXT_CYCLE } from "../../lib/constants";
import { truncateMiddle } from "../../lib/transactions";
import { validateStacksAddress } from "@stacks/transactions";
import { Box, Flex } from "@stacks/ui";
import { useRouter } from "next/router";

const User = () => {
  const router = useRouter();
  const { user } = router.query as { user: string };

  if (!user || !validateStacksAddress(user.split(".")[0])) {
    return <>Invalid STX address</>;
  }
  return (
    <Flex height="100%" justify="center" align="center">
      <InfoCard>
        <Box mx={["loose", "extra-loose"]}>
          <Flex flexDirection="column" pt="extra-loose" pb="base-loose">
            <h3>
              <a href={`https://explorer.hiro.so/address/${user}`}>
                {truncateMiddle(user)}
              </a>
            </h3>
            <StackingStatus user={user} />
            <StackingAmount cycleId={NEXT_CYCLE - 1} user={user} />
            <StackingAmount cycleId={NEXT_CYCLE - 2} user={user} />
            <StackingAmount cycleId={NEXT_CYCLE - 3} user={user} />
            <StackingAmount cycleId={NEXT_CYCLE - 4} user={user} />
            <LastPox3Events address={user} />
          </Flex>
        </Box>
      </InfoCard>
    </Flex>
  );
};

export default User;
