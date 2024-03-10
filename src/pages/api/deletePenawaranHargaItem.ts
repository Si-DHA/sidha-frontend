// Assuming this is also located in a similar place as the update function
export const deletePenawaranHargaItem = async (idPenawaranHargaItem: string): Promise<void> => {
    try {
        const response = await fetch(`http://localhost:8080/api/penawaran-harga-item/delete/${idPenawaranHargaItem}`, {
            method: 'DELETE',
            // If your backend does not expect a JSON body for DELETE requests, you might not need this header.
            headers: {
                'Accept': 'application/json',
            },
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to delete item');
        }
    } catch (error: unknown) {
        const message = (error as Error).message || 'An unexpected error occurred';
        throw new Error(message);
    }
};
