import { BASE_URL } from '@/app/constant/constant';

export const deleteUser = async (userID: String): Promise<any> => {
    try {
      
        
        const response = await fetch(BASE_URL + '/user/' + userID, {
            method: 'DELETE',
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
