import { BASE_URL } from '@/app/constant/constant';

export const viewAllSopir= async (): Promise<any> => {
    try {
        const response = await fetch(BASE_URL+'/user/sopir', {
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
            return [];
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};
