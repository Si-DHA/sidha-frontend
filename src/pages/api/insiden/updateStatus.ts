import { BASE_URL } from '@/app/constant/constant';

// Define the InsidenStatus enum
export enum InsidenStatus {
    PENDING = "PENDING",
    ON_PROGRESS = "ON_PROGRESS",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED"
}

export const updateStatus = async (id: string, status: InsidenStatus): Promise<any> => {
    try {
        const response = await fetch(`${BASE_URL}/insiden/status/${id}?status=${status}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const responseData = await response.json();

        if (response.ok) {
            return responseData;
        } else {
            throw new Error(responseData.message);
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};
