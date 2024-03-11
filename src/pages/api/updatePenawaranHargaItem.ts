import { BASE_URL } from "@/app/constant/constant";

export const updatePenawaranHargaItem = async (itemData: any): Promise<any> => {
    try {
        const response = await fetch(BASE_URL + `/penawaran-harga-item/update`, {
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
    } catch (error: unknown) {
        const message = (error as Error).message || 'An unexpected error occurred';
        throw new Error(message);
    }
};