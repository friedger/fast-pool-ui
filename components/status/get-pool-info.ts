import { fastPool, network, poxContractAddress } from "../../lib/constants";
import {
  ClarityType,
  OptionalCV,
  SomeCV,
  TupleCV,
  UIntCV,
  callReadOnlyFunction,
  uintCV,
} from "@stacks/transactions";

export interface PoolStatus {
  poxAddrIndex?: SomeCV<UIntCV>;
  lastAggregationCommit: OptionalCV<UIntCV>;
  lockedAmount?: UIntCV;
  lockedAmountFromFP?: UIntCV;
}

export async function getPoolInfo(cycleId: number): Promise<PoolStatus> {
  const [contractAddress, contractName] = fastPool.stacks.split(".");
  let lastAggregationCommit = (await callReadOnlyFunction({
    contractAddress,
    contractName,
    functionName: "get-last-aggregation",
    functionArgs: [uintCV(cycleId)],
    network,
    senderAddress: contractAddress,
  })) as SomeCV<UIntCV>;

  let blockHeightToCheck = lastAggregationCommit.value.value;
  let rewardSet = (await callReadOnlyFunction({
    contractAddress,
    contractName,
    functionName: "get-reward-set-at-block",
    functionArgs: [uintCV(cycleId), uintCV(blockHeightToCheck)],
    network,
    senderAddress: contractAddress,
  })) as OptionalCV<TupleCV>;

  if (rewardSet.type === ClarityType.OptionalNone) {
    blockHeightToCheck = blockHeightToCheck - BigInt(1);
    rewardSet = (await callReadOnlyFunction({
      contractAddress,
      contractName,
      functionName: "get-reward-set-at-block",
      functionArgs: [uintCV(cycleId), uintCV(blockHeightToCheck)],
      network,
      senderAddress: contractAddress,
    })) as OptionalCV<TupleCV>;
  }
  if (rewardSet.type === ClarityType.OptionalSome) {
    console.log("total-ustx from reward-set-at-block", blockHeightToCheck);
    console.log(
      cycleId,
      Number(
        (rewardSet.value.data["total-ustx"] as UIntCV).value.valueOf()
      ).toLocaleString()
    );

    const poxAddrIndex = (await callReadOnlyFunction({
      contractAddress,
      contractName,
      functionName: "get-pox-addr-index",
      functionArgs: [uintCV(cycleId)],
      network,
      senderAddress: contractAddress,
    })) as SomeCV<UIntCV>;

    const rewardSetFromPox3 = (await callReadOnlyFunction({
      contractAddress: poxContractAddress,
      contractName: "pox-3",
      functionName: "get-reward-set-pox-address",
      functionArgs: [uintCV(cycleId), poxAddrIndex.value],
      network,
      senderAddress: contractAddress,
    })) as SomeCV<TupleCV>;
    return {
      poxAddrIndex,
      lastAggregationCommit,
      lockedAmount: rewardSetFromPox3.value.data["total-ustx"] as UIntCV,
      lockedAmountFromFP: rewardSet.value.data["total-ustx"] as UIntCV,
    };
  } else {
    return {
      lastAggregationCommit,
    };
  }
}
