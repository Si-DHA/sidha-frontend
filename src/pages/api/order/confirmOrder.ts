import { BASE_URL } from "@/app/constant/constant";
import { ConfirmOrder } from "@/app/components/model";


export const confirmOrder = async (confirmOrder: ConfirmOrder, token: string): Promise<any> => {
    try {
        const response = await fetch(BASE_URL + '/order/confirm', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Authorization': 'Bearer ' + token + '',
            },
            body: JSON.stringify(confirmOrder)
        });

        const responseData = await response.json();
        // console.log("responseData:", responseData);

        if (response.ok) {
            return responseData;
        } else {
            throw new Error(responseData.message);
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
}