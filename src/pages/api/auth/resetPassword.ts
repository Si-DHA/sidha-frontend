import { BASE_URL } from "@/app/constant/constant";

export const resetPassword = async (password: string, token: string): Promise<any> => {
    try {
        const response : any = await fetch(BASE_URL +
             "/auth/reset-password" +
                "?token=" + token +
                "&password=" + password, {
            method: "POST",
        });
        var data = await response.json();
        if (response.ok) {
            return data
        } else {
            throw new Error(data.message);
        }
    } catch (error : any) {
        throw new Error(error.message)
    }
}