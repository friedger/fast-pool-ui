import { hexToBytes } from "@stacks/common";
import { StacksMainnet, StacksTestnet } from "@stacks/network";
import { bufferCV, tupleCV } from "@stacks/transactions";

export const fastPool = {
  stacks: "SP21YTSM60CAY6D011EZVEVNKXVW8FVZE198XEFFP.pox-fast-pool-v2",
  rewardPoxAddrCV: tupleCV({
    hashbytes: bufferCV(hexToBytes("828095be0dffcd9aaab31ae291748b820e4d1158")),
    version: bufferCV(hexToBytes("04")),
  }),
};

const mainnet = true;
export const poxContractAddress = mainnet
  ? "SP000000000000000000002Q6VF78"
  : "ST000000000000000000002AMW42H";

const STACKS_CORE_API_URL = mainnet
  ? "https://proportionate-holy-knowledge.stacks-mainnet.discover.quiknode.pro/057f49d7f2148311cb0b0f12dfc9a751c02dba05"
    //"https://api.mainnet.hiro.so"
  : //"https://stacks-node.planbetter.org"
    "https://2-1-api.testnet.hiro.so";

export const network = mainnet
  ? new StacksMainnet({ url: STACKS_CORE_API_URL })
  : new StacksTestnet({ url: STACKS_CORE_API_URL });
