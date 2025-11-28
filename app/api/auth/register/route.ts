import { NextResponse } from "next/server";
import { db } from "@/utils/firebaseAdmin";
import { formSchema } from "@/utils/schemaValidation";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // ✅ Step 1: Validate input data
    const validatedData = await formSchema.validate(body, { abortEarly: false });
    const {captcha, ...dataWithoutCaptcha} = validatedData;
    const userRef = db.collection("user");
    const mode = dataWithoutCaptcha.registrationPaymentMode;

    // ✅ Step 2: Run inside Firestore transaction
    const result = await db.runTransaction(async (transaction) => {
      const existingUserQuery = await transaction.get(
        userRef.where("email", "==", dataWithoutCaptcha.email).limit(1)
      );

      // ✅ If user exists
      if (!existingUserQuery.empty) {
        const existingUserDoc = existingUserQuery.docs[0];
        const existingUser = existingUserDoc.data();

        if (mode === "offline") {
          // 🧾 OFFLINE MODE: Only check email
          throw new Error("User already registered");
        }

        if (mode === "online") {
          const paymentStatus = existingUser?.payment?.status;
          const paymentId = existingUser?.payment?.paymentId;

          // 💳 ONLINE MODE: If payment success and paymentId exist, reject
          if (paymentStatus === "success" && paymentId) {
            throw new Error("User already registered");
          }

          // 🧠 Otherwise, update existing record
          transaction.update(existingUserDoc.ref, {
            ...dataWithoutCaptcha,
            updatedAt: new Date(),
          });

          return {
            type: "updated",
            data: { id: existingUserDoc.id, ...dataWithoutCaptcha },
          };
        }
      }

      // 🆕 If user does not exist → create new
      const newUserRef = userRef.doc();
      transaction.set(newUserRef, {
        ...dataWithoutCaptcha,
        role: "student",
        createdAt: new Date(),
      });

      return {
        type: "created",
        data: { id: newUserRef.id, ...dataWithoutCaptcha },
      };
    });

    // ✅ Step 3: Return success response
    if (result.type === "created") {
      return NextResponse.json(
        { message: "Registered successfully", data: result.data },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { message: "User updated successfully", data: result.data },
        { status: 200 }
      );
    }
  } catch (err: any) {
    console.error("🔥 Registration Error:", err);
    if (err.message === "User already registered") {
      return NextResponse.json({ message: err.message }, { status: 400 });
    }
    if (err.name === "ValidationError") {
      return NextResponse.json({ errors: err.errors }, { status: 400 });
    }
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}


