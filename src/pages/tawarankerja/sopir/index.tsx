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
            <Drawer userRole='userRole'>
                <main className="flex flex-col items-center justify-between" data-theme="winter">
                    <h2 className="text-2xl font-bold mb-2">Tawaran Kerja</h2>
                    <DataTable
                        data={orderItems}
                        columns={columns}
                        loading={loading}
                        NoDataComponent={() => <div>No available order items</div>}
                    />
                    {/* {selectedOfferId && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                            <div className="bg-white p-4 rounded-lg shadow-lg">
                                <h3 className="text-lg font-medium">Accept Job Offer</h3>
                                <p>Are you sure you want to take this job? Please confirm your current location.</p>
                                <input
                                    type="text"
                                    placeholder="Enter your current location"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="input input-bordered w-full max-w-xs"
                                />
                                <div className="flex justify-end mt-4">
                                    <button className="btn btn-secondary mr-2" onClick={() => setSelectedOfferId('')}>
                                        Cancel
                                    </button>
                                    <button className="btn btn-primary" onClick={confirmAcceptOffer}>
                                        Confirm
                                    </button>
                                </div>
                            </div>
                        </div>
                    )} */}
                </main>
                <Footer />
            </Drawer>
        </>
    );
};

export default OrderItemsIndexPage;
