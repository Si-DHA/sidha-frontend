import { OrderUpdate } from '@/app/components/model';
import { BASE_URL } from '@/app/constant/constant';

export const editOrder = async (request: OrderUpdate, token: string): Promise<any> => {
    try {
        const url = `${BASE_URL}/order/update`;
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify(request),
        });

        const responseData = await response.json();

        if (response.ok) {
            return responseData['content'];
        } else {
            throw new Error(responseData.message);
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};
