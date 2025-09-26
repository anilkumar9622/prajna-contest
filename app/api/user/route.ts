import { NextResponse } from "next/server";
import { db } from "@/utils/firebaseAdmin";

export async function GET(req: Request) {
  try {
    const usersSnapshot = await db.collection("user").get();

    const users: any[] = [];
    usersSnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });

    return NextResponse.json({ users }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
