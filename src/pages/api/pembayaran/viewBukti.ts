import { BASE_URL } from '@/app/constant/constant';

export const viewBukti = async (idInvoice: String, isPelunasan: boolean): Promise<any> => {
    try {
        const url = `${BASE_URL}/invoice/get-bukti?idInvoice=${idInvoice}&isPelunasan=${isPelunasan}`;
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
