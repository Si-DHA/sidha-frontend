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
    const [location, setLocation] = useState('');
    const [selectedOfferId, setSelectedOfferId] = useState('');
    const sopirId = Cookies.get('idUser');
    var isLoggedIn = Cookies.get('isLoggedIn');
    const [userRole, setUserRole] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/login');
        }
        const role = Cookies.get('role');
        if (role === 'SOPIR') {
            setUserRole(role);
        } else {
            setError('You are not allowed to access this page');
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
                    console.error('Fetching additional data error:', error);
                }).finally(() => {
                    setLoading(false);
                });
            } else {
                console.error('Invalid format for order items:', data);
                setLoading(false);
            }
        }).catch(error => {
            console.error('Fetching error:', error);
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
        { Header: 'Tanggal Pengiriman', accessor: 'tanggalPengiriman', 
        Cell: ({ value }) => {
            // Extract date part (format: "03-05-2024 12:00:00") and return only the date
            const dateOnly = value.split(' ')[0];
            return dateOnly || 'N/A';
        }},
        {
            Header: 'Details',
            accessor: 'id',
            Cell: ({ value, row }) => (
                <button
                    onClick={() => handleDetailClick(value, row.original.hasAccepted)}
                    className="btn btn-primary"
                >
                    Detail
                </button>
            ),
        },
    ];
    

    return (
        <>
            <div className="flex flex-col h-screen justify-between" data-theme="winter">
                <Drawer userRole='userRole'>
                    <div className="overflow-auto">
                        <h2 className="text-center text-2xl font-bold mb-2 mt-6">Tawaran Kerja</h2>
                        <div className="mx-auto w-full max-w-4xl p-4">
                            <DataTable
                                data={orderItems}
                                columns={columns}
                                loading={loading}
                                NoDataComponent={() => <div>No available order items</div>}
                            />
                        </div>
                    </div>
                </Drawer>
                <Footer />
            </div>
        </>
    );
};

export default OrderItemsIndexPage;
