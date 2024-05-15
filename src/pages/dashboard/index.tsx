import Drawer from "@/app/components/common/drawer";
import Footer from "@/app/components/common/footer"
import Cookies from 'js-cookie';
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BarChart } from "@/app/components/common/chart/barchart";
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
import { getListNewClient } from "../api/dashboard/user/getListNewClient";
import DataTable from "@/app/components/common/datatable/DataTable";
import {getListCompletedOrders} from "../api/dashboard/order-completed/getListCompletedOrder";
import { getListInsiden } from "../api/dashboard/insiden/getListInsiden";
import { getListRevenue } from "../api/dashboard/order/getListRevenue";


const inter = Inter({ subsets: ["latin"] });

type ChartReturnValue = {
    data: any;
    options: any;
}

function toTitleCase(str: String) {
    if (!str) return str;
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price);
};

const getStatusDescription = (statusCode: any) => {
    switch (statusCode) {
      case -1:
        return 'Ditolak';
      case 0:
        return 'Menunggu Konfirmasi';
      case 1:
        return 'Dikonfirmasi';
      case 2:
        return 'Menunggu DP';
      case 3:
        return 'Dalam Perjalanan';
      case 4:
        return 'Sampai (Menunggu Pelunasan)';
      case 5:
        return 'Selesai';
      default:
        return 'Unknown Status';
    }
  };

const DashboardPage = () => {


    var isLoggedIn = Cookies.get('isLoggedIn');
    const [loading, setLoading] = useState(true)
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
    const [clientTimeRange, setClientTimeRange] = useState("week");
    const [listClientData, setListClientData] = useState(null);

    const [totalRevenueToday, setTotalRevenueToday] = useState("");
    const [totalRevenueWeek, setTotalRevenueWeek] = useState("");
    const [totalRevenueMonth, setTotalRevenueMonth] = useState("");
    const [totalRevenueYear, setTotalRevenueYear] = useState("");
    const [weeklyRevenue, setWeeklyRevenue] = useState<ChartReturnValue | null>(null);
    const [monthlyRevenue, setMonthlyRevenue] = useState<ChartReturnValue | null>(null);
    const [yearlyRevenue, setYearlyRevenue] = useState<ChartReturnValue | null>(null);
    const [revenuePeriod, setRevenuePeriod] = useState("week");
    const [revenueData, setRevenueData] = useState<ChartReturnValue | null>(null);;
    const [revenueTimeRange, setRevenueTimeRange] = useState("week");
    const [listRevenueData, setListRevenueData] = useState(null);

    const [totalAccidentToday, setTotalAccidentToday] = useState(0);
    const [totalAccidentWeek, setTotalAccidentWeek] = useState(0);
    const [totalAccidentMonth, setTotalAccidentMonth] = useState(0);
    const [totalAccidentYear, setTotalAccidentYear] = useState(0);
    const [weeklyTotalAccident, setWeeklyTotalAccident] = useState<ChartReturnValue | null>(null);
    const [monthlyTotalAccident, setMonthlyTotalAccident] = useState<ChartReturnValue | null>(null);
    const [yearlyTotalAccident, setYearlyTotalAccident] = useState<ChartReturnValue | null>(null);
    const [totalAccidentPeriod, setTotalAccidentPeriod] = useState("week");
    const [totalAccidentData, setTotalAccidentData] = useState<ChartReturnValue | null>(null);;
    const [accidentTimeRange, setAccidentTimeRange] = useState("week");
    const [listAccidentData, setListAccidentData] = useState(null);

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
    const [orderTimeRange, setOrderTimeRange] = useState("week");
    const [listOrderData, setListOrderData] = useState(null);



    const [isModalOpen, setIsModalOpen] = useState(false);

    const [modalData, setModalData] = useState([] as { column1: string; column2: string; }[]);

    const handleCardClick = () => {
        // Ambil data untuk tabel di sini, misalnya dari API atau state lain
        const data = [
            { column1: 'value1', column2: 'value2' },
            { column1: 'value3', column2: 'value4' },
            // tambahkan kolom dan data sesuai kebutuhan
        ];
        console.log('Card clicked' + isModalOpen);
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

    useEffect(() => {
        const fetchListClientByTimeRange = async () => {
            const result = getListNewClient(clientTimeRange);
            setListClientData(await result);
            setLoading(false);
        };
        fetchListClientByTimeRange();

    }, [listClientData, clientTimeRange]);

    const handleShowListClient = (timeRange: string) => {
        setClientTimeRange(timeRange);
        const dialog = document.getElementById('client_modal') as HTMLDialogElement;
        dialog.showModal();
    }




    const userColumns = [{
        Header: 'Nama', accessor: 'name',
    }, {
        Header: 'Email', accessor: 'email',
    }, {
        Header: 'Dibuat tanggal', accessor: (row: any) => {
            // Use updatedAt if available; otherwise, use createdAt
            const dateToFormat = row.createdAt;
            // Create a Date object
            const date = new Date(dateToFormat);
            // Format the date and time
            const formattedDate = date.toLocaleString('id-ID', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
            });
            return formattedDate;
        },
    }, {
        Header: 'Alamat', accessor: 'address',
    }, {
        Header: 'Nomor HP', accessor: 'phone',
    }, {
        Header: 'Status',
        accessor: 'isDeleted',
        Cell: ({ value }: { value: any }) => value ? <div className="badge badge-error text-xs">Tidak Aktif</div> : <div className="badge badge-success text-xs">Aktif</div>
    },]




    useEffect(() => {
        const fetctListCompletedOrder = async () => {
            const result = getListCompletedOrders(orderTimeRange);
            setListOrderData(await result);
            setLoading(false);
        };
        fetctListCompletedOrder();

    }, [listOrderData, orderTimeRange]);

    const handleShowListOrder = (timeRange: string) => {
        setOrderTimeRange(timeRange);
        const dialog = document.getElementById('order_modal') as HTMLDialogElement;
        dialog.showModal();
    }

    const orderColumns = [{
        Header: 'ID Order Item',
        accessor: 'id',
    },
    { Header: 'Terakhir diubah', accessor: (row: any) => {
        // Use updatedAt if available; otherwise, use createdAt
        const dateToFormat = row.updatedAt;
        // Create a Date object
        const date = new Date(dateToFormat);
        // Format the date and time
        const formattedDate = date.toLocaleString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });
        return formattedDate;
    }},
    {
        Header: 'Ongkos Kirim',
        accessor: 'price',
        Cell: ({ value }: { value: any }) => formatPrice(value),
    },
    {
        Header: 'Pecah Belah',
        accessor: 'isPecahBelah',
        Cell: ({ value }: { value: any }) => (value ? 'Yes' : 'No'),
    },
    {
        Header: 'Tipe Barang',
        accessor: 'tipeBarang',
    },
    {
        Header: 'Tipe Truk',
        accessor: 'tipeTruk',
    },
    {
        Header: 'Rute',
        accessor: 'rute',
        Cell: ({ value }) => (
            <ul>
                {value && Array.isArray(value) ? value.map((route, index) => (
                    <li key={index}>
                        {route.source} - {route.destination}
                    </li>
                )) : null}
            </ul>
        ),
    }]

    useEffect(() => {
        const fetchListAccident = async () => {
            const result = getListInsiden(accidentTimeRange);
            setListAccidentData(await result);
            setLoading(false);
        };
        fetchListAccident();

    }, [listAccidentData, accidentTimeRange]);

    const handleShowListAccident = (timeRange: string) => {
        setAccidentTimeRange(timeRange);
        const dialog = document.getElementById('accident_modal') as HTMLDialogElement;
        dialog.showModal();
    }

    const accidentColumns = [{
        Header: 'Kategori',
        accessor: 'kategori',
    },
    {
        Header: 'Lokasi',
        accessor: 'lokasi',
    },
    {
        Header: 'Keterangan',
        accessor: 'keterangan',
    },
    {
        Header: 'Status',
        accessor: 'status',
    },
    { Header: 'Dibuat tanggal', accessor: (row: any) => {
        // Use updatedAt if available; otherwise, use createdAt
        const dateToFormat = row.createdAt;
        // Create a Date object
        const date = new Date(dateToFormat);
        // Format the date and time
        const formattedDate = date.toLocaleString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });
        return formattedDate;
    }},
    
    {
        Header: 'Rute',
        accessor: 'orderItem.rute',
        Cell: ({ value }: { value: any }) => (
            <ul>
                {value && Array.isArray(value) ? value.map((route: any, index: number) => (
                    <li key={index}>
                        {route.source} - {route.destination}
                    </li>
                )) : null}
            </ul>
        ),
    }]

    useEffect(() => {
        const fetchListRevenue = async () => {
            const result = getListRevenue(revenueTimeRange);
            setListRevenueData(await result);
            setLoading(false);
        };
        fetchListRevenue();

    }, [listRevenueData, revenueTimeRange]);

    const handleShowListRevenue = (timeRange: string) => {
        setRevenueTimeRange(timeRange);
        const dialog = document.getElementById('revenue_modal') as HTMLDialogElement;
        dialog.showModal();
    }


    const revenueColumns = [{
        Header: 'ID Order Item',
        accessor: 'orderItem.id',
    },
    { Header: 'Terakhir diubah', accessor: (row: any) => {
        // Use updatedAt if available; otherwise, use createdAt
        const dateToFormat = row.orderItem.updatedAt;
        // Create a Date object
        const date = new Date(dateToFormat);
        // Format the date and time
        const formattedDate = date.toLocaleString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });
        return formattedDate;
    }},
    {
        Header: 'Pendapatan',
        accessor: 'price',
        Cell: ({ value }: { value: any }) => formatPrice(value),
    },
    {
        Header: 'Pecah Belah',
        accessor: 'orderItem.isPecahBelah',
        Cell: ({ value }: { value: any }) => (value ? 'Yes' : 'No'),
    },
    {
        Header: 'Tipe Barang',
        accessor: 'orderItem.tipeBarang',
    },
    {
        Header: 'Tipe Truk',
        accessor: 'orderItem.tipeTruk',
    },
    {
        Header: 'Rute',
        accessor: 'orderItem.rute',
        Cell: ({ value }) => (
            <ul>
                {value && Array.isArray(value) ? value.map((route, index) => (
                    <li key={index}>
                        {route.source} - {route.destination}
                    </li>
                )) : null}
            </ul>
        ),
    }, {
        Header: 'Status',
        accessor: 'orderItem.statusOrder',
        Cell: ({ value }: { value: any }) => getStatusDescription(value),
    }]



    return (
        <main
            className={`flex min-h-screen flex-col ${inter.className}`} data-theme="cmyk"
        >
            <Drawer userRole={userRole}>


                {listClientData && (<dialog id="client_modal" className="modal ">
                    <div className="modal-box w-11/12 max-w-5xl">
                        <h3 className="font-bold text-lg">Data Klien</h3>
                        <div className="overflow-x-auto">
                            <DataTable
                                columns={userColumns}
                                data={listClientData}
                                loading={loading}
                                type="user" />

                        </div>

                        <div className="modal-action">
                            <button className="btn mr-2" onClick={() => document.getElementById('client_modal').close()}>Tutup</button>
                        </div>
                    </div>
                </dialog>)}

                {listOrderData && (<dialog id="order_modal" className="modal ">
                    <div className="modal-box w-11/12 max-w-5xl">
                        <h3 className="font-bold text-lg">Data Order</h3>
                        <div className="overflow-x-auto">
                            <DataTable
                                columns={orderColumns}
                                data={listOrderData}
                                loading={loading}
                            />

                        </div>

                        <div className="modal-action">
                            <button className="btn mr-2" onClick={() => document.getElementById('order_modal').close()}>Tutup</button>
                        </div>
                    </div>
                </dialog>)}

                {listAccidentData && (<dialog id="accident_modal" className="modal ">
                    <div className="modal-box w-11/12 max-w-5xl">
                        <h3 className="font-bold text-lg">Data Insiden</h3>
                        <div className="overflow-x-auto">
                            <DataTable
                                columns={accidentColumns}
                                data={listAccidentData}
                                loading={loading}
                            />

                        </div>

                        <div className="modal-action">
                            <button className="btn mr-2" onClick={() => document.getElementById('accident_modal').close()}>Tutup</button>
                        </div>
                    </div>
                </dialog>)}

                {listRevenueData && (<dialog id="revenue_modal" className="modal ">
                    <div className="modal-box w-11/12 max-w-5xl">
                        <h3 className="font-bold text-lg">Data Pendapatan</h3>
                        <div className="overflow-x-auto">
                            <DataTable
                                columns={revenueColumns}
                                data={listRevenueData}
                                loading={loading}
                            />
                        </div>
                        <div className="modal-action">
                            <button className="btn mr-2" onClick={() => document.getElementById('revenue_modal').close()}>Tutup</button>
                        </div>
                    </div>
                </dialog>)}
                <div className="flex flex-col  min-h-screen" data-theme="cymk">
                    <section className="overall-dashboard-item flex flex-col">
                        <h1 className="text-3xl ml-4 font-bold">Selamat datang di dashboard</h1>
                        <h3 className="text-l ml-4 mt-8 font-semibold">Rekapitulasi hari ini:</h3>


                        <div className="card-row flex flex-row overflow-x-auto">
                            <div className="card rounded-2xl gap-x-2 p-5 m-5  bg-gray-100"  onClick={() => handleShowListOrder("today")} >
                                <div className="card-title">Order</div>
                                <div className="card-value">{totalOrderToday}</div>

                            </div>
                            <div className="card rounded-2xl gap-x-2 p-5 m-5  bg-gray-100" onClick={() => handleShowListClient("today")}>
                                <div className="card-title">Klien </div>
                                <div className="card-value">{totalClientToday}</div>
                            </div>
                            <div className="card rounded-2xl gap-x-2 p-5 m-5  bg-gray-100" onClick={() => handleShowListAccident("today")}>
                                <div className="card-title">Insiden</div>
                                <div className="card-value">{totalAccidentToday}</div>
                            </div>
                            <div className="card rounded-2xl gap-x-2 p-5 m-5  bg-gray-100" onClick={() => handleShowListRevenue("today")}>
                                <div className="card-title">Pendapatan</div>
                                <div className="card-value">{totalRevenueToday}</div>
                            </div>
                        </div>
                    </section>


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
                            <h1 className="text-3xl ml-4 font-bold">Statistik Pendapatan</h1>

                            <div className="card-row flex flex-row overflow-x-auto">
                                <div className="card rounded-2xl gap-x-2 p-5 m-5  bg-gray-100" onClick={() => handleShowListRevenue("today")}>
                                    <div className="card-title">Hari ini</div>
                                    <div className="card-value">{totalRevenueToday}</div>

                                </div>
                                <div className="card rounded-2xl gap-x-2 p-5 m-5  bg-gray-100" onClick={() => handleShowListRevenue("week")}>
                                    <div className="card-title">Minggu ini </div>
                                    <div className="card-value">{totalRevenueWeek}</div>
                                </div>
                                <div className="card rounded-2xl gap-x-2 p-5 m-5  bg-gray-100" onClick={() => handleShowListRevenue("month")}>
                                    <div className="card-title">Bulan ini</div>
                                    <div className="card-value">{totalRevenueMonth}</div>
                                </div>
                                <div className="card rounded-2xl gap-x-2 p-5 m-5  bg-gray-100" onClick={() => handleShowListRevenue("year")}>
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
                            <h1 className="text-3xl ml-4 font-bold">Statistik Jumlah Insiden</h1>

                            <div className="card-row flex flex-row overflow-x-auto">
                                <div className="card rounded-2xl gap-x-2 p-5 m-5  bg-gray-100" onClick={() => handleShowListAccident("today")}>
                                    <div className="card-title">Hari ini</div>
                                    <div className="card-value">{totalAccidentToday}</div>

                                </div>
                                <div className="card rounded-2xl gap-x-2 p-5 m-5  bg-gray-100"  onClick={() => handleShowListAccident("weeek")}>
                                    <div className="card-title">Minggu ini </div>
                                    <div className="card-value">{totalAccidentWeek}</div>
                                </div>
                                <div className="card rounded-2xl gap-x-2 p-5 m-5  bg-gray-100"  onClick={() => handleShowListAccident("month")}>
                                    <div className="card-title">Bulan ini</div>
                                    <div className="card-value">{totalAccidentMonth}</div>
                                </div>
                                <div className="card rounded-2xl gap-x-2 p-5 m-5  bg-gray-100"  onClick={() => handleShowListAccident("year")}>
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
                            <h1 className="text-3xl ml-4 font-bold">Statistik Jumlah Klien Baru</h1>

                            <div className="card-row flex flex-row overflow-x-auto">
                                <div className=" card rounded-2xl gap-x-2 p-5 m-5  bg-gray-100" onClick={() => handleShowListClient("today")}>
                                    <div className="card-title">Hari ini</div>
                                    <div className=" card-value" >{totalClientToday}</div>

                                </div>
                                <div className="card rounded-2xl gap-x-2 p-5 m-5  bg-gray-100" onClick={() => handleShowListClient("week")}>
                                    <div className="card-title">Minggu ini </div>
                                    <div className="card-value">{totalClientWeek}</div>
                                </div>
                                <div className="card rounded-2xl gap-x-2 p-5 m-5  bg-gray-100" onClick={() => handleShowListClient("month")}>
                                    <div className="card-title">Bulan ini</div>
                                    <div className="card-value">{totalClientMonth}</div>
                                </div>
                                <div className="card rounded-2xl gap-x-2 p-5 m-5  bg-gray-100" onClick={() => handleShowListClient("year")}>
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
                            <h1 className="text-3xl ml-4 font-bold">Statistik Jumlah Order Selesai</h1>

                            <div className="card-row flex flex-row overflow-x-auto">
                                <div className="card rounded-2xl gap-x-2 p-5 m-5  bg-gray-100" onClick={() => handleShowListOrder("today")}>
                                    <div className="card-title">Hari ini</div>
                                    <div className="card-value">{totalOrderToday}</div>

                                </div>
                                <div className="card rounded-2xl gap-x-2 p-5 m-5  bg-gray-100"  onClick={() => handleShowListOrder("week")}>
                                    <div className="card-title">Minggu ini </div>
                                    <div className="card-value">{totalOrderWeek}</div>
                                </div>
                                <div className="card rounded-2xl gap-x-2 p-5 m-5  bg-gray-100" onClick={() => handleShowListOrder("month")}>
                                    <div className="card-title">Bulan ini</div>
                                    <div className="card-value">{totalOrderMonth}</div>
                                </div>
                                <div className="card rounded-2xl gap-x-2 p-5 m-5  bg-gray-100" onClick={() => handleShowListOrder("year")}>
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