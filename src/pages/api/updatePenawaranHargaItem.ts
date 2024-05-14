import { BASE_URL } from "@/app/constant/constant";

export const updatePenawaranHargaItem = async (itemData: JSON): Promise<any> => {
    try {
        const response = await fetch(BASE_URL + `/penawaran-harga-item/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify(itemData),
        });

        const responseData = await response.json();

        if (response.ok) {
            return responseData;
        } else {
            throw new Error(responseData.message);
        }
    } catch (error: any) {
        const message = error.message;
        throw new Error(message);
    }
};