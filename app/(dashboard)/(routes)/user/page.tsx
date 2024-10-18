import Box from "@/components/Box";
import CustomBreadCrump from "@/components/CustomBreadCrump";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import dynamic from "next/dynamic";
import { UsernameForm } from "./_components/Forms/usernameForm";
import { db } from "@/lib/db";

const ProfilePicture = dynamic(
  () => import("./_components/profilePicture").then((mod) => mod.default),
  { ssr: false }
);

export default async function User() {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await currentUser();

  let userProfile = await db.userProfile.findUnique({
    where: {
      userId,
    },
  });

  return (
    <div className="flex-col items-center justify-center flex p-4 md:p-8">
      <Box>
        <CustomBreadCrump breadCrumpPage="Account" />
      </Box>
      <Box className="flex flex-col p-4 rounded-md border mt-8 w-full space-y-6">
        {user && user.hasImage && (
          <div className="aspect-square w-24 h-24 rounded-full shadow-md relative">
            <ProfilePicture imageURL={user.imageUrl} />
          </div>
        )}

        <UsernameForm initialData={userProfile} userId={userId} />
      </Box>
    </div>
  );
}
