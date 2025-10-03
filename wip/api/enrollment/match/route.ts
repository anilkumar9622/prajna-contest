// import dbFunc from '@/utils/dbFunc';
// import { NextRequest, NextResponse } from 'next/server';

// async function handler(req: NextRequest) {
//     try {
//         const body = await req.json()
//         const { enrollmentId } = body
//         const data: any = await dbFunc.findViaDocumentID('enrollmentIDs', enrollmentId).catch(e => { throw e })
//         return NextResponse.json({ status: data.expire == true ? false : true })
//     } catch (error) {
//         console.error('Error checking document:', error);
//         return NextResponse.json({ status: false })
//     }
// }

// export { handler as POST }

import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import dbFunc from "@/utils/dbFunc";

const loadHashMapFromFile = (filePath: string): Record<number, boolean> | null => {
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return null;
  }
};

async function handler(req: NextRequest) {
  try {
    // Only handle POST
    if (req.method !== "POST") {
      return NextResponse.json({ status: false, error: "Invalid method" }, { status: 405 });
    }

    let body: any = {};
    try {
      // Only try to parse JSON if body exists
      const text = await req.text(); // safer than req.json()
      if (text) body = JSON.parse(text);
    } catch (err) {
      console.warn("Empty or invalid JSON body detected, ignoring");
      body = {};
    }

    const enrollmentId = body?.enrollmentId;
    if (!enrollmentId) {
      return NextResponse.json({ status: false, error: "Missing enrollmentId" });
    }

    const hashMapFilePath = path.join(process.cwd(), "/utils/hashMap.json");
    const hashMap = loadHashMapFromFile(hashMapFilePath);

    if (!hashMap || !hashMap[enrollmentId]) {
      return NextResponse.json({ status: false });
    }

    const data: any = await dbFunc.findViaDocumentID("enrollmentIDs", enrollmentId);
    return NextResponse.json({ status: data?.expire !== true });
  } catch (error) {
    console.error("Error checking enrollment ID:", error);
    return NextResponse.json({ status: false, error: "Internal server error" });
  }
}

export { handler as POST };
