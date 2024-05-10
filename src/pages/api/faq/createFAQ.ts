import { BASE_URL } from '@/app/constant/constant';

export const createFAQ = async (faqData) => {
    try {
        const response = await fetch(BASE_URL + '/faq/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(faqData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to create FAQ');
        }
        return await response.json();
    } catch (error) {
        throw new Error(error.message || 'An unexpected error occurred');
    }
};
