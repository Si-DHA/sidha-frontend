import React, { useState, useEffect } from 'react';
import router from 'next/router';
import Cookies from 'js-cookie';
import Drawer from "@/app/components/common/drawer";
import Footer from "@/app/components/common/footer";
import DataTable from "@/app/components/common/datatable/DataTable";
import { getTawaranKerjaAccepted } from '@/pages/api/tawaran-kerja/getTawaranKerjaAccepted';

const AcceptedOrderItemsIndexPage = () => {
    const [tawaranKerja, setTawaranKerja] = useState([]);
    const [loading, setLoading] = useState(true);
    const sopirId = Cookies.get('idUser'); // Ensure this cookie is set during login

    useEffect(() => {
        setLoading(true);
        getTawaranKerjaAccepted().then(data => {
            if (data && Array.isArray(data)) {
                // Filter to include only those items accepted by the logged-in driver
                const filteredData = data.filter(tawaran => tawaran.sopir?.id === sopirId).map(tawaran => ({
                    ...tawaran.orderItem,
                    source: tawaran.orderItem.rute?.[0]?.source ?? 'N/A',
                    destination: tawaran.orderItem.rute?.[0]?.destination ?? 'N/A',
                    isPecahBelah: tawaran.orderItem.isPecahBelah ?? false,
                    price: tawaran.orderItem.price ?? 'N/A',
                    createdDate: tawaran.orderItem.orderItemHistories?.[0]?.createdDate
                        ? new Date(tawaran.orderItem.orderItemHistories[0].createdDate).toLocaleString('id-ID')
                        : 'N/A'
                }));
                setTawaranKerja(filteredData);
            } else {
                console.error('Invalid format for order items:', data);
            }
        }).catch(error => {
            console.error('Fetching error:', error);
        }).finally(() => {
            setLoading(false);
        });
    }, [sopirId]);

    const columns = [
        { Header: 'Source', accessor: 'source' },
        { Header: 'Destination', accessor: 'destination' },
        { Header: 'Is Fragile', accessor: 'isPecahBelah', Cell: ({ value }) => value ? 'Yes' : 'No' },
        { Header: 'Price', accessor: 'price', Cell: ({ value }) => value !== 'N/A' ? `Rp${parseInt(value).toLocaleString('id-ID')}` : 'N/A' },
        { Header: 'Created Date', accessor: 'createdDate' },
        {
            Header: 'Details',
            accessor: 'id',  // Assuming `id` now directly relates to `orderItem.id`
            Cell: ({ value }) => (
                <button
                    onClick={() => router.push(`/tawarankerja/sopir/detail/${value}/accept`)}
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
                <main className="container mx-auto p-4">
                    <h2 className="text-2xl font-bold mb-2">Accepted Job Offers</h2>
                    <DataTable
                        data={tawaranKerja}
                        columns={columns}
                        loading={loading}
                        NoDataComponent={() => <div>No accepted job offers found</div>}
                    />
                </main>
                <Footer />
            </Drawer>
        </>
    );
};

export default AcceptedOrderItemsIndexPage;
