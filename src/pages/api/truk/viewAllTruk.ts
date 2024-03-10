import { BASE_URL } from '@/app/constant/constant';

export const loginUser = async (): Promise<any> => {
    try {
        const response = await fetch(BASE_URL+'/api/truk/view-all', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        });
        if (response.ok) {
            return await response.json();
        } else {
            throw new Error('Error while fetching truck data');
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};
