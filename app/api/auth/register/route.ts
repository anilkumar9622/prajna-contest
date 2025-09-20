import { NextResponse } from "next/server";
import { db } from "@/utils/firebaseAdmin";
import { formSchema } from "@/utils/schemaValidation";
// import { formSchema } from "@/utils/formSchema"; // 👈 keep schema separate

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // ✅ validate request body against yup schema
    const validatedData = await formSchema.validate(body, { abortEarly: false });

    // ✅ save only validated data
    const docRef = await db.collection("user").add({
      ...validatedData,
      createdAt: new Date(),
    });

    return NextResponse.json(
      { message: "Registered successfully", id: docRef.id },
      { status: 201 }
    );
  } catch (err: any) {
    // handle validation errors
    if (err.name === "ValidationError") {
      return NextResponse.json(
        { errors: err.errors }, // 👈 yup returns array of messages
        { status: 400 }
      );
    }

    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
