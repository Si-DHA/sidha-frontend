import { BASE_URL } from '@/app/constant/constant';

export const viewSopirNoTruk = async (): Promise<any> => {
    try {
        const response = await fetch(BASE_URL+'/user/sopir-no-truk', {
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