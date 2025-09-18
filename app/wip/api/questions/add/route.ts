import dbFunc from '@/utils/dbFunc';
import { generateRandomID } from '@/utils/random';
import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import path from 'path';
import fs from 'fs/promises';

async function handler() {
    try {
        const questionBankID = generateRandomID("QB");

        // Construct the file path relative to the current working directory
        const filePath = path.join(process.cwd(), 'utils', 'questions.xlsx'); // Replace with your file name

        try {
            // Check if the file exists
            await fs.access(filePath, fs.constants.F_OK);
        } catch (err) {
            console.error("File not found:", err);
            return NextResponse.json({ status: false, error: "Excel file not found." });
        }

        const fileBuffer = await fs.readFile(filePath);

        const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        const questions = jsonData.map((row: any) => {
            return {
                question: row['Question'].trim(),
                options: [row['Option 1'].trim(), row['Option 2'].trim(), row['Option 3'].trim(), row['Option 4'].trim()],
                answer: parseInt(row['Ans. opt. no.']),
            };
        });

        await dbFunc.add('questions', questionBankID, { questions }).catch(e => { throw e });

        return NextResponse.json({ status: true, questionBankID });
    } catch (error: any) {
        console.error('Error processing file:', error);
        return NextResponse.json({ status: false, error: error?.message });
    }
}

export { handler as GET }; 