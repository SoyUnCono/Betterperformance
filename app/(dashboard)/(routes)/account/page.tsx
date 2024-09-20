import { currentUser } from "@clerk/nextjs/server";

export default async function Account() {
  const UserData = await currentUser();

  return <div>{UserData?.username}</div>;
}
