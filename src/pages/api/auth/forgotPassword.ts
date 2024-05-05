import { BASE_URL } from "@/app/constant/constant"


export const forgotPassword = async (email: string): Promise<any> => {
    try {
        const response = await fetch(BASE_URL + "/auth/forgot-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({ email: email }),
        });
        var data = await response.json();
        if (response.ok) {
            return data;
        } else {
            throw new Error(data.message)
        }
    } catch (error: any) {
        throw new Error(error.message)
    }
}