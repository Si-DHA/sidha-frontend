import { BASE_URL } from '@/app/constant/constant';

export const updateFAQ = async (faqId, faqData) => {
    try {
        const response = await fetch(BASE_URL + `/faq/update/${faqId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(faqData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update FAQ');
        }
        return await response.json();
    } catch (error) {
        throw new Error(error.message || 'An unexpected error occurred');
    }
};
