import { validateStacksAddress } from "@stacks/transactions";
import { useRouter } from "next/router";
import { LastPox3Events } from "../../components/LastPox3Events";

const User = () => {
  const router = useRouter();
  const { user } = router.query as { user: string };

  if (!user || !validateStacksAddress(user.split(".")[0])) {
    return <>Invalid STX address</>;
  }
  return <LastPox3Events address={user}/>;
};

export default User;
