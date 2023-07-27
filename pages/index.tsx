import { Hr } from "../components/Hr";
import { InfoCard } from "../components/InfoCard";
import { Status } from "../components/status/Status";
import { NEXT_CYCLE } from "../lib/constants";
import { Box, Flex, Text } from "@stacks/ui";
import Head from "next/head";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Fast Pool Community</title>
        <meta name="description" content="Community page for FAST Pool (v2)" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Flex height="100%" justify="center" align="center">
          <InfoCard>
            <Box mx={["loose", "extra-loose"]}>
              <Flex flexDirection="column" pt="extra-loose" pb="base-loose">
                <Status cycleId={NEXT_CYCLE - 1} />
                <Hr />
                <Status cycleId={NEXT_CYCLE - 2} />
                <Hr />
                <Status cycleId={NEXT_CYCLE - 3} />
                <Hr />
                <Status cycleId={NEXT_CYCLE - 4} />
              </Flex>
            </Box>
          </InfoCard>
        </Flex>
      </main>
    </div>
  );
}
