import { NextResponse } from "next/server";
import { db } from "@/utils/firebaseAdmin";

export const dynamic = "force-dynamic";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();
    const { paymentStatus } = body;

    if (!paymentStatus) {
      return NextResponse.json({ error: "paymentStatus is required" }, { status: 400 });
    }

    const userRef = db.collection("user").doc(id);
    const docSnap = await userRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await userRef.update({
      "payment.status": paymentStatus,
      "payment.updatedAt": new Date(),
    });

    return NextResponse.json(
      { message: "Payment status updated successfully", paymentStatus },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Error updating payment status:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
