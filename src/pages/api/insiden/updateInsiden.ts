import { BASE_URL } from "@/app/constant/constant";

export const updateInsiden = async (id: string | string[], formData: FormData): Promise<any> => {
    try {
        const response = await fetch(`${BASE_URL}/insiden/update/${id}`, {
            method: 'PUT',
            body: formData, 
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update insiden');
        }

        return await response.json();
    } catch (error: any) {
        console.error('Error updating insiden:', error);
        throw error;
    }
};
