import Drawer from "@/app/components/common/drawer";
import FixedDrawer from "@/app/components/common/drawer";
import Footer from "@/app/components/common/footer"
import Navbar from "@/app/components/common/navbar"
import Cookies from 'js-cookie';
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BarChart } from "@/app/components/common/chart/barchart";
import { EditableChart } from "@/app/components/common/chart/editableChart";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

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

    const data = [
        ["Age", "Weight"],
        ["Week 1", 12],
        ["Week 2", 5.5],
        ["Week 3", 14],
    ];

    const options = {
        chart: {
            title: "Company Performance",
            subtitle: "Sales, Expenses, and Profit: 2014-2017",
        },
    };

    const dataProp = [
        ["Age", "Weight"],
        ["Week 1", 12],
        ["Week 2", 5.5],
        ["Week 3", 14],
        ["Week 1", 12],
        ["Week 2", 5.5],
        ["Week 3", 14],
        ["Week 1", 12],
        ["Week 2", 5.5],
        ["Week 3", 14],
        ["Week 1", 12],
        ["Week 2", 5.5],
        ["Week 3", 14],
    ];

    const optionsProp = {
        title: "Age vs. Weight comparison",
        hAxis: { title: "Age", minValue: 0, maxValue: 15 },
        vAxis: { title: "Weight", minValue: 0, maxValue: 15 },
        legend: "none",
    };


    return (
        <main
        className={`flex min-h-screen flex-col ${inter.className}`} data-theme="cmyk"
      >
            <Drawer userRole={userRole}>
                <div className="flex flex-col  min-h-screen" data-theme="cymk">
                    <section className="overall-dashboard-item flex flex-col">
                        <h1 className="text-3xl ml-4">Selamat datang di dashboard</h1>

                        <div className="card-row flex flex-row">
                            <div className="card rounded-2xl gap-x-2 p-5 m-5  bg-gray-50">
                                <div className="card-title">Order hari ini</div>
                                <div className="card-value">10</div>

                            </div>
                            <div className="card rounded-2xl gap-x-2 p-5 m-5  bg-gray-50">
                                <div className="card-title">Klien baru hari ini</div>
                                <div className="card-value">10</div>
                            </div>
                            <div className="card rounded-2xl gap-x-2 p-5 m-5  bg-gray-50">
                                <div className="card-title">Kecelakan hari ini</div>
                                <div className="card-value">10</div>
                            </div>
                            <div className="card rounded-2xl gap-x-2 p-5 m-5  bg-gray-50">
                                <div className="card-title">Pendapatan hari ini</div>
                                <div className="card-value">10</div>
                            </div>
                        </div>
                    </section>

                    <section className="pendapatan-dashboard-item flex flex-col ">
                        <h1 className="text-3xl ml-4">Grafik pendapatan</h1>

                        <div className="card-row flex flex-row overflow-x-auto">

                            <div className="card rounded-2xl gap-x-2 p-5 m-5 min-w-[500px] bg-white justify-center">
                                <BarChart data={data} options={options} width="100%" height="300px" />
                                <div className="card-value">
                                </div>

                            </div>
                            <div className="card rounded-2xl gap-x-2 p-5 m-5   bg-white">
                                <div className="card-title">Kecelakan hari ini</div>
                                <EditableChart data={dataProp} options={optionsProp} />

                            </div>



                            <section className="bento-card mx-auto ">
                                <div className="flex flex-row">
                                    <div className="w-3/7 bg-gray-200 p-4 rounded-2xl gap-x-2 m-4">
                                        <div className="card-title">Hari ini</div>
                                        <div className="card-value">10</div>
                                    </div>
                                    <div className="w-4/7 bg-gray-300 p-4 rounded-2xl gap-x-2 m-4">
                                        <div className="card-title">Minggu ini</div>
                                        <div className="card-value">10</div>
                                    </div>
                                </div>

                                <div className="flex flex-row justify-between">
                                    <div className="w-2/7 bg-gray-200 p-4 rounded-2xl gap-x-2 m-4">
                                        <div className="card-title">Bulan ini</div>
                                        <div className="card-value">10</div>
                                    </div>
                                    <div className="w-5/7 bg-gray-300 p-4 rounded-2xl gap-x-2 m-4">
                                        <div className="card-title">Tahun ini</div>
                                        <div className="card-value">10</div>
                                    </div>
                                </div>
                            </section>

                        </div>





                    </section>

                </div>
            </Drawer>
            <Footer />
        </main>
    );
}

export default DashboardPage