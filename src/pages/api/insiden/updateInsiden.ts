import { BASE_URL } from "@/app/constant/constant";

// Assuming itemData is of a generic object type, adjust the type as necessary
export const updateInsiden = async (id: string, itemData: Record<string, any>): Promise<any> => {
    try {
        const response = await fetch(`${BASE_URL}/insiden/update/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(itemData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update item');
        }
        return await response.json();
    } catch (error) {
        // Improved error handling
        if (error instanceof Error) {
            throw new Error(error.message || 'An unexpected error occurred');
        } else {
            throw new Error('An unexpected error occurred');
        }
    }
};
