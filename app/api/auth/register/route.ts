import { NextResponse } from "next/server";
import { db } from "@/utils/firebaseAdmin";
import { formSchema } from "@/utils/schemaValidation";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // ✅ Step 1: Validate input data
    const validatedData = await formSchema.validate(body, { abortEarly: false });

    const userRef = db.collection("user");
    const mode = validatedData.registrationPaymentMode;

    // ✅ Step 2: Run inside Firestore transaction
    const result = await db.runTransaction(async (transaction) => {
      const existingUserQuery = await transaction.get(
        userRef.where("email", "==", validatedData.email).limit(1)
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
            ...validatedData,
            updatedAt: new Date(),
          });

          return {
            type: "updated",
            data: { id: existingUserDoc.id, ...validatedData },
          };
        }
      }

      // 🆕 If user does not exist → create new
      const newUserRef = userRef.doc();
      transaction.set(newUserRef, {
        ...validatedData,
        role: "student",
        createdAt: new Date(),
      });

      return {
        type: "created",
        data: { id: newUserRef.id, ...validatedData },
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



// // /auth/api/register.tsx
// import { NextResponse } from "next/server";
// import { db } from "@/utils/firebaseAdmin";
// import { formSchema } from "@/utils/schemaValidation";

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();

//     // 1️⃣ Validate request body
//     const validatedData = await formSchema.validate(body, { abortEarly: false });

//     // 2️⃣ Check for duplicate email
//     const emailQuery = await db
//       .collection("user")
//       .where("email", "==", validatedData.email)
//       .get();

//     if (!emailQuery.empty) {
//       return NextResponse.json(
//         { errors: ["User already Exist"] },
//         { status: 400 }
//       );
//     }

//     // 3️⃣ Save user
//     const docRef = await db.collection("user").add({
//       ...validatedData,
//       role: "student",
//       createdAt: new Date(),
//     });
//     const savedDoc = await docRef.get();
//     const userData = { id: savedDoc.id, ...savedDoc.data() };
//     return NextResponse.json(
//       { message: "Registered successfully", data: userData },
//       { status: 201 }
//     );
//   } catch (err: any) {
//     if (err.name === "ValidationError") {
//       return NextResponse.json({ errors: err.errors }, { status: 400 });
//     }
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }


