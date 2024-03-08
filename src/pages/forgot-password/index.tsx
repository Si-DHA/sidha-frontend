import Navbar from "@/app/components/common/navbar";
import Footer from "@/app/components/common/footer";

const ForgotPassword = () => {

    
    return (
        <main className="flex min-h-screen flex-col items-center justify-between" data-theme="winter">
            <Navbar/>
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
                                <input type="email" placeholder="email" className="input input-bordered" required />
                            </div>
                            <div className="form-control mt-6">
                                <button className="btn btn-primary">Send reset link</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Footer/>
        </main>
    );
}

export default ForgotPassword