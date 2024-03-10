import Footer from "@/app/components/common/footer";
import Navbar from "@/app/components/common/navbar";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { resetPassword } from "../api/auth/resetPassword";
import Cookies from 'js-cookie';

const ResetPasswordPage = () => {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [info, setInfo] = useState('');
    const { token } = router.query;

    var isLoggedIn = Cookies.get('isLoggedIn');

    if (isLoggedIn) {
        useEffect(() => {
            router.push('/dashboard');
        }, [])
    }

    useEffect(() => {
        console.log('Token:', token);
    }, [token]);

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (password === '') throw new Error('Password is required');
            if (password !== confirmPassword) throw new Error('Password does not match');
            setInfo('Password has been reset');
            console.log('Password:',
                password, 'Confirm Password', confirmPassword, 'Token:', token);
            console.log(await resetPassword(password, token as string));
                // setTimeout(() => {
            //     router.push('/login');
            // }, 3000);
        } catch (error: any) {
            setError(error.message);
        }
    }

    return (<main className="flex min-h-screen flex-col items-center justify-between" data-theme="winter">
        <Navbar />
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content flex-col lg:flex-row-reverse">
                <div className="text-center lg:text-left">
                    <h1 className="text-5xl font-bold">Reset your password</h1>
                    <p className="py-6">Enter your new password and confirm it to reset your password.</p>
                </div>
                <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                    <form className="card-body">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <input type="password" placeholder="password" className="input input-bordered" required value={password} onChange={e => setPassword(e.target.value)} />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Confirm Password</span>
                            </label>
                            <input type="password" placeholder="confirm password" className="input input-bordered" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                        </div>
                        {error && <div className="text-red-500">{error}</div>}
                        <div className="form-control mt-6">
                            <button className="btn btn-primary" onClick={handleResetPassword}>Send reset link</button>
                        </div>
                        {info && <div className="card-footer text-green-500 text-center">{info}</div>}
                    </form>
                </div>

            </div>
        </div>
        <Footer />
    </main>)
}

export default ResetPasswordPage