import Box from "@/components/Box";
import CustomBreadCrump from "@/components/CustomBreadCrump";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import dynamic from "next/dynamic";
import { UsernameForm } from "./_components/Forms/usernameForm";
import { db } from "@/lib/db";
import { EmailForm } from "./_components/Forms/emailForm";
import { LogoutButton } from "@/components/LogoutButton";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Settings,
  Bell,
  Key,
  Palette,
  UserCircle,
  Crown,
  LogOut
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";

const ProfilePicture = dynamic(
  () => import("./_components/profilePicture").then((mod) => mod.default),
  { ssr: false }
);

export default async function UserProfile() {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await currentUser();
  const isAdmin = user?.publicMetadata?.role === "admin";

  console.log("User metadata:", user?.publicMetadata);
  console.log("Is admin?", isAdmin);

  let userProfile = await db.userProfile.findUnique({
    where: {
      userId,
    },
  });

  const tweakerProfile = await db.tweakerProfile.findUnique({
    where: {
      userId,
    },
  });

  const breadCrumpItems = [
    {
      label: "Dashboard",
      link: "/dashboard",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-8">
      <div className="px-6">
        <div className="flex justify-between items-center">
          <CustomBreadCrump
            items={breadCrumpItems}
            currentPage="Profile Settings"
          />
          <SignOutButton>
            <Button variant="destructive" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </SignOutButton>
        </div>
      </div>
      <div className="px-6">
        <div>
          <h1 className="text-3xl font-bold">Profile Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage your profile information and preferences
          </p>
        </div>
        <Separator className="my-6" />
        <div className="space-y-8">
          <Tabs defaultValue="general">
            <TabsList>
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
            </TabsList>
            <TabsContent value="general" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Picture</CardTitle>
                  <CardDescription>
                    Update your profile picture and personal information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ProfilePicture
                    imageURL={user?.imageUrl || ""}
                    isAdmin={isAdmin}
                  />
                  <UsernameForm initialData={userProfile} userId={userId} />
                  <EmailForm initialData={userProfile} userId={userId} />
                </CardContent>
              </Card>
              {isAdmin && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      Tweaker Profile
                      <Crown className="h-5 w-5 text-yellow-500" />
                    </CardTitle>
                    <CardDescription>
                      Manage your tweaker profile and showcase your expertise
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href="/user/tweaker">
                      <Button className="w-full">
                        Manage Tweaker Profile
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>
                    Configure how you want to receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Notification settings content */}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Security</CardTitle>
                  <CardDescription>
                    Manage your security settings and connected accounts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <LogoutButton />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="appearance">
              <Card>
                <CardHeader>
                  <CardTitle>Appearance</CardTitle>
                  <CardDescription>
                    Customize how Better Performance looks on your device
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Appearance settings content */}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
