import { NextRequest, NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import dbFunc from "@/utils/dbFunc";


async function extractCombinedDigit(csvFilePath: string): Promise<number[]> {
    return new Promise((resolve, reject) => {
        const combinedDigits: number[] = [];

        fs.createReadStream(csvFilePath)
            .pipe(csv())
            .on('data', (row) => {
                // Assuming the header has a 'Combined Digit' column
                if (row['Combined Digit']) {
                    combinedDigits.push(Number(row['Combined Digit']));
                }
            })
            .on('end', () => {
                resolve(combinedDigits);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
}

const updateIDs = async (IDs: any[]) => {
    for (let ID of IDs)
        await dbFunc.add('enrollmentIDs', ID.toString(), { expire: false }).catch(e => { console.log(e) })
}

export async function POST(req: NextRequest) {
    try {
        const { key } = await req.json()
        if (key !== process.env.NEXTAUTH_SECRET) throw "Invalid Key!"
        const csvFilePath = path.join(process.cwd(), '/utils/enrollmentIDs.csv');
        const combinedDigits = await extractCombinedDigit(csvFilePath);
        // console.log(combinedDigits)
        updateIDs(combinedDigits)
        return NextResponse.json({ status: "Successfully Updated" })
    } catch (error: any) {
        return NextResponse.json({ status: `Error: ${error.toString()}!` })
    }
}