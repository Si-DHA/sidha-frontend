import { BASE_URL } from '@/app/constant/constant';
import { UUID } from 'crypto';

export const viewBukti = async (id: UUID): Promise<any> => {
    try {
        const response = await fetch(BASE_URL+'/kontrak/doc/'+id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        });

        const responseData = await response.arrayBuffer();

        if (response.ok) {
            return responseData;
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};
