import { BASE_URL } from "@/app/constant/constant";

// Function to fetch proof photo by incident ID
export const getBuktiFoto = async (id: string): Promise<any> => {
    try {
        const response = await fetch(`${BASE_URL}/insiden/bukti/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch proof photo.');
        }
        return response.blob();
    } catch (error) {
        console.error('Error fetching proof photo:', error);
        throw error;
    }
};

