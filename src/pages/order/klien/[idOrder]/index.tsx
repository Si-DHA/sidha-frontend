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

const OrderItemPage = () => {
    const [klien, setKlien] = useState<Klien[]>([]);
    const [companyName, setCompanyName] = useState('');
    const [orderItem, setOrderItem] = useState<OrderItem[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { idOrder } = router.query;
    console.log("idOrder:", idOrder);
    var isLoggedIn = Cookies.get('isLoggedIn');
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        const fetchKlien = async () => {
            try {
                if (!idOrder) return; // Exit early if idOrder is undefined
                const response = await fetch('/api/proxyKlien');
                if (!response.ok) {
                    throw new Error('Failed to fetch klien');
                }
                const { content } = await response.json();
                setKlien(content);
                // Find the Klien with the matching order id
                const currentKlien = content.find(klien =>
                    klien.orders.some(order => order.id === idOrder)
                );
                if (currentKlien && currentKlien.companyName) {
                    setCompanyName(currentKlien.companyName);
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchKlien();
    }, [idOrder]);

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/login');
        }
        const role = Cookies.get('role');
        setUserRole(role || '');
    },)

    const handleBack = () => {
        router.push('/order/klien');
    };

    const formatCurrency = (value: number) => {
        return `Rp${new Intl.NumberFormat('id-ID').format(value)}`;
    };

    const fetchOrderItem = async () => {
        setLoading(true);
        try {
          const fetchUrl = `/api/order/viewAllOrderItemByIdOrder?idOrder=${idOrder}`;
          const response = await fetch(fetchUrl);
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch data');
          }
          const data = await response.json();
          setOrderItem(data);
        } catch (error) {
          console.error('Failed to fetch order item:', error);
        } finally {
          setLoading(false);
        }
      };

      useEffect(() => {
        if (idOrder) {
          fetchOrderItem();
        }
      }, [idOrder]);

    const columns = [
        // {
        //   Header: 'ID Order Item',
        //   accessor: 'id',
        // },
        {
            Header: 'Price',
            accessor: 'price',
        },
        // {
        //   Header: 'Status Order',
        //   accessor: 'statusOrder',
        // },
        // {
        //   Header: 'Alasan Penolakan',
        //   accessor: 'alasanPenolakan',
        // },
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
        // {
        //   Header: 'Keterangan',
        //   accessor: 'keterangan',
        // },
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
        {
            Header: 'Kelola',
            Cell: ({ row }) => (
                <div className="flex space-x-4">
                    <button
                        // onClick={() => router.push(`/order/sopir/upload-bukti-muat/${row.original.id}`)}
                        className="px-4 py-2 border border-gray-300 bg-white text-gray-800 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        Ubah Order
                    </button>
                    <button
                        onClick={() => router.push(`/order/klien/${idOrder}/${row.original.id}`)}
                        className="px-4 py-2 border border-gray-300 bg-white text-gray-800 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        Detail
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
                        <h1 className="text-3xl font-bold mt-1 mb-5" style={{ color: '#2d3254' }}>Order Item {companyName} </h1>
                        <DataTable
                            columns={columns}
                            data={orderItem}
                            progressPending={loading}
                            noDataComponent={<CustomNoDataComponent />}
                        />
                    </div>
                </div>
                <Footer />
            </Drawer>
        </main>
    );
};

export default OrderItemPage;