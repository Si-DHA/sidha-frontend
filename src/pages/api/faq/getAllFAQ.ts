import { BASE_URL } from '@/app/constant/constant';

export const getAllFAQ = async (): Promise<any> => {
    try {
        const response = await fetch(`${BASE_URL}/faq`);
        if (!response.ok) {
            throw new Error('Failed to fetch FAQ data');
        }
        // Check if the response is empty
        const text = await response.text();
        return text ? JSON.parse(text) : {};
    } catch (error) {
        console.error('Error fetching FAQ:', error.message);
        throw error;
    }
};
