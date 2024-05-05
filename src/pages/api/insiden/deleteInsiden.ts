import { BASE_URL } from '@/app/constant/constant';

export const deleteInsiden = async (id: string): Promise<any> => {
    try {
        const response = await fetch(`${BASE_URL}/insiden/delete/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            return 'Insiden deleted successfully';
        } else {
            const responseData = await response.json();
            throw new Error(responseData.message || 'Failed to delete insiden');
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};
