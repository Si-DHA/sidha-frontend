import Footer from "@/app/components/common/footer";
import Navbar from "@/app/components/common/navbar";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { loginUser } from "../api/auth/loginUser";
import { WA_URL } from "@/app/constant/constant";
import Link from "next/link";
import Cookies from 'js-cookie';


const LoginPage = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    var isLoggedIn = Cookies.get('isLoggedIn');

    useEffect(() => {
        if (isLoggedIn) {
            router.push('/dashboard');
        }
    },)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const userData = await loginUser(email, password);
            router.push('/dashboard');
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
                        <h1 className="text-5xl font-bold">Login sekarang!</h1>
                        <p className="py-6">Masuk ke akun Anda sekarang untuk memulai pengiriman barang dengan kemudahan dan kenyamanan. Dapatkan akses cepat ke riwayat pengiriman dan layanan pelanggan yang responsif.</p>
                    </div>
                    <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                        <form className="card-body" onSubmit={handleLogin}>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Email</span>
                                </label>
                                <input type="email" placeholder="email" className="input input-bordered" required value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Password</span>
                                </label>
                                <input type={showPassword ? 'text' : 'password'} placeholder="password" className="input input-bordered" required value={password} onChange={(e) => setPassword(e.target.value)} />
                                <label className="label">
                                    <Link href="/forgot-password" className="label-text-alt link link-hover">Forgot password?</Link>
                                    <button type="button" className="label-text-alt " onClick={togglePasswordVisibility}>{showPassword ? 'Hide' : 'Show'}</button>
                                </label>
                            </div>
                            {error && <div className="text-red-500">{error}</div>}
                            <div className="form-control mt-6">
                                <button className="btn btn-primary" type="submit">Login</button>
                                <div className="divider">Belum punya akun?</div>
                                <Link className="btn btn-outline btn-primary" href={WA_URL}>Whatsapp Kami</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
export default LoginPage