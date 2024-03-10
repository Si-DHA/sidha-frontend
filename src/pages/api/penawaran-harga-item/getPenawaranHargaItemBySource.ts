export const getPenawaranHargaItemBySource = async (source: string): Promise<any> => {
    try {
        const response = await fetch(`http://localhost:8080/api/penawaran-harga-item/source/${source}/view-all`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        });
        if (response.ok) {
            return await response.json();
        } else {
            throw new Error('Error while fetching penawaran harga item data by source');
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};