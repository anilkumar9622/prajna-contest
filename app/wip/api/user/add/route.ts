import dbFunc from '@/utils/dbFunc';
import { NextRequest, NextResponse } from 'next/server';

async function handler(req: NextRequest) {
    try {
        const body = await req.json()

        await dbFunc.add('enrollmentIDs', body.enrollmentID, {
            expire: true,
            assignedTo: body.email
        }).then(async () => {

            await dbFunc.add('users', body.email, {
                fullName: body.personName,
                email: body.email,
                emailLinkedName: body.name,
                enrollmentID: body.enrollmentID,
                contactNumber: body.contactNumber,
                institutionName: body?.institutionName ? body.institutionName : body.institutionNameOther,
                category: body.category
            }).catch(e => { throw e })

        }).catch(e => { throw e })

        return NextResponse.json({ status: true })
    } catch (error) {
        console.error('Error checking document:', error);
        return NextResponse.json({ status: false })
    }
}

export { handler as POST }
