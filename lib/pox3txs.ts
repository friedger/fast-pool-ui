import { accountsApi } from "./constants";

export async function getPox3RevokeTx() {
  const response = await accountsApi.getAccountTransactions({
    principal: "SP000000000000000000002Q6VF78.pox-3",
    offset: 0,
    limit: 50,
  });
  const revokeTxs = response.results.filter((newTx: any) => {
    console.log(newTx.tx_type, newTx);
    return (
      newTx.tx_type === "contract_call" &&
      newTx.contract_call.function_name === "revoke-delegate-stx"
    );
  });
  return revokeTxs;
}
