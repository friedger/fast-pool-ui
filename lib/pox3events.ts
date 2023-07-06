import { int } from "@stacks/transactions/dist/cl";
import axios from "axios";

const BASE_URL = "https://api.stacksdata.info/v1/sql";

export const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const getPendingMembersQuery = (cycleId: number) => `
with
ordered_pox3_events as (
select
	stacker,
	pox_addr,
	amount_ustx,
	lock_amount,
	unlock_burn_height::integer,
	tx_id,
	block_height,
	microblock_sequence,
	tx_index,
	event_index,
	delegate_to,
	name
from
	pox3_events
where
	canonical = true
	and microblock_canonical = true
	and name = 'delegate-stx'
order by
	stacker,
	block_height desc,
	microblock_sequence desc,
	tx_index desc,
	event_index desc
        ),
distinct_rows as (
select
	distinct on
	  (stacker)
    stacker,
	pox_addr,
	amount_ustx,
	lock_amount,
	unlock_burn_height,
	tx_id,
	block_height,
	microblock_sequence,
	tx_index,
	event_index,
	delegate_to,
	name
from
	ordered_pox3_events
order by
	stacker,
	block_height desc,
	microblock_sequence desc,
	tx_index desc,
	event_index desc
),
ordered_stacked_pox3_events as (
select
	stacker,
	pox_addr,
	amount_ustx,
	lock_amount,
	unlock_burn_height::integer,
	tx_id,
	block_height,
	microblock_sequence,
	tx_index,
	event_index,
	delegate_to,
	name
from
	pox3_events
where
	canonical = true
	and microblock_canonical = true
	and name != 'delegate-stack-increase'
	and name != 'delegate-stx'
order by
	stacker,
	block_height desc,
	microblock_sequence desc,
	tx_index desc,
	event_index desc
),
distinct_stacked_rows as (
select
	distinct on
	  (stacker)
    stacker,
	pox_addr,
	amount_ustx,
	lock_amount,
	unlock_burn_height,
	tx_id,
	block_height,
	microblock_sequence,
	tx_index,
	event_index,
	delegate_to,
	name
from
	ordered_stacked_pox3_events
order by
	stacker,
	block_height desc,
	microblock_sequence desc,
	tx_index desc,
	event_index desc
)
select
	distinct_rows.stacker,
	distinct_rows.pox_addr,
	distinct_rows.amount_ustx,
	distinct_rows.unlock_burn_height,
	distinct_rows.block_height::integer,
	encode(distinct_rows.tx_id,'hex'),
	distinct_rows.name,
	distinct_stacked_rows.name as stacked_name,
	distinct_stacked_rows.unlock_burn_height as stacked_unlock_burn_height,
	distinct_stacked_rows.pox_addr as stacked_pool_addr,
	COUNT(*) over()::integer as total_rows
from
	distinct_rows left outer join distinct_stacked_rows on distinct_rows.stacker = distinct_stacked_rows.stacker
where
	(distinct_rows.name = 'delegate-stx'
		and distinct_rows.delegate_to = 'SP21YTSM60CAY6D011EZVEVNKXVW8FVZE198XEFFP.pox-fast-pool-v2'
		and (distinct_stacked_rows.unlock_burn_height  is null or
      distinct_stacked_rows.unlock_burn_height <= ${cycleId * 2100 + 666050}))
order by
	distinct_rows.amount_ustx desc,
	distinct_rows.block_height desc,
	distinct_rows.microblock_sequence desc,
	distinct_rows.tx_index desc,
	distinct_rows.event_index desc
  limit 30
`;

export const getPendingMembers = async (cycleId: number): Promise<string[]> => {
  const result = await axios.post(BASE_URL, getPendingMembersQuery(cycleId));
  return result.data.columns.stacker;
};

const getLastPox3EventsQuery = (address: string) => `
select
	pox3_events.name,
	pox3_events.stacker,
	pox3_events.pox_addr,
	pox3_events.amount_ustx,
	pox3_events.lock_amount,
  pox3_events.locked,
	pox3_events.unlock_burn_height::integer,
	encode(pox3_events.tx_id, 'hex') as txid,
	pox3_events.block_height,
	pox3_events.microblock_sequence,
	pox3_events.tx_index,
	pox3_events.event_index,
	pox3_events.delegate_to,
	transactions.contract_call_contract_id,
	transactions.contract_call_function_name,
  blocks.burn_block_height,
  blocks.block_time,
  transactions.tx_id
from
  pox3_events join transactions on pox3_events.tx_id = transactions.tx_id join blocks on blocks.block_height = transactions.block_height
where
	pox3_events.canonical = true
	and pox3_events.microblock_canonical = true
	and transactions.canonical = true
	and transactions.microblock_canonical = true
    and pox3_events.stacker = '${address}'
order by
	pox3_events.block_height desc,
	pox3_events.microblock_sequence desc,
	pox3_events.tx_index desc,
	pox3_events.event_index desc
limit 30
`;

export interface LastPox3EventResult {
  block_height: number[];
  name: string[];
  contract_call_contract_id: string[];
  contract_call_function_name: string[];
  burn_block_height: number[];
  unlock_burn_height: number[];
  locked: number[];
  amount_ustx: number[];
  block_time: string[];
  txid: string[];
}

export const getLastPox3Events = async (address: string) => {
  const result = await axios.post(BASE_URL, getLastPox3EventsQuery(address));
  console.log(result.data.columns);
  return result.data.columns as LastPox3EventResult;
};

const getStackedAmountsQuery = (cycleId: number) => `
  select
	stacker,
	name,
	(b.burn_block_height - 666050)/ 2100 as cycle_id,
	locked,
	start_burn_height,
	burnchain_unlock_height,
	lock_amount,
	increase_by,
  encode(tx_id, 'hex') as tx_id,
  to_char(to_timestamp(b.burn_block_time::bigint), 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as timestamp
from
	pox3_events pe
join blocks b on
	b.block_height = pe.block_height
where
	name in ('delegate-stack-stx', 'delegate-stack-extend', 'delegate-stack-increase')
	and pox_addr = 'bc1qs0kkdpsrzh3ngqgth7mkavlwlzr7lms2zv3wxe'
	and (b.burn_block_height - 666050)/2100 < ${cycleId}
  and burnchain_unlock_height > ${cycleId * 2100 + 666050}
order by
	stacker,
	b.block_height asc,
	microblock_sequence asc,
	tx_index asc,
	event_index asc
`;

export interface PoolMember {
  cycleId: number;
  stackedAmount: bigint;
  unlockHeight: number;
  timestamp: string;
  txid: string;
}

export async function getStackedAmounts(cycleId: number) {
  const result = await axios.post(BASE_URL, getStackedAmountsQuery(cycleId));
  console.log(result.data.columns);

  const stackers: {
    [key: string]: PoolMember;
  } = {};
  const mergeDetails = (
    columns: any,
    index: number,
    details?: { cycleId: number; stackedAmount: bigint }
  ) => {
    switch (columns.name[index]) {
      case "delegate-stack-stx":
        return {
          cycleId: columns.cycle_id[index] + 1,
          stackedAmount: BigInt(columns.lock_amount[index]),
        };
      case "delegate-stack-extend":
        return {
          cycleId:
            (details?.cycleId
              ? details?.cycleId
              : columns.cycle_id[index] + 1) + 1,
          stackedAmount: details?.stackedAmount
            ? details.stackedAmount
            : BigInt(columns.locked[index]),
        };
      case "delegate-stack-increase":
        return {
          cycleId: details?.cycleId
            ? details.cycleId
            : columns.cycle_id[index] + 1,
          stackedAmount: BigInt(columns.locked[index]),
        };
      default:
        throw new Error(`Unknown method ${columns.name[index]}`);
    }
  };
  for (let index = 0; index < result.data.columns.stacker.length; index++) {
    const stacker = result.data.columns.stacker[index];
    const existingDetails = stackers[stacker];
    stackers[stacker] = {
      ...mergeDetails(result.data.columns, index, existingDetails),
      txid: `0x${result.data.columns.tx_id[index]}`,
      timestamp: result.data.columns.timestamp[index],
      unlockHeight: parseInt(
        result.data.columns.burnchain_unlock_height[index]
      ),
    };
  }
  return stackers;
}
