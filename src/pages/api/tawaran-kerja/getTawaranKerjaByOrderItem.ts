import { BASE_URL } from '@/app/constant/constant';

export const getTawaranKerjaByOrderItemId = async (orderItemId) => {
    try {
        const response = await fetch(`${BASE_URL}/tawaran-kerja/${orderItemId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch job offers by order item ID');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching tawaran kerja by order item ID:', error);
        throw error;
    }
};
