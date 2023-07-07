import { Hr } from "../components/Hr";
import { InfoCard } from "../components/InfoCard";
import { Status } from "../components/status/Status";
import { Box, Flex } from "@stacks/ui";
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
                <h1>Fast Pool Community</h1>
                <Status cycleId={63} />
                <Hr />
                <Status cycleId={62} />
                <Hr />
                <Status cycleId={61} />
                <Hr />
                <Status cycleId={60} />
              </Flex>
            </Box>
          </InfoCard>
        </Flex>
      </main>
    </div>
  );
}
