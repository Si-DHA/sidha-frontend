import { BASE_URL } from '@/app/constant/constant';

export const viewAllPenawaranHargaItem = async (): Promise<any> => {
    try {
        const response = await fetch('http://localhost:8080/api/penawaran-harga-item/id-penawaran-harga/view-all', {
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