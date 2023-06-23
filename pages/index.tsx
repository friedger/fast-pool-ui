import ConnectWallet from "../components/ConnectWallet";
import { Navbar } from "../components/Navbar";
import SetUsers from "../components/SetUsers";
import { Flex, Stack } from "@stacks/ui";
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
        <Flex h="100vh" flexDirection="column">
          <Stack height="100%" justifyContent="center">
            <h1>Fast Pool Community</h1>

            <Stack>
              <ConnectWallet />
              <SetUsers />
            </Stack>
          </Stack>
        </Flex>
      </main>
    </div>
  );
}
