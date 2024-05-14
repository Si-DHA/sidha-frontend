import React, { useState, useEffect } from 'react';
import router, { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Drawer from "@/app/components/common/drawer";
import Footer from "@/app/components/common/footer";
import DataTable from "@/app/components/common/datatable/DataTable";
import { getTawaranKerja } from '@/pages/api/tawaran-kerja/getTawaranKerja';
import { getAcceptedOffersBySopir } from '@/pages/api/tawaran-kerja/getAcceptedOffersBySopir';
import { getOrderByOrderItem } from '@/pages/api/order/getOrderByOrderItem';

const OrderItemsIndexPage = () => {
    const [orderItems, setOrderItems] = useState([]);
    const [loading, setLoading] = useState(true);
    var isLoggedIn = Cookies.get('isLoggedIn');
    const [userRole, setUserRole] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/login');
        }
        const role = Cookies.get('role');
        setUserRole(role || '');
        if (role !== 'SOPIR') {
            setError('Anda tidak diperbolehkan mengakses halaman ini');
        }

    }, [isLoggedIn, router])

    useEffect(() => {
        setLoading(true);
        // Fetching order items
        getTawaranKerja().then(data => {
            if (data && Array.isArray(data)) {
                const orderItems = data.map(item => ({
                    ...item,
                    source: item.rute.length > 0 ? item.rute[0].source : 'N/A',
                    destination: item.rute.length > 0 ? item.rute[0].destination : 'N/A',
                    isPecahBelah: item.isPecahBelah,
                    price: item.price || 'N/A',
                    tipeTruk: item.tipeTruk
                }));
                // Fetching additional data for each order item
                Promise.all(
                    orderItems.map(async item => {
                        const orderData = await getOrderByOrderItem(item.id);
                        if (orderData && orderData.content) {
                            // Merge tanggalPengiriman with the order item
                            return {
                                ...item,
                                tanggalPengiriman: orderData.content.tanggalPengiriman,
                            };
                        }
                        return item;
                    })
                ).then(mergedOrderItems => {
                    setOrderItems(mergedOrderItems);
                }).catch(error => {
                    setError('Fetching additional data error: ' + error.message);
                }).finally(() => {
                    setLoading(false);
                });
            } else {
                console.error('Invalid format for order items:', data);
                setLoading(false);
            }
        }).catch(error => {
            setError(`Gagal memuat tawaran kerja ${error.message ? ` : ${error.message}` : ''}`);
            setLoading(false);
        });
    }, []);

    const handleDetailClick = (id, hasAccepted) => {
        const detailUrl = hasAccepted ? `/tawarankerja/sopir/detail/${id}/accept` : `/tawarankerja/sopir/detail/${id}`;
        router.push(detailUrl);
    };

    const columns = [
        { Header: 'Asal', accessor: 'source' },
        { Header: 'Tujuan', accessor: 'destination' },
        { Header: 'Mudah Pecah', accessor: 'isPecahBelah', Cell: ({ value }) => value ? 'Yes' : 'No' },
        { Header: 'Harga', accessor: 'price', Cell: ({ value }) => value !== 'N/A' ? `Rp${parseInt(value).toLocaleString('id-ID')}` : 'N/A' },
        { Header: 'Tipe Truk', accessor: 'tipeTruk' },
        {
            Header: 'Tanggal Pengiriman', accessor: 'tanggalPengiriman',
            Cell: ({ value }) => {
                const dateOnly = value.split(' ')[0];
                return dateOnly || 'N/A';
            }
        },
        {
            Header: 'Detail',
            accessor: 'id',
            Cell: ({ value, row }) => (
                <div className="flex justify-center space-x-4">
                    <button
                        onClick={() => handleDetailClick(value, row.original.hasAccepted)}
                        className="px-4 py-2 border border-gray-300 bg-white text-gray-800 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        Detail
                    </button>
                </div>
            ),
        },
    ];

    return (
        <main className="flex min-h-screen flex-col items-center justify-between" data-theme="winter">
            <Drawer userRole={userRole}>
                <div className="flex flex-col justify-center items-center mih-h-screen p-8">
                    <h1 className="text-3xl font-bold text-center ">Tawaran Kerja</h1>    
                </div>

                <div className="flex flex-col gap-6 mx-4 my-4 ">
                    <div className="flex flex-col gap-4 justify-center items-center mih-h-screen p-8 border rounded-lg shadow-md">
                        <div className="overflow-x-auto w-full">
                            {error ? (
                                <div>{error}</div>
                            ) : (
                                <>
                                    <DataTable
                                        data={orderItems}
                                        columns={columns}
                                        loading={loading}
                                        type='tawaran kerja'
                                    />
                                </>)}
                        </div>
                    </div>
                </div>
            </Drawer>
            <Footer />
        </main>
    );
};

export default OrderItemsIndexPage;
