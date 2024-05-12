import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Footer from '@/app/components/common/footer';
import DataTable from "@/app/components/common/datatable/DataTable";
import Cookies from "js-cookie";
import Drawer from "@/app/components/common/drawer";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

interface Klien {
    id: string;
    companyName: string;
}

interface OrderItem {
    id: string;
    price: number;
    statusOrder: number;
    alasanPenolakan: string | null;
    isPecahBelah: boolean;
    tipeBarang: string;
    tipeTruk: string;
    keterangan: string;
    rute: {
        id: number;
        source: string;
        destination: string;
        alamatPengiriman: string;
        alamatPenjemputan: string;
        price: number;
    }[];
    buktiBongkar: {
        id: number;
        name: string;
        type: string;
        filePath: string;
    };
    buktiMuat: {
        id: number;
        name: string;
        type: string;
        filePath: string;
    };
}

const CustomNoDataComponent = () => (
    <div style={{ padding: '24px' }}>
        <span>No data available</span>
    </div>
);

const DashboardKlienPage = () => {
    const [companyName, setCompanyName] = useState('');
    const [orderItem, setOrderItem] = useState<OrderItem[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    var isLoggedIn = Cookies.get('isLoggedIn');
    const [userRole, setUserRole] = useState('');
    const [klien, setKlien] = useState<Klien[]>([]);
    const [dailyExpenditure, setDailyExpenditure] = useState<number>(0);
    const [monthlyExpenditure, setMonthlyExpenditure] = useState<number>(0);
    const [yearlyExpenditure, setYearlyExpenditure] = useState<number>(0);
    const [monthlyExpenditurePick, setMonthlyExpenditurePick] = useState<number>(0);
    const [yearlyExpenditurePick, setYearlyExpenditurePick] = useState<number>(0);
    const [completedOrderItemCount, setCompletedOrderItemCount] = useState<number>(0);
    const currentYear = new Date().getFullYear();
    const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0');
    const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth); // State for selected month
    const [selectedYear, setSelectedYear] = useState<string>(String(currentYear));
    const [selectedYearForYearly, setSelectedYearForYearly] = useState<string>(String(currentYear));

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/login');
        }
        const role = Cookies.get('role');
        setUserRole(role || '');
    }, [])

    useEffect(() => {
        const fetchOrderItem = async () => {
            try {
                const response = await fetch(`/api/dashboard/getAllOrderItemDiproses?klienId=${Cookies.get('idUser')}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch order');
                }
                const data = await response.json();
                setOrderItem(data);
            } catch (error) {
                console.error('Error fetching order:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderItem();
    }, []);

    useEffect(() => {
        const fetchCompletedOrderItemCount = async () => { // New useEffect to fetch completed order item count
            try {
                const response = await fetch(`/api/dashboard/countCompletedOrderItem?klienId=${Cookies.get('idUser')}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch completed order item count');
                }
                const data = await response.json();
                setCompletedOrderItemCount(data); // Set the state with the fetched count
            } catch (error) {
                console.error('Error fetching completed order item count:', error);
            }
        };

        fetchCompletedOrderItemCount();
    }, []);

    // Function to fetch order items
    useEffect(() => {
        const fetchMonthlyExpenditurePick = async () => {
            try {
                // Fetch monthly expenditure
                const monthlyResponse = await fetch(`/api/dashboard/getPengeluaranMonthlyPick?klienId=${Cookies.get('idUser')}&month=${selectedMonth}&year=${selectedYear}`);
                if (!monthlyResponse.ok) {
                    throw new Error('Failed to fetch monthly expenditure');
                }
                const monthlyData = await monthlyResponse.json();
                setMonthlyExpenditurePick(monthlyData.content);
            } catch (error) {
                console.error('Error fetching expenditures:', error);
            }
        };

        fetchMonthlyExpenditurePick();
    }, [selectedMonth, selectedYear]);

    useEffect(() => {
        const fetchYearlyExpenditurePick = async () => {
            try {
                const response = await fetch(`/api/dashboard/getPengeluaranYearlyPick?klienId=${Cookies.get('idUser')}&year=${selectedYearForYearly}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch yearly expenditure');
                }
                const data = await response.json();
                setYearlyExpenditurePick(data.content);
            } catch (error) {
                console.error('Error fetching yearly expenditure:', error);
            }
        };

        fetchYearlyExpenditurePick();
    }, [selectedYearForYearly]);


    useEffect(() => {
        const fetchDailyExpenditure = async () => {
            try {
                const response = await fetch(`/api/dashboard/getPengeluaranDaily?klienId=${Cookies.get('idUser')}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch daily expenditure');
                }
                const data = await response.json();
                setDailyExpenditure(data.content);
            } catch (error) {
                console.error('Error fetching daily expenditure:', error);
            }
        };

        const fetchMonthlyExpenditure = async () => {
            try {
                const response = await fetch(`/api/dashboard/getPengeluaranMonthly?klienId=${Cookies.get('idUser')}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch monthly expenditure');
                }
                const data = await response.json();
                setMonthlyExpenditure(data.content);
            } catch (error) {
                console.error('Error fetching monthly expenditure:', error);
            }
        };

        const fetchYearlyExpenditure = async () => {
            try {
                const response = await fetch(`/api/dashboard/getPengeluaranYearly?klienId=${Cookies.get('idUser')}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch yearly expenditure');
                }
                const data = await response.json();
                setYearlyExpenditure(data.content);
            } catch (error) {
                console.error('Error fetching yearly expenditure:', error);
            }
        };

        fetchDailyExpenditure();
        fetchMonthlyExpenditure();
        fetchYearlyExpenditure();
    }, []);

    const formatPrice = (price: number): string => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price);
    };

    const getStatusDescription = (statusCode) => {
        switch (statusCode) {
            case -1:
                return <span className="border border-red-500 text-red-500 font-lg py-1 px-2 rounded-full">Ditolak</span>;
            case 0:
                return <span className="border border-yellow-500 text-yellow-500 font-lg py-1 px-2 rounded-full">Menunggu Konfirmasi</span>;
            case 1:
                return <span className="border border-green-500 text-green-500 font-lg py-1 px-2 rounded-full">Dikonfirmasi</span>;
            case 2:
                return <span className="border border-yellow-500 text-yellow-500 font-lg py-1 px-2 rounded-full">Menunggu DP</span>;
            case 3:
                return <span className="border border-blue-500 text-blue-500 font-lg py-1 px-2 rounded-full">Dalam Perjalanan</span>;
            case 4:
                return <span className="border border-blue-500 text-blue-500 font-lg py-1 px-2 rounded-full">Sampai (Menunggu Pelunasan)</span>;
            case 5:
                return <span className="border border-green-500 text-green-500 font-lg py-1 px-2 rounded-full">Selesai</span>;
            default:
                return <span className="border border-gray-500 text-gray-500 font-lg py-1 px-2 rounded-full">Unknown Status</span>;
        }
    };

    const columns = [
        {
            Header: 'ID Order Item',
            accessor: 'id',
        },
        {
            Header: 'Price',
            accessor: 'price',
            Cell: ({ value }) => formatPrice(value),
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
            Header: 'Status Order',
            accessor: 'statusOrder',
            Cell: ({ value }) => getStatusDescription(value)
        },
        {
            Header: 'Rute',
            accessor: 'rute',
            Cell: ({ value }) => (
                <ul>
                    {value.map((route, index) => (
                        <li key={index}>
                            {route.source} to {route.destination}
                        </li>
                    ))}
                </ul>
            ),
        },
    ];

    return (
        <main className={`flex min-h-screen flex-col ${inter.className}`} data-theme="cmyk">
            <Drawer userRole={userRole}>
                <div className="flex-1 py-6 px-4">
                    <div className="container mx-auto">
                        <div className="bg-gray-100 rounded-lg p-4 mb-4">
                            <h2 className="text-lg font-bold mb-2">Pengeluaran Hari Ini</h2>
                            <p>{formatPrice(dailyExpenditure)}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="bg-gray-100 rounded-lg p-4">
                                <h2 className="text-lg font-bold mb-2">Pengeluaran Bulanan</h2>
                                <div className="flex space-x-4">
                                    <select
                                        value={selectedMonth}
                                        onChange={(e) => setSelectedMonth(e.target.value)}
                                        className="border border-gray-300 rounded px-3 py-1 mb-2"
                                    >
                                        <option value="">Pilih Bulan</option>
                                        <option value="01">Januari</option>
                                        <option value="02">Februari</option>
                                        <option value="03">Maret</option>
                                        <option value="04">April</option>
                                        <option value="05">Mei</option>
                                        <option value="06">Juni</option>
                                        <option value="07">Juli</option>
                                        <option value="08">Agustus</option>
                                        <option value="09">September</option>
                                        <option value="10">Oktober</option>
                                        <option value="11">November</option>
                                        <option value="12">Desember</option>
                                    </select>
                                    <select
                                        value={selectedYear}
                                        onChange={(e) => setSelectedYear(e.target.value)}
                                        className="border border-gray-300 rounded px-3 py-1 mb-2"
                                    >
                                        <option value="">Pilih Tahun</option>
                                        {Array.from({ length: 10 }, (_, i) => (
                                            <option key={i + 2020} value={String(i + 2020)}>
                                                {String(i + 2020)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <p>{formatPrice(monthlyExpenditurePick)}</p>
                            </div>
                            <div className="bg-gray-100 rounded-lg p-4">
                                <h2 className="text-lg font-bold mb-2">Pengeluaran Tahunan</h2>
                                <div className="flex space-x-4">
                                    <select
                                        value={selectedYearForYearly}
                                        onChange={(e) => setSelectedYearForYearly(e.target.value)}
                                        className="border border-gray-300 rounded px-3 py-1 mb-2"
                                    >
                                        <option value="">Pilih Tahun</option>
                                        {Array.from({ length: 10 }, (_, i) => (
                                            <option key={i + 2020} value={String(i + 2020)}>
                                                {String(i + 2020)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <p>{formatPrice(yearlyExpenditurePick)}</p>
                            </div>
                        </div>
                        <div className="bg-gray-100 rounded-lg p-4 mb-4">
                            <h2 className="text-lg font-bold mb-2">Jumlah Order Item Selesai</h2>
                            <p>{completedOrderItemCount}</p>
                        </div>
                        <div className="bg-gray-100 rounded-lg p-4 mb-4">
                            <div className="flex justify-between mb-5">
                                <h2 className="text-lg font-bold mb-2">Order Item Diproses</h2>
                                <button
                                    onClick={() => router.push('/order/klien')}
                                    className="bg-white hover:bg-blue-100 text-gray-500 font-semibold py-2 px-4 rounded-lg border border-gray-500"
                                >
                                    Lihat semua order
                                </button>
                            </div>
                            <DataTable
                                columns={columns}
                                data={orderItem}
                                progressPending={loading}
                                noDataComponent={<CustomNoDataComponent />}
                            />
                        </div>
                    </div>
                </div>
                <Footer />
            </Drawer>
        </main>
    );
};

export default DashboardKlienPage;
