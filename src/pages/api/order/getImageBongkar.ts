import { BASE_URL } from '@/app/constant/constant';

export const getImageBongkar = async (idOrderItem: String): Promise<any> => {
    try {
        const url = `${BASE_URL}/order/get-bukti-bongkar?idOrderItem=${idOrderItem}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        });

        return response.blob();
    } catch (error: any) {
        throw new Error(error.message);
    }
};