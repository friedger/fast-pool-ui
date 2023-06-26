import { InfoCard } from "./InfoCard";
import { useConnect } from "@stacks/connect-react";
import { StacksMainnet } from "@stacks/network";
import {
  AnchorMode,
  PostConditionMode,
  listCV,
  principalCV,
} from "@stacks/transactions";
import { Box, Button, Stack } from "@stacks/ui";
import { useEffect, useState } from "react";

const users = [
  "SP123TY61PFFAEZBX3PNH7KG3663B3GBW440NMYX0",
  "SP159GT16T8S3NVMZX41MYD44SKSDDF4BE9QAEQ5B",
  "SP164JKTZVB9XY3MZPXS6T0S5JFNZ5ZSJ13RVP65F",
  "SP1DC2YSNAJQ4FXSSBXHDYZFB13TW8DGG3M0AG7AV",
  "SP1H3AM83FV5FRR0P3T3D2KFYVGW06MNS1A6HD6WP",
  "SP1Q1Y5SRJA68VK7BKQNRXCKB9HKF3ZM48352Q5F7",
  "SP2GAR9S7V6ZRWBKHXY982QR3W41YC0C58WBF2302",
  "SP2Q2JBWWKE54MHR9NEZ6JTRD0SVQHDWVW0DKR5J6",
  "SP2SMN0DMBVA6M994TV4QFTC9RX63TBKMQG60EQ1P",
  "SP2VXMT4DG9WTJS7VTJXD4CVPCN2NZHC9NN79JPWD",
  "SP2WAWERXQJ55QX223W34ZQVF11BMVMPZWMSDBCQX",
  "SP31AJM5WD8N9WB3HRCN5M2MA5QB14RF4ZYGEY9D7",
  "SP31MXBEVBEGXF4YMDH4JF93W5XQGJVQRJNR37B9",
  "SP36HQMKX6M0V06P156TXDBGMYHCD1PA1J8TEHQTT",
  "SP37SY5DRQ6Q8S92XCH1SN5Y3CP52MEAAHMJ1HMTR",
  "SP3J9SYH8VB290G82PV6J6MVZYBH1B55A72WRTKFW",
  "SP3JWSERFDACYF5S9MQVHGMQFP6BRT5JQTWS56JVP",
  "SP3KRY7RCJSY58086B6XAPCE75DFKH07GH6YT8DAN",
  "SP3NZ83MMAMHFQH2RRV5BGSVYYW522W5W9B0WBN5X",
  "SP3RNRM8NRJNGK666Z9PVCDGXT2N5BXD51D47TZ8D",
  "SP7HNDPT691GCH382RVZAC2A47RM8F75XAN7P335",
  "SP9JFCSFXFNBVE9HW4RSA9R0PPSCBJQNVPQ9A621",
  "SPGM4RBXP6GM6M2FDCPVZYCKPK1FXYH1767XR7FC",
  "SPH1769F2N6Z7B04A6C0J0675SB7MJ2C4R5QM01Q",
  "SPMJ6PTDSHM17HCDQBV7FYYMM98R1Y2ZQ7GRM06W",
  "SPQ2WS8G6FG5VJR52BKX0XFGNEVHJ81DA3YKEVR8",
];
const SetUsers = () => {
  const { userSession, doContractCall } = useConnect();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (
    !userSession ||
    userSession.loadUserData().profile.stx.mainnet !==
      "SP21YTSM60CAY6D011EZVEVNKXVW8FVZE198XEFFP"
  ) {
    return null;
  }

  function setUsers() {
    doContractCall({
      network: new StacksMainnet(),
      anchorMode: AnchorMode.Any,
      contractAddress: "SP21YTSM60CAY6D011EZVEVNKXVW8FVZE198XEFFP",
      contractName: "fp-auto-extend-2",
      functionName: "set-users",
      functionArgs: [listCV(users.map((user) => principalCV(user)))],
      postConditionMode: PostConditionMode.Deny,
      postConditions: [],
      onFinish: (data) => {
        console.log("onFinish:", data);
        window
          .open(`https://explorer.hiro.so/txid/${data.txId}`, "_blank")
          .focus();
      },
      onCancel: () => {
        console.log("onCancel:", "Transaction was canceled");
      },
    });
  }

  if (!mounted) {
    return null;
  }

  return (
    <InfoCard>
      <Box mx={["loose", "extra-loose"]}>
        <h3>Fast Pool Auto Extend</h3>
        {userSession.isUserSignedIn() && (
          <Button onClick={setUsers}>Set Users</Button>
        )}
      </Box>
    </InfoCard>
  );
};

export default SetUsers;
