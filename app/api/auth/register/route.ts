import { NextResponse } from "next/server";
import { db } from "@/utils/firebaseAdmin";
import { getValidationSchema } from "@/utils/schemaValidation";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.registrationType) {
      return NextResponse.json(
        { errors: ["Registration type is required"] },
        { status: 400 }
      );
    }

    const schema = getValidationSchema(body.registrationType);

    const validatedData = await schema.validate(body, { 
      abortEarly: false,
      context: { isCourier: body.isCourier }
    });

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

    const docRef = await db.collection("user").add({
      ...validatedData,
      createdAt: new Date(),
    });

    return NextResponse.json(
      { message: "Hare Krishna, Registered successfully", id: docRef.id },
      { status: 201 }
    );
  } catch (err: any) {
    if (err.name === "ValidationError") {
      return NextResponse.json({ errors: err.errors }, { status: 400 });
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
