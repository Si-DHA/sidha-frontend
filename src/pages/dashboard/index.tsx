import Footer from "@/app/components/common/footer"
import Navbar from "@/app/components/common/navbar"

const DashboardPage = () => {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between" data-theme="winter">
            <Navbar />
            <div className="hero min-h-screen bg-base-200">
                <div className="hero-content flex-col lg:flex-row-reverse">
                    <div className="text-center lg:text-left">
                        <h1 className="text-5xl font-bold">Selamat datang di dashboard!</h1>
                        <p className="py-6">Anda dapat mengakses berbagai fitur yang tersedia di dashboard ini. Silahkan pilih menu yang Anda inginkan.</p>
                    </div>
                </div>
            </div>            
            <Footer/>
        </main>
    )
}

export default DashboardPage