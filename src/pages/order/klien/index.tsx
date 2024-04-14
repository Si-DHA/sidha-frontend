
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
                if (loggedInKlien && loggedInKlien.orders) {
                    setCompanyName(loggedInKlien.companyName || '');
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchKlien();
    }, []);

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/login');
        }
        const role = Cookies.get('role');
        setUserRole(role || '');
    }, [])

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

    const columns = [
        {
            Header: 'ID Order',
            accessor: 'id',
        },
        {
            Header: 'Harga Total',
            accessor: 'totalPrice',
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
            Header: 'Kelola',
            Cell: ({ row }) => (
                <div className="flex space-x-4">
                    <button
                        onClick={() => router.push(`/order/klien/${row.original.id}`)}
                        className="px-4 py-2 border border-gray-300 bg-white text-gray-800 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        Lihat Daftar Order Item
                    </button>
                </div>
            ),
        },
    ];

    return (
        <main className="flex min-h-screen flex-col " data-theme="winter">
            <Drawer userRole={userRole}>
                <div className="flex-1 py-6 px-4">
                    <div className="container mx-auto">
                        <h1 className="text-3xl font-bold mt-1 mb-5" style={{ color: '#2d3254' }}>Order {companyName} </h1>
                        <DataTable
                            columns={columns}
                            data={orders}
                            progressPending={loading}
                            noDataComponent={<CustomNoDataComponent/>}
                        />
                    </div>
                </div>
                <Footer />
            </Drawer>
        </main>
    );

};

export default ViewAllOrdersPage;