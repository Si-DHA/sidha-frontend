import { BASE_URL } from "@/app/constant/constant";

// Function to fetch incident details by ID
export const getInsidenById = async (id: string): Promise<any> => {
    try {
        const response = await fetch(`${BASE_URL}/insiden/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch incident details.');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching incident details:', error);
        throw error;
    }
};
