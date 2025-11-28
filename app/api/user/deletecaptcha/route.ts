import { NextResponse } from "next/server";
import { db } from "@/utils/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";

export async function GET() {
  try {
    const snap = await db.collection("user").get();

    const batch = db.batch();

    snap.forEach((doc) => {
      batch.update(doc.ref, {
        captcha: FieldValue.delete(),
      });
    });

    await batch.commit();

    return NextResponse.json({ message: "Captcha field deleted from all users" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
