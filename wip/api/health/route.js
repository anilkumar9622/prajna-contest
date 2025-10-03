import { checkFirestoreConnection } from "@/utils/firebase";
import { NextResponse } from "next/server";
// import { checkFirestoreConnection } from "@/util/firebase";

export async function GET() {
  const ok = await checkFirestoreConnection();
  return NextResponse.json({ firestore: ok ? "connected" : "disconnected" }, { status: ok ? 200 : 500 });
}
