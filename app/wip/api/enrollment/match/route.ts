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
import dbFunc from '@/utils/dbFunc';

// Load HashMap from File
const loadHashMapFromFile = (filePath: string): Record<number, boolean> | null => {
    if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, "utf-8");
        return JSON.parse(fileContent);
    }
    return null;
};

async function handler(req: NextRequest) {
    try {
        const body = await req.json()
        const { enrollmentId } = body

        console.log(enrollmentId)

        const hashMapFilePath = path.join(process.cwd(), "/utils/hashMap.json");

        // Load the hashmap from the file
        const hashMap = loadHashMapFromFile(hashMapFilePath);

        if (!hashMap || !hashMap[enrollmentId]) {
            return NextResponse.json({ status: false });
        }

        // If the ID exists in hashmap, fetch from DB to check its availability
        const data: any = await dbFunc.findViaDocumentID('enrollmentIDs', enrollmentId).catch(e => { throw e });

        return NextResponse.json({ status: data.expire == true ? false : true });
    } catch (error) {
        console.error("Error checking enrollment ID:", error);
        return NextResponse.json({ status: false });
    }
}

export { handler as POST };
