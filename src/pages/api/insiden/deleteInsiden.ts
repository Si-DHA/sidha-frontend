// Assuming this is also located in a similar place as the update function
import { BASE_URL } from '@/app/constant/constant';

export const deletePenawaranHargaItem = async (id: string): Promise<void> => {
    try {
        const response = await fetch(BASE_URL + `/insiden/delete/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
            },
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to delete item');
        }
    } catch (error: unknown) {
        const message = (error as Error).message || 'An unexpected error occurred';
        throw new Error(message);
    }
};
