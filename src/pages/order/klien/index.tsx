import React, { useEffect, useState } from 'react';
import DataTable from "@/app/components/common/datatable/DataTable";
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Drawer from '@/app/components/common/drawer';
import Footer from '@/app/components/common/footer';

interface Klien {
    id: string;
    companyName: string;
}

interface Order {
    id: string;
    createdAt: string;
    updatedAt: string;
    totalPrice: number;
    tanggalPengiriman: string;
}

const CustomNoDataComponent = () => (
    <div style={{ padding: '24px' }}>
        <span>No data available</span>
    </div>
);

const ViewAllOrdersPage: React.FC = () => {
    const [klien, setKlien] = useState<Klien[]>([]);
    const [companyName, setCompanyName] = useState('');
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    var isLoggedIn = Cookies.get('isLoggedIn');
    const [userRole, setUserRole] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/login');
        }
        const role = Cookies.get('role');
        setUserRole(role || '');
        if (role === 'KLIEN') {
            setCompanyName(Cookies.get('companyName') || '')
        } else {
            setError('Anda tidak diperbolehkan mengakses halaman ini')
        }
    }, [])

    useEffect(() => {
        const fetchKlien = async () => {
            try {
                const response = await fetch('/api/proxyKlien');
                if (!response.ok) {
                    throw new Error('Failed to fetch klien');
                }
                const { content } = await response.json();
                setKlien(content);
                const loggedInKlien = content.find(klien => klien.id === Cookies.get('idUser'));
            } catch (error) {
                console.error(error);
            }
        };
        fetchKlien();
    }, []);


    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch(`/api/order/viewAllOrderByIdKlien?klienId=${Cookies.get('idUser')}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch order');
                }
                const data = await response.json();
                setOrders(data);
            } catch (error) {
                console.error('Error fetching order:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const formatPrice = (price: number): string => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price);
    };

    const columns = [
        {
            Header: 'ID Order',
            accessor: 'id',
        },
        {
            Header: 'Harga Total',
            accessor: 'totalPrice',
            Cell: ({ value }) => formatPrice(value),
        },
        {
            Header: 'Tanggal Dibuat',
            accessor: 'createdAt',
        },
        {
            Header: 'Terakhir Diubah',
            accessor: 'updatedAt',
        },
        {
            Header: 'Tanggal Pengiriman',
            accessor: 'tanggalPengiriman',
        },
        {
            Header: 'Kelola',
            Cell: ({ row }) => (
                <div className="flex justify-center space-x-4">
                    <button
                        onClick={() => router.push(`/order/klien/${row.original.id}`)}
                        className="px-4 py-2 border border-gray-300 bg-white text-gray-800 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        Lihat Order Item
                    </button>
                </div>
            ),
        },
    ];

    return (
        <main className="flex min-h-screen flex-col items-center justify-between" data-theme="winter">
            <Drawer userRole={userRole}>
                <div className="flex flex-col justify-center items-center mih-h-screen p-8">
                    <h1 className="text-3xl font-bold text-center ">Order {companyName} </h1>
                </div>

                <div className="flex flex-col gap-6 mx-4 my-4 ">
                    <div className="flex flex-col gap-4 justify-center items-center mih-h-screen p-8 border rounded-lg shadow-md">
                        <div className="overflow-x-auto w-full">
                            {error ? (
                                <div>{error}</div>
                            ) : (
                                <>
                                    <DataTable
                                        columns={columns}
                                        data={orders}
                                        loading={loading} />
                                </>)}
                        </div>
                    </div>
                </div>
            </Drawer>
            <Footer />
        </main>
    );

};

export default ViewAllOrdersPage;