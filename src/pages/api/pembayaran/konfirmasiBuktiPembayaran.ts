import { BASE_URL } from '@/app/constant/constant';

export const konfirmasiBuktiPembayaran = async (requestBody: JSON): Promise<any> => {
    try {
        const response = await fetch(BASE_URL+'/invoice/konfirmasi-bukti', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify(requestBody),
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