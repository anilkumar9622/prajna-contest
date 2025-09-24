import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import csv from "csv-parser";

async function extractCombinedDigit(csvFilePath: string): Promise<number[]> {
  return new Promise((resolve, reject) => {
    const combinedDigits: number[] = [];

    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on("data", (row) => {
        // Assuming the header has a 'Combined Digit' column
        if (row["Combined Digit"]) {
          combinedDigits.push(Number(row["Combined Digit"]));
        }
      })
      .on("end", () => {
        resolve(combinedDigits);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

const saveHashMapToFile = (hashMap: Record<number, boolean>, filePath: string) => {
  fs.writeFileSync(filePath, JSON.stringify(hashMap, null, 2));
};

const loadHashMapFromFile = (filePath: string): Record<number, boolean> | null => {
  if (fs.existsSync(filePath)) {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(fileContent);
  }
  return null;
};

export async function POST(req: NextRequest) {
  try {
    const { key } = await req.json();
    if (key !== process.env.NEXTAUTH_SECRET) throw "Invalid Key!";

    const csvFilePath = path.join(process.cwd(), "/utils/enrollmentIDs.csv");
    const hashMapFilePath = path.join(process.cwd(), "/utils/hashMap.json");

    // Check if the hashmap file exists
    let hashMap = loadHashMapFromFile(hashMapFilePath);

    if (!hashMap) {
      // Generate hashmap if it doesn't exist
      const combinedDigits = await extractCombinedDigit(csvFilePath);
      hashMap = combinedDigits.reduce((acc, id) => {
        acc[id] = true;
        return acc;
      }, {} as Record<number, boolean>);

      // Save the generated hashmap to a file
      saveHashMapToFile(hashMap, hashMapFilePath);
    }

    console.log("HashMap:", hashMap);

    return NextResponse.json({ status: "HashMap loaded and logged in console" });
  } catch (error: any) {
    return NextResponse.json({ status: `Error: ${error.toString()}!` });
  }
}
