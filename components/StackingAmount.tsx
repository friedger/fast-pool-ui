import {
  IntCV,
  callReadOnlyFunction,
  principalCV,
  uintCV
} from "@stacks/transactions";
import { useEffect, useState } from "react";
import { fastPoolHelper, network } from "../lib/constants";
import { toHumanReadableStx } from "../lib/unit-converts";
import { InfoCardLabel, InfoCardRow, InfoCardValue } from "./InfoCard";

export function StackingAmount({
  cycleId,
  user,
}: {
  cycleId: number;
  user: string;
}) {
  const [stackingInfo, setStackingInfo] = useState<IntCV>();
  useEffect(() => {
    const fn = async () => {
      const response = (await callReadOnlyFunction({
        contractAddress: fastPoolHelper.address,
        contractName: fastPoolHelper.name,
        functionName: "amount-locked-at-cycle",
        functionArgs: [principalCV(user), uintCV(cycleId)],
        network,
        senderAddress: user,
      })) as IntCV;
      console.log(response);
      setStackingInfo(response);
    };
    fn();
  }, [user, cycleId]);
  if (!stackingInfo) return <>Loading...</>;
  return (
    <InfoCardRow>
      <InfoCardLabel>Stacking amount (cycle #{cycleId})</InfoCardLabel>
      <InfoCardValue>
        {toHumanReadableStx(stackingInfo.value)} STX
      </InfoCardValue>
    </InfoCardRow>
  );
}
