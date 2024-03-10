// Assuming this is located in a file like 'api/penawaranHargaItem.js' or similar
export const updatePenawaranHargaItem = async (idPenawaranHargaItem: string, itemData: any): Promise<any> => {
    try {
        const response = await fetch(`http://localhost:8080/api/penawaran-harga-item/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            // Ensure the body structure matches the backend's expected format.
            // Here, assuming the backend expects the item's ID to be part of the URL or the body directly.
            body: JSON.stringify({
                ...itemData, // Spread the item data
                id: idPenawaranHargaItem, // Make sure this key matches the expected key for the ID in your backend
            }),
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
