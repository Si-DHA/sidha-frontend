import React, { useState, useEffect } from 'react';
import router, { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Drawer from "@/app/components/common/drawer";
import Footer from "@/app/components/common/footer";
import DataTable from "@/app/components/common/datatable/DataTable";
import { getTawaranKerja } from '@/pages/api/tawaran-kerja/getTawaranKerja';
import { getAcceptedOffersBySopir } from '@/pages/api/tawaran-kerja/getAcceptedOffersBySopir';

const OrderItemsIndexPage = () => {
    const [orderItems, setOrderItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [location, setLocation] = useState('');
    const [selectedOfferId, setSelectedOfferId] = useState('');
    const sopirId = Cookies.get('idUser');

    useEffect(() => {
        setLoading(true);
        getTawaranKerja().then(data => {
            if (data && Array.isArray(data)) { // Ensure data is an array
                setOrderItems(data.map(item => ({
                    ...item,
                    source: item.rute.length > 0 ? item.rute[0].source : 'N/A',
                    destination: item.rute.length > 0 ? item.rute[0].destination : 'N/A',
                    isPecahBelah: item.isPecahBelah,
                    price: item.price || 'N/A',
                    createdDate: item.orderItemHistories.length > 0 ? new Date(item.orderItemHistories[0].createdDate).toLocaleString('id-ID') : 'N/A'
                })));
            } else {
                console.error('Invalid format for order items:', data);
            }
        }).catch(error => {
            console.error('Fetching error:', error);
        }).finally(() => {
            setLoading(false);
        });
        if (sopirId) {
            getAcceptedOffersBySopir(sopirId).then(acceptedOffers => {
                const acceptedIds = acceptedOffers.content.map(offer => offer.orderItem.id);
                setOrderItems(prevItems => prevItems.map(item => ({
                    ...item,
                    hasAccepted: acceptedIds.includes(item.id),
                })));
            });
        }
    }, [sopirId]);

    const handleDetailClick = (id, hasAccepted) => {
        const detailUrl = hasAccepted ? `/tawarankerja/sopir/detail/${id}/accept` : `/tawarankerja/sopir/detail/${id}`;
        router.push(detailUrl);
    };

    const columns = [
        { Header: 'Asal', accessor: 'source' },
        { Header: 'Tujuan', accessor: 'destination' },
        { Header: 'Mudah Pecah', accessor: 'isPecahBelah', Cell: ({ value }) => value ? 'Yes' : 'No' },
        { Header: 'Harga', accessor: 'price', Cell: ({ value }) => value !== 'N/A' ? `Rp${parseInt(value).toLocaleString('id-ID')}` : 'N/A' },
        { Header: 'Tanggal Dibuat', accessor: 'createdDate' },
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
