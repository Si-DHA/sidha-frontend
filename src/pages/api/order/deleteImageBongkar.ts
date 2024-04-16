import { BASE_URL } from '@/app/constant/constant';

export const deleteImageBongkar = async (idOrderItem: string): Promise<any> => {
    try {
        const response = await fetch(`${BASE_URL}/order/delete-bukti-bongkar?idOrderItem=${idOrderItem}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            return 'Bukti bongkar deleted successfully';
        } else {
            const responseData = await response.json();
            throw new Error(responseData.message || 'Failed to delete bukti bongkar');
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};
