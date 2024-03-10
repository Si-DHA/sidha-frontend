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
        if (response.ok) {
            var data = await response.json();
            setLogin(data);
            return data;
        } else {
            return data['message'];
        }
    } catch (error: any) {
        return error.message;
    }
};

const setLogin = (data: any) => {
    Cookies.set('currentUser', data);
    Cookies.set('isLoggedIn', 'true');
}