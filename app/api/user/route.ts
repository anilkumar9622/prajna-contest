import { NextResponse } from "next/server";
import { db } from "@/utils/firebaseAdmin";

export const dynamic = "force-dynamic"; // disable caching in prod

export async function GET(req: Request) {
  try {
    const usersSnapshot = await db.collection("user").get();

    const users: any[] = [];
    usersSnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });

    return NextResponse.json(
      { users },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
