import { BASE_URL } from '@/app/constant/constant';

export const createInsiden = async (formData: FormData) => {
    try {
        const response = await fetch(`${BASE_URL}/insiden/create`, {
            method: 'POST',
            body: formData,
        });

        // Check if the response is JSON before attempting to parse it
        const contentType = response.headers.get("Content-Type");
        let errorData;

        if (contentType && contentType.includes("application/json")) {
            errorData = await response.json();
        } else {
            errorData = { message: await response.text() };
        }

        if (!response.ok) {
            throw new Error(errorData.message || "Unknown error occurred");
        }

        return errorData;
    } catch (error) {
        console.error('Failed to create insiden:', error);
        throw error; // Re-throw to be caught by the component
    }
};



