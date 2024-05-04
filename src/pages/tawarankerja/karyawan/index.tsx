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
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        setUserRole(Cookies.get('role') || 'defaultRole');
        setLoading(true);
        getTawaranKerjaAccepted().then(data => {
            if (data && Array.isArray(data)) {
                setTawaranKerja(data.map(tawaran => ({
                    ...tawaran.orderItem,
                    source: tawaran.orderItem.rute?.[0]?.source ?? 'N/A',
                    destination: tawaran.orderItem.rute?.[0]?.destination ?? 'N/A',
                    isPecahBelah: tawaran.orderItem.isPecahBelah ?? false,
                    isDikonfirmasiKaryawan: tawaran.isDikonfirmasiKaryawan ?? false,
                    price: tawaran.orderItem.price ?? 'N/A',
                    createdDate: tawaran.orderItem.orderItemHistories?.[0]?.createdDate
                        ? new Date(tawaran.orderItem.orderItemHistories[0].createdDate).toLocaleString('id-ID')
                        : 'N/A'
                })));
            } else {
                console.error('Invalid format for order items:', data);
            }
        }).catch(error => {
            console.error('Fetching error:', error);
        }).finally(() => {
            setLoading(false);
        });
    }, []);

    const columns = [
        { Header: 'Asal', accessor: 'source' },
        { Header: 'Tujuan', accessor: 'destination' },
        { Header: 'Mudah Pecah', accessor: 'isPecahBelah', Cell: ({ value }) => value ? 'Ya' : 'Tidak' },
        { Header: 'Harga', accessor: 'price', Cell: ({ value }) => value !== 'N/A' ? `Rp${parseInt(value).toLocaleString('id-ID')}` : 'N/A' },
        { Header: 'Sopir Confirmed', accessor: 'isDikonfirmasiKaryawan', Cell: ({ value }) => value ? 'Ya' : 'Tidak' },
        { Header: 'Tanggal Pembuatan', accessor: 'createdDate' },
        {
            Header: 'Details',
            accessor: 'id',
            Cell: ({ value }) => (
                <button
                    onClick={() => router.push(`/tawarankerja/karyawan/detail/${value}`)}
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
            <Drawer userRole={userRole}>
                    <div className="overflow-auto">
                        <h2 className="text-2xl font-bold mb-1 text-center mt-6">Tawaran Kerja</h2>
                        <h5 className="text-center text-l mb-2">Segera konfirmasi sopir untuk pengantaran dibawah!</h5>
                        <div className="mx-auto w-full max-w-4xl p-4">
                            <DataTable
                                data={tawaranKerja}
                                columns={columns}
                                loading={loading}
                                NoDataComponent={() => <div>No accepted job offers</div>}

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