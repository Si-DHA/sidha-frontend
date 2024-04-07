import { BASE_URL } from '@/app/constant/constant';

export const viewInvoice = async (idInvoice: String): Promise<any> => {
    try {
        const url = `${BASE_URL}/invoice/${idInvoice}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        });

        const responseData = await response.json();

        if (response.ok) {
            return responseData;
        } else {
            throw new Error(responseData.message);
        }

    } catch (error: any) {
        throw new Error(error.message);
    }
};
