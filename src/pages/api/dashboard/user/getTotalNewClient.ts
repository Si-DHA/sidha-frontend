import { BASE_URL } from "@/app/constant/constant";

export const getTotalNewClient = async (type: String): Promise<any> => {
    try {
        const response = await fetch(BASE_URL + `/user/client/total/`+ type, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update item');
        }
        var returnData = await response.json();

        return returnData;
    } catch (error: unknown) {
        const message = (error as Error).message || 'An unexpected error occurred';
        throw new Error(message);
    }
};
