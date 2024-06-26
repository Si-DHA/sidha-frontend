import DataTable from '@/app/components/common/datatable/DataTable';
import Drawer from "@/app/components/common/drawer";
import Footer from "@/app/components/common/footer"
import Cookies from 'js-cookie';
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getOrderByKlien } from '../api/order/getOrderByKlien';
import { getAllOrder } from '../api/order/getAllOrder';

const DaftarPurchaseOrderPage = () => {

    var isLoggedIn = Cookies.get('isLoggedIn');
    var idUser = Cookies.get('idUser');
    var token = Cookies.get('token');
    const [userRole, setUserRole] = useState('');
    const router = useRouter();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [orderData, setOrderData] = useState([]); // State to hold truck data
    var columns: any[] = []
    
    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/login');
        }
        const role = Cookies.get('role');
        setUserRole(role || '');

        if (role !== 'KLIEN' && role !== 'KARYAWAN') {
            setError('Anda tidak diperbolehkan mengakses halaman ini')
        }

        const fetchData = async () => {
            try {
                if (idUser && token) {
                    if (role == "KLIEN") {
                        const data = await getOrderByKlien(idUser, token);
                        setOrderData(data);
                    } else if (role == "KARYAWAN") {
                        const data = await getAllOrder(token);
                        setOrderData(data);
                    }
                } else {
                    throw new Error('Pengguna tidak ditemukan');
                }
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData(); // Call fetchData function when component mounts
    }, []);

    const formatPrice = (price: number): string => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price);
    };

    if (userRole == "KLIEN") {
        const columnsKlien = [
            {
                Header: 'Id Order',
                accessor: 'idOrder',
            },
            {
                Header: 'Tanggal Pemesanan',
                accessor: 'tanggalPemesanan',
            },
            {
                Header: 'Tanggal Pengiriman',
                accessor: 'tanggalPengiriman',
                Cell: ({ value }) => value.split(' ')[0],
            },
            {
                Header: 'Jumlah Order Item',
                accessor: 'jumlahOrderItem',
            },
            {
                Header: 'Total Biaya Pengiriman',
                accessor: 'totalBiayaPengiriman',
                Cell: ({ value }) => formatPrice(value)
            },
            {
                Header: 'Detail',
                accessor: 'action',
                Cell: 
                <div className="flex justify-center space-x-4">
                    <button
                        className="px-4 py-2 border border-gray-300 bg-white text-gray-800 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        Detail
                    </button>
                </div>
            }
        ];
        columns = columnsKlien
    } else {
        const columnsKaryawan = [
            {
                Header: 'Id Order',
                accessor: 'idOrder',
            },
            {
                Header: 'Tanggal Pemesanan',
                accessor: 'tanggalPemesanan',
            },
            {
                Header: 'Tanggal Pengiriman',
                accessor: 'tanggalPengiriman',
                Cell: ({ value }) => value.split(' ')[0],
            },
            {
                Header: 'Jumlah Order Item',
                accessor: 'jumlahOrderItem',
            },
            {
                Header: 'Total Biaya Pengiriman',
                accessor: 'totalBiayaPengiriman',
                Cell: ({ value }) => formatPrice(value)
            },
            {
                Header: 'Detail',
                accessor: 'action',
                Cell: 
                <div className="flex justify-center space-x-4">
                    <button
                        className="px-4 py-2 border border-gray-300 bg-white text-gray-800 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        Detail
                    </button>
                </div>
            }
        ];
        columns = columnsKaryawan
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-between" data-theme="winter">
            <Drawer userRole={userRole}>
                <div className="flex flex-col justify-center items-center mih-h-screen p-8">
                    <h1 className="text-3xl font-bold text-center ">Daftar Purchase Order</h1>
                </div>
                <div className="flex flex-col gap-6 mx-4 my-4 ">
                    <div className="flex flex-col gap-4 justify-center items-center mih-h-screen p-8 border rounded-lg shadow-md">
                        <div className="overflow-x-auto w-full">
                            {error ? (
                                <div>{error}</div>
                            ) : (
                                <DataTable columns={columns} data={orderData} btnText="Buat Order Baru" type="order" loading={loading}/>
                            )}
                        </div>
                    </div>
                </div>
            </Drawer>
            <Footer />
        </main>
    );
}

export default DaftarPurchaseOrderPage
