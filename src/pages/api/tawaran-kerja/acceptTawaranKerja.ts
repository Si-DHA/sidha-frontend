import { BASE_URL } from '@/app/constant/constant';

export const acceptTawaranKerja = async (orderItemId: string, sopirId: string, lokasi: string): Promise<any> => {
    const body = JSON.stringify({ orderItemId, sopirId, lokasi });

    try {
        const response = await fetch(`${BASE_URL}/tawaran-kerja/accept`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: body,
        });

        const responseData = await response.json();
        if (response.ok) {
            return responseData;
        } else {
            throw new Error(responseData.message || 'Failed to accept job offer');
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};
