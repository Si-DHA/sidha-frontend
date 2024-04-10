import { BASE_URL } from '@/app/constant/constant';

export const getInsidensBySopir = async (sopirId: string): Promise<any> => {
    try {
        const response = await fetch(`${BASE_URL}/insiden/sopir/${sopirId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            }
          });          

        const responseData = await response.json();
        if (!response.ok) {
            throw new Error(responseData.message || 'Error fetching incidents');
        }
        return responseData;
    } catch (error: any) {
        throw new Error(error.message || 'An error occurred');
    }
};
