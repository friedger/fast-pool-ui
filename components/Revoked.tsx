import { getPox3RevokeTx } from "../lib/pox3txs";
import { useEffect, useState } from "react";

export function Revoked() {
  const [txs, setTxs] = useState([]);

  useEffect(() => {
    getPox3RevokeTx().then((revokeTxs) => setTxs(revokeTxs));
  }, [setTxs]);

  return (
    <div>
      <h1>Revoked</h1>
      {txs.map((tx, index) => (
        <p key={index}>
          {tx.sender_address} {tx.block_height}
        </p>
      ))}
    </div>
  );
}
