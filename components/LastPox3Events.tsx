import { LastPox3EventResult, getLastPox3Events } from "../lib/pox3events";
import { toHumanReadableStx } from "../lib/unit-converts";
import { InfoCard, InfoCardRow, InfoCardSection } from "./InfoCard";
import { Box } from "@stacks/ui";
import { useEffect, useState } from "react";

function burnHeightToCycle(burnHeight: number) {
  if (burnHeight < 666050) return null;
  return <>{Math.floor((burnHeight - 666050) / 2100)}</>;
}

export function LastPox3Events({ address }: { address: string }) {
  const [pox3Events, setPox3Events] = useState<LastPox3EventResult>({
    block_height: [],
    name: [],
    contract_call_contract_id: [],
    contract_call_function_name: [],
    burn_block_height: [],
    unlock_burn_height: [],
    locked: [],
  });

  useEffect(() => {
    getLastPox3Events(address).then((queryResult) => {
      setPox3Events(queryResult);
    });
  }, [address, setPox3Events]);

  return (
    <InfoCard>
      <Box mx={["loose", "extra-loose"]}>
        <h3>{address}</h3>
        {pox3Events.block_height.map((blockHeight, index) => (
          <InfoCardSection m="loose" key={index}>
            <InfoCardRow>
              {blockHeight} (cycle #
              {burnHeightToCycle(pox3Events.burn_block_height[index])})
            </InfoCardRow>
            <InfoCardRow>
              {pox3Events.contract_call_contract_id[index]}.
              {pox3Events.contract_call_function_name[index]}
            </InfoCardRow>
            <InfoCardRow>event: {pox3Events.name[index]}</InfoCardRow>
            <InfoCardRow>
              unlock cycle:
              {burnHeightToCycle(pox3Events.unlock_burn_height[index])}
            </InfoCardRow>
            <InfoCardRow>
              locked:
              {toHumanReadableStx(pox3Events.locked[index])}
            </InfoCardRow>
          </InfoCardSection>
        ))}
      </Box>
    </InfoCard>
  );
}
