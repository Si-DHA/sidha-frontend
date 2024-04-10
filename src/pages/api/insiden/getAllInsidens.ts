import { BASE_URL } from '@/app/constant/constant';

export const getAllInsidens = async (): Promise<any> => {
    try {
        const response = await fetch(`${BASE_URL}/insiden/all`);
        if (!response.ok) {
            throw new Error('Failed to fetch insiden data');
        }
        const data = await response.json();
        return data; 
    } catch (error) {
        console.error('Error fetching insidens:', error.message);
        throw error;
    }
};
