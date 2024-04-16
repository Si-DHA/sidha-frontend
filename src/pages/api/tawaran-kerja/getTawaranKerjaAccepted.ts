// Base URL of your API
import { BASE_URL } from '@/app/constant/constant';

// Function to fetch available order items from the server
export const getTawaranKerjaAccepted = async (): Promise<any> => {
    try {
        const response = await fetch(`${BASE_URL}/tawaran-kerja`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        });
        if (!response.ok) {
            throw new Error('Error while fetching available order items');
        }
        const data = await response.json();
        return data.content;
    } catch (error: any) {
        console.error('Failed to fetch available order items:', error.message);
        throw new Error(error.message);
    }
};
