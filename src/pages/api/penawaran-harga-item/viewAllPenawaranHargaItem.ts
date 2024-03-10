import { BASE_URL } from '@/app/constant/constant';

export const viewAllPenawaranHargaItem = async (idPenawaranHarga: string | undefined): Promise<any> => {
    try {
        const url = `${BASE_URL}/penawaran-harga-item/${idPenawaranHarga}/view-all`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        });
        if (response.ok) {
            return await response.json();
        } else {
            throw new Error('Error while fetching penawaran harga item data');
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};