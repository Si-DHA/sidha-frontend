import { BASE_URL } from "@/app/constant/constant";
import { Order } from "@/pages/order/model";

export const getOrderDetailBeforeCheckout = async (req: any, token: string) => {
    try {
        const response = await fetch(BASE_URL + '/order/price', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Authorization': 'Bearer ' + token + '',
            },
            body: req,
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