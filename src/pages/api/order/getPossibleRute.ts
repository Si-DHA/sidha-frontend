import { BASE_URL } from "@/app/constant/constant";

export const getPossibleRute = async (userId:string) => {
    try {
        const response = await fetch(BASE_URL+'/order/possible-rute?userId='+userId, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        });

        const responseData = await response.json();

        if (response.ok) {
            return responseData['content'];
        } else {
            throw new Error(responseData.message);
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
}