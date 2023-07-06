import { getDelegateStackStxManyTxs } from "../lib/fpTxs";
import { toHumanReadableStx } from "../lib/unit-converts";
import {
  ClarityType,
  PrincipalCV,
  ResponseCV,
  TupleCV,
  UIntCV,
  cvToString,
  hexToCV,
} from "@stacks/transactions";
import { Box, Text } from "@stacks/ui";
import { useEffect, useState } from "react";

function errValueToString(value: UIntCV) {
  if (value.value === BigInt(9000)) {
    return "Revoked";
  } else {
    return `Error ${cvToString(value)}`;
  }
}

function okValueToString(value: TupleCV) {
  return `${toHumanReadableStx(
    (value.data["lock-amount"] as UIntCV).value
  )} locked until ${(
    value.data["unlock-burn-height"] as UIntCV
  ).value.toString()}`;
}

function Result({ tx }) {
  const results = (hexToCV(tx.tx_result.hex) as any).value.data[
    "locking-result"
  ].list.map((r: ResponseCV) =>
    r.type === ClarityType.ResponseOk
      ? okValueToString(r.value as TupleCV)
      : errValueToString(r.value as UIntCV)
  );
  const stackers = (
    hexToCV(tx.contract_call.function_args[0].hex) as any
  ).list.map((arg: PrincipalCV) => cvToString(arg));
  console.log({ results, stackers });

  return (
    <>
      {stackers.map((s, index) => (
        <Text key={index} textStyle={"body.small"}>
          {s}: {results[index]}
        </Text>
      ))}
    </>
  );
}

export function ExtendedMany() {
  const [txs, setTxs] = useState([]);

  useEffect(() => {
    getDelegateStackStxManyTxs().then((transactions) => setTxs(transactions));
  }, [setTxs]);

  return (
    <Box p="loose">
      <Text textStyle={"body.large"}>Delegated Stack Stx Many</Text>
      {txs.map((tx, index) => (
        <Box p="loose" key={index}>
          <Text textStyle={"body.large.medium"}>
            {tx.sender_address} {tx.block_height}
          </Text>
          <Result tx={tx} />
        </Box>
      ))}
    </Box>
  );
}
