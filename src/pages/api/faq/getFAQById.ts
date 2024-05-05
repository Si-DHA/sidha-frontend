import { BASE_URL } from "@/app/constant/constant";

// Function to fetch FAQ details by ID
export const getFAQById = async (id: string): Promise<any> => {
    try {
        const response = await fetch(`${BASE_URL}/faq/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch FAQ details.');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching FAQ details:', error);
        throw error;
    }
};
