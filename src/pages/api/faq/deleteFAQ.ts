import { BASE_URL } from '@/app/constant/constant';

export const deleteFAQ = async (faqId) => {
    try {
        const response = await fetch(BASE_URL + `/faq/delete/${faqId}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to delete FAQ');
        }
    } catch (error) {
        throw new Error(error.message || 'An unexpected error occurred');
    }
};
