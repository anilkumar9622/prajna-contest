import { getSession } from "next-auth/react";
import axios from "axios";

const SendRequest = async (route: string, method: string, payload?: {}) => {
    try {

        const session: any = await getSession();

        delete session.user.image

        if (!session?.user) throw "User not authenticated"

        if (method == 'GET')
            return await axios.get(`/api${route}?session=${session.user.email}`)
        else if (method == 'POST')
            return await axios.post(`/api/${route}`, { ...session.user, ...payload })

    } catch (error) {
        throw error
    }
}

export default SendRequest