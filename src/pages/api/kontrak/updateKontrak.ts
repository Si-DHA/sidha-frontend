import { BASE_URL } from '@/app/constant/constant';

export const updateKontrak = async (userId : String, file: File): Promise<any> => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(BASE_URL+'/kontrak/' + userId, {
            method: 'PUT',
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            body: formData
        });

        const responseData = await response.json();

        if (response.ok) {
            return responseData;
        } else {
            return [];
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};