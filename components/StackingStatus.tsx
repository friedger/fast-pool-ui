import { network } from "../lib/constants";
import { truncateMiddle } from "../lib/transactions";
import { toHumanReadableStx } from "../lib/unit-converts";
import {
  InfoCard,
  InfoCardLabel,
  InfoCardRow,
  InfoCardSection,
  InfoCardValue,
} from "./InfoCard";
import { intToBigInt } from "@stacks/common";
import {
  AccountExtendedBalances,
  DelegationInfo,
  StackerInfo,
  StackingClient,
} from "@stacks/stacking";
import { useEffect, useState } from "react";

export function StackingStatus({ user }: { user: string }) {
  const [status, setStatus] = useState<StackerInfo>();
  const [delegationStatus, setDelegationStatus] = useState<DelegationInfo>();
  const [accountBalance, setAccountBalance] =
    useState<AccountExtendedBalances>();
  useEffect(() => {
    const stackingClient = new StackingClient(user, network);
    stackingClient.getStatus().then((s) => setStatus(s));
    stackingClient.getDelegationStatus().then((d) => setDelegationStatus(d));
    stackingClient
      .getAccountExtendedBalances()
      .then((a) => setAccountBalance(a));
  }, [user]);

  return (
    <InfoCard>
      <InfoCardRow>
        <InfoCardLabel>Stacked</InfoCardLabel>
        <InfoCardValue>
          {status?.stacked && accountBalance?.stx.locked
            ? toHumanReadableStx(intToBigInt(accountBalance.stx.locked, false))
            : "Not stacking"}
        </InfoCardValue>
      </InfoCardRow>
      <InfoCardRow>
        <InfoCardLabel>Pool</InfoCardLabel>
        <InfoCardValue>
          {delegationStatus?.delegated && accountBalance?.stx?.locked
            ? truncateMiddle(delegationStatus.details.delegated_to)
            : "Not part of a pool"}
        </InfoCardValue>
      </InfoCardRow>
      <InfoCardRow>
        <InfoCardLabel>Delegated Amount</InfoCardLabel>
        <InfoCardValue>
          {delegationStatus?.delegated && accountBalance?.stx?.locked
            ? toHumanReadableStx(delegationStatus.details.amount_micro_stx)
            : "Not applicable"}
        </InfoCardValue>
      </InfoCardRow>
    </InfoCard>
  );
}
