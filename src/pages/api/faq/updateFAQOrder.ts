import { BASE_URL } from '@/app/constant/constant';

export const updateFAQOrder = async (newOrder) => {
    try {
        const response = await fetch(BASE_URL + '/faq/updateOrder', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newOrder),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update FAQ order');
        }
        return await response.json();
    } catch (error) {
        throw new Error(error.message || 'An unexpected error occurred while updating FAQ order');
    }
};
