import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const PATCH = async (req: Request) => {
  try {
    const { userId } = auth();
    console.log(`Received userId: ${userId}`);

    const values = await req.json();
    console.log(`Received values: ${JSON.stringify(values)}`);

    if (!userId) {
      return new NextResponse("There's no userId provided", { status: 400 });
    }

    let profile = await db.userProfile.findUnique({
      where: {
        userId,
      },
    });

    console.log(`Profile found: ${JSON.stringify(profile)}`);

    let userProfile;

    if (profile) {
      userProfile = await db.userProfile.update({
        where: {
          userId,
        },
        data: {
          ...values,
        },
      });
    } else {
      userProfile = await db.userProfile.create({
        data: {
          userId,
          ...values,
        },
      });
    }

    return NextResponse.json(userProfile);
  } catch (error) {
    console.error("Error in PATCH request:", error);
    return new NextResponse("Internal server error: Code 500", { status: 500 });
  }
};
