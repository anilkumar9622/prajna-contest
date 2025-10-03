'use client';
import UserDataDisplayComponent from '@/components/UserDataDisplayComponent';
import SendRequest from '@/utils/SendRequest';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function Dashboard() {
    const session: any = useSession();
    const [loading, setLoading] = useState<any>(true)
    const [data, setData] = useState<any>();

    const fetchAllUserData = async () => {
        setLoading(true);
        try {
            const res: any = await SendRequest(`/user/getAll`, 'GET');
            if (!res.data) throw res.data?.error;
            setData(res.data.data);
        } catch (error: any) {
            console.log(error.toString());
        } finally {
            setTimeout(() => setLoading(false), 1000);
        }
    };

    useEffect(() => {
        if (session?.data?.user?.email) {
            fetchAllUserData();
        }
    }, [session?.data?.user?.email]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray space-y-4">
            <div className='mb-8'>
                {loading && <div className="p-6 min-h-screen flex items-center justify-center">
                    <h1 className="text-2xl font-bold text-white-500 text-center">
                        Fetching User Data...
                    </h1>
                </div>}
                {!loading && <UserDataDisplayComponent data={data} loading={loading} />}
            </div>
        </div>
    );
}