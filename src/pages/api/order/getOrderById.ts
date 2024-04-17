import { BASE_URL } from "@/app/constant/constant";

export const getOrderById = async (idOrder: string, token: string): Promise<any> => {
    try {
        const response = await fetch(BASE_URL + '/order/' + idOrder, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Authorization': 'Bearer ' + token + '',
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
};