import React, { useState, useEffect } from 'react';
import router from 'next/router';
import Cookies from 'js-cookie';
import Drawer from "@/app/components/common/drawer";
import Footer from "@/app/components/common/footer";
import Link from "next/link";
import DataTable from "@/app/components/common/datatable/DataTable";
import { getTawaranKerjaAccepted } from '@/pages/api/tawaran-kerja/getTawaranKerjaAccepted';
import { getOrderByOrderItem } from '@/pages/api/order/getOrderByOrderItem';
import { access } from 'fs/promises';

const AcceptedOrderItemsIndexPage = () => {
    const [tawaranKerja, setTawaranKerja] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    var isLoggedIn = Cookies.get('isLoggedIn');
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/login');
        }
        const role = Cookies.get('role');
        if (role === 'KARYAWAN') {
            setUserRole(role);
        } else {
            setError('You are not allowed to access this page');
        }

    }, [isLoggedIn, router])

    useEffect(() => {
        setLoading(true);
        getTawaranKerjaAccepted().then(data => {
            if (data && Array.isArray(data)) {
                // Fetch additional data for each order item and merge tanggalPengiriman
                Promise.all(
                    data.map(async tawaran => {
                        const orderData = await getOrderByOrderItem(tawaran.orderItem.id);
                        const tanggalPengiriman = orderData?.content?.tanggalPengiriman || 'N/A';
                        return {
                            ...tawaran.orderItem,
                            source: tawaran.orderItem.rute?.[0]?.source ?? 'N/A',
                            destination: tawaran.orderItem.rute?.[0]?.destination ?? 'N/A',
                            price: tawaran.orderItem.price ?? 'N/A',
                            tanggalPengiriman,
                            sopir: tawaran.sopir,
                            isDikonfirmasiKaryawan: tawaran.isDikonfirmasiKaryawan ?? false,
                        };
                    })
                ).then(mergedTawaranKerja => {
                    setTawaranKerja(mergedTawaranKerja);
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

    const columns = [
        { Header: 'Asal', accessor: 'source' },
        { Header: 'Tujuan', accessor: 'destination' },
        { Header: 'Harga', accessor: 'price', Cell: ({ value }) => value !== 'N/A' ? `Rp${parseInt(value).toLocaleString('id-ID')}` : 'N/A' },
        {
            Header: 'Sopir',
            Cell: ({ row }) => {
                return (
                    <>
                        {row.original.sopir ? (
                            <Link 
                                href={`/list-user/detail?id=${row.original.sopir.id}`}
                                style={{textDecoration: 'underline'}}
                            >
                                {row.original.sopir.name}
                            </Link>
                        ) : (
                            '-'
                        )}
                    </>
                );
            }
        },        
        { Header: 'Sudah dikonfirmasi', accessor: 'isDikonfirmasiKaryawan', Cell: ({ value }) => value ? 'Sudah' : 'Belum' },
        {
            Header: 'Tanggal Pengiriman', accessor: 'tanggalPengiriman',
            Cell: ({ value }) => {
                // Extract date part (format: "03-05-2024 12:00:00") and return only the date
                const dateOnly = value.split(' ')[0];
                return dateOnly || 'N/A';
            }
        },
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

                            {error ? (
                                <div>{error}</div>
                            ) : (
                                <>
                                    {tawaranKerja ? (
                                        <DataTable
                                            data={tawaranKerja}
                                            columns={columns}
                                        />
                                    ) : (
                                        <div>Belum terdapat tawaran kerja yang perlu dikonfirmasi</div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </Drawer>
                <Footer />
            </div>
        </>
    );
};

export default AcceptedOrderItemsIndexPage;