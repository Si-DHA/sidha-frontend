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
    const sopirId = Cookies.get('idUser'); 

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
        { Header: 'Asal', accessor: 'source' },
        { Header: 'Tujuan', accessor: 'destination' },
        { Header: 'Mudah Pecah', accessor: 'isPecahBelah', Cell: ({ value }) => value ? 'Yes' : 'No' },
        { Header: 'Harga', accessor: 'price', Cell: ({ value }) => value !== 'N/A' ? `Rp${parseInt(value).toLocaleString('id-ID')}` : 'N/A' },
        { Header: 'Tanggal Pembuatan', accessor: 'createdDate' },
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
          <div className="flex flex-col h-screen justify-between"> 
            <Drawer userRole='userRole'>
              <div className="overflow-auto">
                <h2 className="text-2xl text-center font-bold mb-2 mt-6">Tawaran Kerja yang Anda Terima</h2>
                <div className="mx-auto w-full max-w-4xl p-4">
                  <DataTable
                    data={tawaranKerja}
                    columns={columns}
                    loading={loading}
                    NoDataComponent={() => <div>No accepted job offers found</div>}
                  />
                </div>
              </div>
            </Drawer>
            <Footer />
          </div>
        </>
      );
      
};

export default AcceptedOrderItemsIndexPage;
