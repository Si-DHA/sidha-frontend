import Drawer from "@/app/components/common/drawer";
import FixedDrawer from "@/app/components/common/drawer";
import Footer from "@/app/components/common/footer"
import Navbar from "@/app/components/common/navbar"
import Cookies from 'js-cookie';
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const DashboardPage = () => {

    var isLoggedIn = Cookies.get('isLoggedIn');
    const [userRole, setUserRole] = useState('');
    const router = useRouter();

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/login');
        }
        const role = Cookies.get('role');
        setUserRole(role || '');
    },)


    return (
        <main className="flex min-h-screen flex-col items-center justify-between" data-theme="winter">
            <Drawer userRole={userRole}>
                <div className="flex flex-col justify-center items-center mih-h-screen">
                    <div className="flex flex-row justify-center ">
                        <div className="stats shadow">

                            <div className="stat">
                                <div className="stat-title">Total Pelanggan Baru</div>
                                <div className="stat-value">89,400</div>
                                <div className="stat-desc">21% lebih banyak dari bulan lalu</div>
                            </div>

                        </div>
                        <div className="stats shadow">

                            <div className="stat">
                                <div className="stat-title">Total Transaksi</div>
                                <div className="stat-value">89,400</div>
                                <div className="stat-desc">10% lebih banyak dari minggu lalu</div>
                            </div>

                        </div>
                    </div>
                    <div className="flex flex-row justify-center mx-sm gap-y-5">
                        <div className="stats shadow m-5">

                            <div className="stat bg-neutral text-white">
                                <div className="stat-figure text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                </div>
                                <div className="stat-title text-accent">Pendapatan</div>
                                <div className="stat-value t">31 Jt</div>
                                <div className="stat-desc">Jan 1st - Feb 1st</div>
                            </div>

                            <div className="stat bg-neutral text-white">
                                <div className="stat-figure text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" fill="#ffffff" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                                </div>
                                <div className="stat-title text-accent ">Order</div>
                                <div className="stat-value text-white">4,200</div>
                                <div className="stat-desc">↗︎ 400 (22%)</div>
                            </div>

                            <div className="stat bg-neutral text-white">
                                <div className="stat-figure text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
                                </div>
                                <div className="stat-title text-accent">Kecelakaan</div>
                                <div className="stat-value">0</div>
                                <div className="stat-desc">↘︎ 100 (14%)</div>
                            </div>

                        </div>
                    </div>
                </div>
            </Drawer>
            <Footer />
        </main>
    );
}

export default DashboardPage