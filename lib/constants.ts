import {
  AccountsApi,
  Configuration,
  TransactionsApi,
} from "@stacks/blockchain-api-client";
import { hexToBytes } from "@stacks/common";
import { StacksMainnet, StacksTestnet } from "@stacks/network";
import { bufferCV, tupleCV } from "@stacks/transactions";

export const NEXT_CYCLE = 72;

export const fastPool = {
  stacks: "SP21YTSM60CAY6D011EZVEVNKXVW8FVZE198XEFFP.pox-fast-pool-v2",
  // bc1qs0kkdpsrzh3ngqgth7mkavlwlzr7lms2zv3wxe
  rewardPoxAddrCV: tupleCV({
    hashbytes: bufferCV(hexToBytes("83ed66860315e334010bbfb76eb3eef887efee0a")),
    version: bufferCV(hexToBytes("04")),
  }),
};

export const fastPoolPayout = {
  stacks: "SP21YTSM60CAY6D011EZVEVNKXVW8FVZE198XEFFP.fp-payout-v1",
}

// console.log(poxAddressToBtcAddress(fastPool.rewardPoxAddrCV, "mainnet"));
// => bc1qs0kkdpsrzh3ngqgth7mkavlwlzr7lms2zv3wxe

const mainnet = true;
export const poxContractAddress = mainnet
  ? "SP000000000000000000002Q6VF78"
  : "ST000000000000000000002AMW42H";

export const fastPoolHelper = {
  address: "SPN4Y5QPGQA8882ZXW90ADC2DHYXMSTN8VAR8C3X",
  name: "fp-stx-account-helper",
};

const STACKS_CORE_API_URL = mainnet
  ? "https://wiser-lively-patina.stacks-mainnet.quiknode.pro/2034a802da68010bc5f1aa482cd2131e3d14d4cf"
  : //"https://api.mainnet.hiro.so"
    //"https://stacks-node.planbetter.org"
    "https://2-1-api.testnet.hiro.so";

export const network = mainnet
  ? new StacksMainnet({ url: STACKS_CORE_API_URL })
  : new StacksTestnet({ url: STACKS_CORE_API_URL });

const config = new Configuration({
  basePath: STACKS_CORE_API_URL,
  fetchApi: fetch,
});

export const accountsApi = new AccountsApi(config);
export const transactionsApi = new TransactionsApi(config);
