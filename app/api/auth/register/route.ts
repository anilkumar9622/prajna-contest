// /auth/api/register.tsx
import { NextResponse } from "next/server";
import { db } from "@/utils/firebaseAdmin";
import { formSchema } from "@/utils/schemaValidation";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1️⃣ Validate request body
    const validatedData = await formSchema.validate(body, { abortEarly: false });

    // 2️⃣ Check for duplicate email
    const emailQuery = await db
      .collection("user")
      .where("email", "==", validatedData.email)
      .get();

    if (!emailQuery.empty) {
      return NextResponse.json(
        { errors: ["User already Exist"] },
        { status: 400 }
      );
    }

    // 3️⃣ Save user
    const docRef = await db.collection("user").add({
      ...validatedData,
      createdAt: new Date(),
    });
    const savedDoc = await docRef.get();
    const userData = { id: savedDoc.id, ...savedDoc.data() };
    return NextResponse.json(
      { message: "Registered successfully", data: userData },
      { status: 201 }
    );
  } catch (err: any) {
    if (err.name === "ValidationError") {
      return NextResponse.json({ errors: err.errors }, { status: 400 });
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
