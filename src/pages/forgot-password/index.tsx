import Navbar from "@/app/components/common/navbar";
import Footer from "@/app/components/common/footer";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { forgotPassword } from "../api/auth/forgotPassword";
import Cookies from 'js-cookie';

const ForgotPassword = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [info, setInfo] = useState('');

    var isLoggedIn = Cookies.get('isLoggedIn');

    if (isLoggedIn) {
        useEffect(() => {
            router.push('/dashboard');
        }, [])
    }

    const handleForgorPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (email === '') throw new Error('Email is required')
            console.log(await forgotPassword(email));
            setInfo('Reset link has been sent to your email');
        } catch (error: any) {
            setError(error.message);
        }
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-between" data-theme="winter">
            <Navbar />
            <div className="hero min-h-screen bg-base-200">
                <div className="hero-content flex-col lg:flex-row-reverse">
                    <div className="text-center lg:text-left">
                        <h1 className="text-5xl font-bold">Forgot your password?</h1>
                        <p className="py-6">Don't worry! We got you covered. Just enter your email and we will send you a link to reset your password.</p>
                    </div>
                    <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                        <form className="card-body">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Email</span>
                                </label>
                                <input type="email" placeholder="email" className="input input-bordered" required value={email} onChange={e => setEmail(e.target.value)} />
                            </div>
                            {error && <div className="text-red-500">{error}</div>}
                            <div className="form-control mt-6">
                                <button className="btn btn-primary" onClick={handleForgorPassword}>Send reset link</button>
                            </div>
                        {info && <div className="card-footer text-green-500 text-center">{info}</div>}
                        </form>
                    </div>

                </div>
            </div>
            <Footer />
        </main>
    );
}

export default ForgotPassword