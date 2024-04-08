import { BASE_URL } from '@/app/constant/constant';

export const createInsiden = async (sopirId: string, kategori: string, lokasi: string, keterangan: string, buktiFoto: File): Promise<any> => {
    const formData = new FormData();
    formData.append('sopirId', sopirId);
    formData.append('kategori', kategori);
    formData.append('lokasi', lokasi);
    formData.append('keterangan', keterangan);
    formData.append('buktiFoto', buktiFoto);

    try {
        const response = await fetch(`${BASE_URL}/insiden/create`, {
            method: 'POST',
            body: formData,
        });

        const responseData = await response.json();
        if (response.ok) {
            return responseData;
        } else {
            throw new Error(responseData.message || 'Failed to create insiden');
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};
