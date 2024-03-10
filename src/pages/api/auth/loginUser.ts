import { BASE_URL } from '@/app/constant/constant';
import Cookies from 'js-cookie';

export const loginUser = async (email: string, password: string): Promise<any> => {
    try {
        const response = await fetch(BASE_URL+'/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({ email: email, password: password }),
        });
        if (response.ok) {
            Cookies.set('currentUser', await response.json());
            return await response.json();
        } else {
            throw new Error('Email atau password salah');
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};
