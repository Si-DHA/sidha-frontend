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
import { getTotalNewClient } from "../api/dashboard/user/getTotalNewClient";
import { getTotalRevenue } from "../api/dashboard/order/getTotalRevenue";
import { getTotalInsiden } from "../api/dashboard/insiden/getTotalInsiden";
import { getWeeklyTotalNewClientnMonth } from "../api/dashboard/user/getWeeklyTotalNewClientnMonth";
import { getWeeklyRevenueInMonth } from "../api/dashboard/order/getWeeklyRevenueInMonth";
import { getTotalCompletedOrder } from "../api/dashboard/order/getCompletedOrder";
import { getYearlyRevenueInRange } from "../api/dashboard/order/getYearlyRevenueInRange";
import { getMonthlyRevenueInYear } from "../api/dashboard/order/getMonthlyRevenueinYear";
import { getMonthlyTotalInsidenInYear } from "../api/dashboard/insiden/getMonthlyTotalInsidenInYear";
import { getWeeklyTotalInsidenInMonth } from "../api/dashboard/insiden/getWeeklyTotalInsidenInMonth";
import { getYearlyTotalInsidenInRange } from "../api/dashboard/insiden/getYearlyTotalInsidenInRange";
import { getMonthlyTotalNewClientInYear } from "../api/dashboard/user/getMonthlyTotalNewClientInYear";
import { getYearlyTotalNewClientInRange } from "../api/dashboard/user/getYearlyTotalNewClientInRange";
import { getWeeklyCompletedOrderInMonth } from "../api/dashboard/order-completed/getWeeklyCompletedOrderInMonth";
import { getMonthlyCompletedOrderInYear } from "../api/dashboard/order-completed/getMonthlyCompletedOrderInYear";
import { getYearlyCompletedOrderInRange } from "../api/dashboard/order-completed/getYearlyCompletedOrderInRange";
import Modal from "@/app/components/common/dashboard-modal";

const inter = Inter({ subsets: ["latin"] });

type ChartReturnValue = {
    data: any;
    options: any;
}
const DashboardPage = () => {


    var isLoggedIn = Cookies.get('isLoggedIn');
    const [userRole, setUserRole] = useState('');
    const [totalClientToday, setTotalClientToday] = useState(0);
    const [totalClientWeek, setTotalClientWeek] = useState(0);
    const [totalClientMonth, setTotalClientMonth] = useState(0);
    const [totalClientYear, setTotalClientYear] = useState(0);
    const [weeklyClient, setWeeklyClient] = useState<ChartReturnValue | null>(null);
    const [monthlyClient, setMonthlyClient] = useState<ChartReturnValue | null>(null);
    const [yearlyClient, setYearlyClient] = useState<ChartReturnValue | null>(null);
    const [totalClientPeriod, setTotalClientPeriod] = useState("week");
    const [totalClientData, setTotalClientData] = useState<ChartReturnValue | null>(null);

    const [totalRevenueToday, setTotalRevenueToday] = useState("");
    const [totalRevenueWeek, setTotalRevenueWeek] = useState("");
    const [totalRevenueMonth, setTotalRevenueMonth] = useState("");
    const [totalRevenueYear, setTotalRevenueYear] = useState("");
    const [weeklyRevenue, setWeeklyRevenue] = useState<ChartReturnValue | null>(null);
    const [monthlyRevenue, setMonthlyRevenue] = useState<ChartReturnValue | null>(null);
    const [yearlyRevenue, setYearlyRevenue] = useState<ChartReturnValue | null>(null);
    const [revenuePeriod, setRevenuePeriod] = useState("week");
    const [revenueData, setRevenueData] = useState<ChartReturnValue | null>(null);;

    const [totalAccidentToday, setTotalAccidentToday] = useState(0);
    const [totalAccidentWeek, setTotalAccidentWeek] = useState(0);
    const [totalAccidentMonth, setTotalAccidentMonth] = useState(0);
    const [totalAccidentYear, setTotalAccidentYear] = useState(0);
    const [weeklyTotalAccident, setWeeklyTotalAccident] = useState<ChartReturnValue | null>(null);
    const [monthlyTotalAccident, setMonthlyTotalAccident] = useState<ChartReturnValue | null>(null);
    const [yearlyTotalAccident, setYearlyTotalAccident] = useState<ChartReturnValue | null>(null);
    const [totalAccidentPeriod, setTotalAccidentPeriod] = useState("week");
    const [totalAccidentData, setTotalAccidentData] = useState<ChartReturnValue | null>(null);;

    const [totalOrderToday, setTotalOrderToday] = useState(0);
    const [totalOrderWeek, setTotalOrderWeek] = useState(0);
    const [totalOrderMonth, setTotalOrderMonth] = useState(0);
    const [totalOrderYear, setTotalOrderYear] = useState(0);
    const [weeklyTotalOrder, setWeeklyTotalOrder] = useState<ChartReturnValue | null>(null);
    const [monthlyTotalOrder, setMonthlyTotalOrder] = useState<ChartReturnValue | null>(null);
    const [yearlyTotalOrder, setYearlyTotalOrder] = useState<ChartReturnValue | null>(null);
    const [totalOrderPeriod, setTotalOrderPeriod] = useState("week");
    const [totalOrderData, setTotalOrderData] = useState<ChartReturnValue | null>(null);;
    const [activeSection, setActiveSection] = useState('Pendapatan');


    const [isModalOpen, setIsModalOpen] = useState(false);

    const [modalData, setModalData] = useState([] as { column1: string; column2: string; }[]);

    const handleCardClick = () => {
        // Ambil data untuk tabel di sini, misalnya dari API atau state lain
        const data = [
            { column1: 'value1', column2: 'value2' },
            { column1: 'value3', column2: 'value4' },
            // tambahkan kolom dan data sesuai kebutuhan
        ];
        console.log('Card clicked' +  isModalOpen);
        setModalData(data);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleClick = (sectionName: any) => {
        setActiveSection(sectionName);
    };


    const router = useRouter();

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/login');
        }
        const role = Cookies.get('role');
        setUserRole(role || '');
        if (role == "KLIEN") {
            router.push('/dashboard/klien');
        }


    },)

    useEffect(() => {
        const date = new Date();
        const currentMonth = date.getMonth() + 1; // getMonth() is zero-based, so we add 1
        const currentYear = date.getFullYear();
        getTotalNewClient('today').then((data: any) => {
            setTotalClientToday(data.content);
        });
        getTotalNewClient('week').then((data: any) => {
            setTotalClientWeek(data.content);
        });
        getTotalNewClient('month').then((data: any) => {
            setTotalClientMonth(data.content);
        });
        getTotalNewClient('year').then((data: any) => {
            setTotalClientYear(data.content);
        });
        getTotalRevenue('today').then((data: any) => {
            setTotalRevenueToday(data);
        }
        );
        getTotalRevenue('week').then((data: any) => {
            setTotalRevenueWeek(data);
        }
        );
        getTotalRevenue('month').then((data: any) => {
            setTotalRevenueMonth(data);
        }
        );
        getTotalRevenue('year').then((data: any) => {
            setTotalRevenueYear(data);
        }
        );
        getTotalInsiden('today').then((data: any) => {
            setTotalAccidentToday(data);
        }
        );
        getTotalInsiden('week').then((data: any) => {
            setTotalAccidentWeek(data);
        }
        );
        getTotalInsiden('month').then((data: any) => {
            setTotalAccidentMonth(data);
        }
        );
        getTotalInsiden('year').then((data: any) => {
            setTotalAccidentYear(data);
        }
        );


        getWeeklyTotalNewClientnMonth(currentMonth, currentYear).then((data: any) => {
            setWeeklyClient(data);
        });

        getWeeklyRevenueInMonth(currentMonth, currentYear).then((data: any) => {
            setWeeklyRevenue(data);
        });

        getTotalCompletedOrder('today').then((data: any) => {
            setTotalOrderToday(data);
        });

        getTotalCompletedOrder('week').then((data: any) => {
            setTotalOrderWeek(data);
        });

        getTotalCompletedOrder('month').then((data: any) => {
            setTotalOrderMonth(data);
        });

        getTotalCompletedOrder('year').then((data: any) => {
            setTotalOrderYear(data);
        });

    }, [totalAccidentToday, totalClientToday, totalRevenueToday, totalOrderToday]);


    useEffect(() => {
        const fetchRevenueData = async () => {
            const date = new Date();
            const currentMonth = date.getMonth() + 1; // getMonth() is zero-based, so we add 1
            const currentYear = date.getFullYear();
            if (revenuePeriod == "week") {
                getWeeklyRevenueInMonth(currentMonth, currentYear).then((data: any) => {
                    setRevenueData(data);
                });
            } else if (revenuePeriod == "month") {
                getMonthlyRevenueInYear(currentYear, currentYear).then((data: any) => {
                    setRevenueData(data);
                });
            } else {
                getYearlyRevenueInRange(currentYear - 5, currentYear).then((data: any) => {
                    setRevenueData(data);
                });
            }
        };
        fetchRevenueData();

    }, [revenuePeriod]);

    useEffect(() => {
        const fetchAccidentData = async () => {
            const date = new Date();
            const currentMonth = date.getMonth() + 1; // getMonth() is zero-based, so we add 1
            const currentYear = date.getFullYear();
            if (totalAccidentPeriod == "week") {
                getWeeklyTotalInsidenInMonth(currentMonth, currentYear).then((data: any) => {
                    setTotalAccidentData(data);
                });
            } else if (totalAccidentPeriod == "month") {
                getMonthlyTotalInsidenInYear(currentYear, currentYear).then((data: any) => {
                    setTotalAccidentData(data);
                });
            } else {
                getYearlyTotalInsidenInRange(currentYear - 5, currentYear).then((data: any) => {
                    setTotalAccidentData(data);
                });
            }
        };
        fetchAccidentData();

    }, [totalAccidentPeriod]);

    useEffect(() => {
        const fetchTotalOrder = async () => {
            const date = new Date();
            const currentMonth = date.getMonth() + 1; // getMonth() is zero-based, so we add 1
            const currentYear = date.getFullYear();
            if (totalOrderPeriod == "week") {
                getWeeklyCompletedOrderInMonth(currentMonth, currentYear).then((data: any) => {
                    setTotalOrderData(data);
                });
            } else if (totalOrderPeriod == "month") {
                getMonthlyCompletedOrderInYear(currentYear, currentYear).then((data: any) => {
                    setTotalOrderData(data);
                });
            } else {
                getYearlyCompletedOrderInRange(currentYear - 5, currentYear).then((data: any) => {
                    setTotalOrderData(data);
                });
            }
        };
        fetchTotalOrder();

    }, [totalOrderPeriod]);

    useEffect(() => {
        const fetchTotalNewClientData = async () => {
            const date = new Date();
            const currentMonth = date.getMonth() + 1; // getMonth() is zero-based, so we add 1
            const currentYear = date.getFullYear();
            if (totalClientPeriod == "week") {
                getWeeklyTotalNewClientnMonth(currentMonth, currentYear).then((data: any) => {
                    setTotalClientData(data);
                });
            } else if (totalClientPeriod == "month") {
                getMonthlyTotalNewClientInYear(currentYear, currentYear).then((data: any) => {
                    setTotalClientData(data);
                });
            } else {
                getYearlyTotalNewClientInRange(currentYear - 5, currentYear).then((data: any) => {
                    setTotalClientData(data);
                });
            }
        };
        fetchTotalNewClientData();

    }, [totalClientPeriod]);





    return (
        <main
            className={`flex min-h-screen flex-col ${inter.className}`} data-theme="cmyk"
        >
            <Drawer userRole={userRole}>
                <div className="flex flex-col  min-h-screen" data-theme="cymk">
                    <section className="overall-dashboard-item flex flex-col">
                        <h1 className="text-3xl ml-4">Selamat datang di dashboard</h1>
                        <h3 className="text-l ml-4 mt-8">Rekapitulasi hari ini:</h3>


                        <div className="card-row flex flex-row overflow-x-auto">
                            <div className="card rounded-2xl gap-x-2 p-5 m-5  bg-gray-50">
                                <div className="card-title">Order</div>
                                <div className="card-value">{totalOrderToday}</div>

                            </div>
                            <div className="card rounded-2xl gap-x-2 p-5 m-5  bg-gray-50">
                                <div className="card-title">Klien </div>
                                <div className="card-value">{totalClientToday}</div>
                            </div>
                            <div className="card rounded-2xl gap-x-2 p-5 m-5  bg-gray-50">
                                <div className="card-title">Kecelakaan</div>
                                <div className="card-value">{totalAccidentToday}</div>
                            </div>
                            <div className="card rounded-2xl gap-x-2 p-5 m-5  bg-gray-50">
                                <div className="card-title">Pendapatan</div>
                                <div className="card-value">{totalRevenueToday}</div>
                            </div>
                        </div>
                    </section>

                    {isModalOpen && <Modal data={modalData} closeModal={closeModal} />}

                    <div className="btn btn-primary" onClick={handleCardClick}>
                        Test
                    </div>

                    <section className="p-4">
                        <ul className="menu menu-vertical lg:menu-horizontal bg-base-200 rounded-box">
                            <li className="pr-2 pl-2"><a className={activeSection === 'Pendapatan' ? 'active' : ''} onClick={() => handleClick('Pendapatan')}>Pendapatan</a></li>
                            <li className="pr-2 pl-2"><a className={activeSection === 'Klien Baru' ? 'active' : ''} onClick={() => handleClick('Klien Baru')}>Klien Baru</a></li>
                            <li className="pr-2 pl-2"><a className={activeSection === 'Insiden' ? 'active' : ''} onClick={() => handleClick('Insiden')}>Insiden</a></li>
                            <li className="pr-2 pl-2"><a className={activeSection === 'Order Selesai' ? 'active' : ''} onClick={() => handleClick('Order Selesai')}>Order Selesai</a></li>
                        </ul>
                    </section>


                    {activeSection == "Pendapatan" && (
                        <section className="pendapatan-dashboard-item flex flex-col ">
                            <h1 className="text-3xl ml-4">Statistik Pendapatan</h1>

                            <div className="card-row flex flex-row overflow-x-auto">
                                <div className="card rounded-2xl gap-x-2 p-5 m-5  bg-gray-50">
                                    <div className="card-title">Hari ini</div>
                                    <div className="card-value">{totalRevenueToday}</div>

                                </div>
                                <div className="card rounded-2xl gap-x-2 p-5 m-5  bg-gray-50">
                                    <div className="card-title">Minggu ini </div>
                                    <div className="card-value">{totalRevenueWeek}</div>
                                </div>
                                <div className="card rounded-2xl gap-x-2 p-5 m-5  bg-gray-50">
                                    <div className="card-title">Bulan ini</div>
                                    <div className="card-value">{totalRevenueMonth}</div>
                                </div>
                                <div className="card rounded-2xl gap-x-2 p-5 m-5  bg-gray-50">
                                    <div className="card-title">Tahun ini</div>
                                    <div className="card-value">{totalRevenueYear}</div>
                                </div>
                            </div>
                            <div className="card-row flex flex-row overflow-x-auto">

                                <div className="card rounded-2xl gap-x-2 p-5 m-5 bg-grey-300">
                                    <div className="card-title">Grafik</div>
                                    <div className="card-content mt-4 gap-x-10 pb-5">
                                        Pilih rentang waktu :
                                        <br />
                                        <select className="select select-success w-50% max-w-xs" value={revenuePeriod} onChange={(e) => setRevenuePeriod(e.target.value)}>
                                            <option value="week">Minggu</option>
                                            <option value="month">Bulan</option>
                                            <option value="year">Tahun</option>

                                        </select>
                                    </div>

                                    <div className="card-chart flex-col min-w-[500px]">

                                        {revenueData && <BarChart data={revenueData.data} options={revenueData.options} />}
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {activeSection === "Insiden" && (
                        <section className="jumlah-insiden-dashboard-item flex flex-col ">
                            <h1 className="text-3xl ml-4">Statistik Jumlah Insiden</h1>

                            <div className="card-row flex flex-row overflow-x-auto">
                                <div className="card rounded-2xl gap-x-2 p-5 m-5  bg-gray-50">
                                    <div className="card-title">Hari ini</div>
                                    <div className="card-value">{totalAccidentToday}</div>

                                </div>
                                <div className="card rounded-2xl gap-x-2 p-5 m-5  bg-gray-50">
                                    <div className="card-title">Minggu ini </div>
                                    <div className="card-value">{totalAccidentWeek}</div>
                                </div>
                                <div className="card rounded-2xl gap-x-2 p-5 m-5  bg-gray-50">
                                    <div className="card-title">Bulan ini</div>
                                    <div className="card-value">{totalAccidentMonth}</div>
                                </div>
                                <div className="card rounded-2xl gap-x-2 p-5 m-5  bg-gray-50">
                                    <div className="card-title">Tahun ini</div>
                                    <div className="card-value">{totalAccidentYear}</div>
                                </div>
                            </div>
                            <div className="card-row flex flex-row overflow-x-auto">

                                <div className="card rounded-2xl gap-x-2 p-5 m-5 bg-grey-300">
                                    <div className="card-title">Grafik</div>
                                    <div className="card-content mt-4 gap-x-10 pb-5">
                                        Pilih rentang waktu :
                                        <br />
                                        <select className="select select-success w-50% max-w-xs" value={totalAccidentPeriod} onChange={(e) => setTotalAccidentPeriod(e.target.value)}>
                                            <option value="week">Minggu</option>
                                            <option value="month">Bulan</option>
                                            <option value="year">Tahun</option>

                                        </select>
                                    </div>

                                    <div className="card-chart flex-col min-w-[500px]">

                                        {totalAccidentData && <BarChart data={totalAccidentData.data} options={totalAccidentData.options} />}
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {activeSection == "Klien Baru" && (
                        <section className="jumlah-user-baru-dashboard-item flex flex-col ">
                            <h1 className="text-3xl ml-4">Statistik Jumlah Klien Baru</h1>

                            <div className="card-row flex flex-row overflow-x-auto">
                                <div className="card rounded-2xl gap-x-2 p-5 m-5  bg-gray-50">
                                    <div className="card-title">Hari ini</div>
                                    <div className="card-value">{totalClientToday}</div>

                                </div>
                                <div className="card rounded-2xl gap-x-2 p-5 m-5  bg-gray-50">
                                    <div className="card-title">Minggu ini </div>
                                    <div className="card-value">{totalClientWeek}</div>
                                </div>
                                <div className="card rounded-2xl gap-x-2 p-5 m-5  bg-gray-50">
                                    <div className="card-title">Bulan ini</div>
                                    <div className="card-value">{totalClientMonth}</div>
                                </div>
                                <div className="card rounded-2xl gap-x-2 p-5 m-5  bg-gray-50">
                                    <div className="card-title">Tahun ini</div>
                                    <div className="card-value">{totalClientYear}</div>
                                </div>
                            </div>
                            <div className="card-row flex flex-row overflow-x-auto">

                                <div className="card rounded-2xl gap-x-2 p-5 m-5 bg-grey-300">
                                    <div className="card-title">Grafik</div>
                                    <div className="card-content mt-4 gap-x-10 pb-5">
                                        Pilih rentang waktu :
                                        <br />
                                        <select className="select select-success w-50% max-w-xs" value={totalClientPeriod} onChange={(e) => setTotalClientPeriod(e.target.value)}>
                                            <option value="week">Minggu</option>
                                            <option value="month">Bulan</option>
                                            <option value="year">Tahun</option>

                                        </select>
                                    </div>

                                    <div className="card-chart flex-col min-w-[500px]">

                                        {totalClientData && <BarChart data={totalClientData.data} options={totalClientData.options} />}
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {activeSection === "Order Selesai" && (

                        <section className="jumlah-completed-order-dashboard-item flex flex-col ">
                            <h1 className="text-3xl ml-4">Statistik Jumlah Order Selesai</h1>

                            <div className="card-row flex flex-row overflow-x-auto">
                                <div className="card rounded-2xl gap-x-2 p-5 m-5  bg-gray-50">
                                    <div className="card-title">Hari ini</div>
                                    <div className="card-value">{totalOrderToday}</div>

                                </div>
                                <div className="card rounded-2xl gap-x-2 p-5 m-5  bg-gray-50">
                                    <div className="card-title">Minggu ini </div>
                                    <div className="card-value">{totalOrderWeek}</div>
                                </div>
                                <div className="card rounded-2xl gap-x-2 p-5 m-5  bg-gray-50">
                                    <div className="card-title">Bulan ini</div>
                                    <div className="card-value">{totalOrderMonth}</div>
                                </div>
                                <div className="card rounded-2xl gap-x-2 p-5 m-5  bg-gray-50">
                                    <div className="card-title">Tahun ini</div>
                                    <div className="card-value">{totalOrderYear}</div>
                                </div>
                            </div>
                            <div className="card-row flex flex-row overflow-x-auto">

                                <div className="card rounded-2xl gap-x-2 p-5 m-5 bg-grey-300">
                                    <div className="card-title">Grafik</div>
                                    <div className="card-content mt-4 gap-x-10 pb-5">
                                        Pilih rentang waktu :
                                        <br />
                                        <select className="select select-success w-50% max-w-xs" value={totalOrderPeriod} onChange={(e) => setTotalOrderPeriod(e.target.value)}>
                                            <option value="week">Minggu</option>
                                            <option value="month">Bulan</option>
                                            <option value="year">Tahun</option>

                                        </select>
                                    </div>

                                    <div className="card-chart flex-col min-w-[500px]">

                                        {totalOrderData && <BarChart data={totalOrderData.data} options={totalOrderData.options} />}
                                    </div>
                                </div>
                            </div>
                        </section>

                    )}

                </div>
            </Drawer>
            <Footer />
        </main>
    );
}

export default DashboardPage