import { accountsApi, fastPool, transactionsApi } from "./constants";

export async function getDelegateStackStxManyTxs() {
  const response1 = await accountsApi.getAccountTransactions({
    principal: fastPool.stacks,
    offset: 0,
    limit: 50,
    unanchored: true,
  });
  const response2 = await accountsApi.getAccountTransactions({
    principal: fastPool.stacks,
    offset: 50,
    limit: 50,
    unanchored: true,
  });


  const pendingTxs = await transactionsApi.getMempoolTransactionList({
    address: fastPool.stacks,
    limit: 50,
    offset: 0,
  });

  const delegateStackStxMany = pendingTxs.results.concat(response1.results).concat(response2.results).filter((newTx: any) => {
    return (
      newTx.tx_type === "contract_call" &&
      newTx.contract_call.contract_id === fastPool.stacks &&
      newTx.contract_call.function_name === "delegate-stack-stx-many" &&
      (newTx.tx_status === "success" || newTx.tx_status === "pending")
    );
  });

  console.log(delegateStackStxMany.length, response1.results.length, response2.results.length);
  return delegateStackStxMany as any[];
}
