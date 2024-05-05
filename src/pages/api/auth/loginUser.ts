import { BASE_URL } from '@/app/constant/constant';
import Cookies from 'js-cookie';

export const loginUser = async (email: string, password: string): Promise<any> => {
    try {
        const response : any = await fetch(BASE_URL+'/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({ email: email, password: password }),
        });
        var data = await response.json();
        if (response.ok) {
            setLogin(data);
            return data;
        } else {
            throw new Error(data.message);
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};

const setLogin = (data: any) => {
    Cookies.set("idUser", data.content.user.id);
    Cookies.set("token", data.content.token);
    Cookies.set("role", data.content.user.role);
    Cookies.set('isLoggedIn', 'true');
    Cookies.set('name', data.content.user.name);

    if (data.content.user.role === 'KLIEN') {
        Cookies.set('companyName', data.content.user.companyName);
    } 
}