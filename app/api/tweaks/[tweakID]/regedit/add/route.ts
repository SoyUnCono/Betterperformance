import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return new NextResponse("Method Not allowed");
  }

  const { id } = req.query;
  const { path, entries } = req.body;

  if (!path || !entries || entries.length === 0)
    return new NextResponse("Invalid data response");

  try {
    const newRegedit = await db.regedit.create({
      data: {
        path,
        tweak: {
          connect: { id: String(id) },
        },
        entries: {
          create: entries.map((entry: { key: string; value: string }) => ({
            key: entry.key,
            values: entry.value,
          })),
        },
      },
    });
    return NextResponse.json(newRegedit);
  } catch (error) {
    return new NextResponse(
      `An error has ocurred while creating regedit: ${error}`
    );
  }
}
