import { BASE_URL } from '@/app/constant/constant';
import { use } from 'react';

export const viewDetailKontrak = async (userId : String): Promise<any> => {
    try {
        const response = await fetch(BASE_URL+'/kontrak/detail/' + userId, {
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
