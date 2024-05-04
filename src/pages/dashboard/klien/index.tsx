import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Footer from '@/app/components/common/footer';
import DataTable from "@/app/components/common/datatable/DataTable";
import Cookies from "js-cookie";
import Drawer from "@/app/components/common/drawer";

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
    const [completedOrderItemCount, setCompletedOrderItemCount] = useState<number>(0);

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
            Header: 'Pecah Belah',
            accessor: 'isPecahBelah',
            Cell: ({ value }) => (value ? 'Yes' : 'No'),
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
        <main className="flex min-h-screen flex-col " data-theme="winter">
            <Drawer userRole={userRole}>
                <div className="flex-1 py-6 px-4">
                    <div className="container mx-auto">
                        {/* Display completed order item count */}
                        <div className="bg-white rounded-lg p-4 shadow-md mb-4">
                            <h2 className="text-lg font-semibold mb-2">Completed Order Item</h2>
                            <p>{completedOrderItemCount}</p>
                        </div>
                        {/* Display daily, monthly, and yearly expenditure */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-white rounded-lg p-4 shadow-md">
                                <h2 className="text-lg font-semibold mb-2">Daily Expenditure</h2>
                                <p>{formatPrice(dailyExpenditure)}</p>
                            </div>
                            <div className="bg-white rounded-lg p-4 shadow-md">
                                <h2 className="text-lg font-semibold mb-2">Monthly Expenditure</h2>
                                <p>{formatPrice(monthlyExpenditure)}</p>
                            </div>
                            <div className="bg-white rounded-lg p-4 shadow-md">
                                <h2 className="text-lg font-semibold mb-2">Yearly Expenditure</h2>
                                <p>{formatPrice(yearlyExpenditure)}</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg p-4 shadow-md">
                            <h2 className="text-lg font-semibold my-5" style={{ color: '#2d3254' }}>Order Item Diproses</h2>
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
