import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import CustomBreadCrump from "@/components/CustomBreadCrump";
import { TweakerProfileForm } from "../_components/TweakerProfileForm";

export default async function TweakerProfilePage() {
    const { userId } = auth();

    if (!userId) {
        redirect("/sign-in");
    }

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
        {
            label: "Profile Settings",
            link: "/user",
        },
    ];

    return (
        <div className="max-w-5xl mx-auto py-8 space-y-8">
            <div className="px-6">
                <CustomBreadCrump items={breadCrumpItems} currentPage="Tweaker Profile" />
            </div>
            <div className="px-6">
                <div>
                    <h1 className="text-3xl font-bold">Tweaker Profile</h1>
                    <p className="text-sm text-muted-foreground">
                        Manage your tweaker profile and showcase your expertise
                    </p>
                </div>
                <div className="mt-8">
                    <TweakerProfileForm initialData={tweakerProfile || undefined} />
                </div>
            </div>
        </div>
    );
} 