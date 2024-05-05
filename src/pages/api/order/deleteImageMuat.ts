import { BASE_URL } from '@/app/constant/constant';

export const deleteImageMuat = async (idOrderItem: string): Promise<any> => {
    try {
        const response = await fetch(`${BASE_URL}/order/delete-bukti-muat?idOrderItem=${idOrderItem}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            return 'Bukti muat deleted successfully';
        } else {
            const responseData = await response.json();
            throw new Error(responseData.message || 'Failed to delete bukti muat');
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};
