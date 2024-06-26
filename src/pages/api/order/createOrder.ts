import { BASE_URL } from "@/app/constant/constant";
import { Order } from "@/app/components/model";


export const createOrder = async (order: Order, token: string): Promise<any> => {
    try {
        const response = await fetch(BASE_URL + '/order/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Authorization': 'Bearer ' + token + '',
            },
            body: JSON.stringify(order)
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