import { PoolMembers } from "../../components/PoolMembers";
import { useRouter } from "next/router";

const User = () => {
  const router = useRouter();
  const { cycleid } = router.query as { cycleid: string };

  if (!cycleid || isNaN(parseInt(cycleid))) {
    return <>Invalid Cycle Id</>;
  }
  return <PoolMembers cycleId={parseInt(cycleid)} />;
};

export default User;
