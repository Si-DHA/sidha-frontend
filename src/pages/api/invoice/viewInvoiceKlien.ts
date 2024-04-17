import { BASE_URL } from '@/app/constant/constant';

export const viewInvoiceKlien = async (idKlien: String): Promise<any> => {
    try {
        const url = `${BASE_URL}/invoice/view-klien/${idKlien}`;
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
