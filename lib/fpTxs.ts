import { accountsApi, fastPool } from "./constants";

export async function getDelegateStackStxManyTxs() {
  const response = await accountsApi.getAccountTransactions({
    principal: fastPool.stacks,
    offset: 0,
    limit: 50,
  });
  const delegateStackStxMany = response.results.filter((newTx: any) => {
    return (
      newTx.tx_type === "contract_call" &&
      newTx.contract_call.function_name === "delegate-stack-stx-many"
    );
  });
  console.log(delegateStackStxMany.length, response.results.length);
  return delegateStackStxMany;
}
