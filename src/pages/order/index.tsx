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
    const [orderData, setOrderData] = useState([]); // State to hold truck data
    var columns: any[] = []

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
            },
            {
                Header: 'Jumlah Order Item',
                accessor: 'jumlahOrderItem',
            },
            {
                Header: 'Total Biaya Pengiriman',
                accessor: 'totalBiayaPengiriman',
            },
            {
                Header: 'Action',
                accessor: 'action',
                Cell: <div className="btn btn-primary btn-xs" >Detail</div>
            }
        ];
        columns = columnsKlien
    } else {
        const columnsKaryawan = [
            {
                Header: 'Id Order',
                accessor: 'idOrder',
            },
            // {
            //     Header: 'Customer',
            //     accessor: 'customer',
            // },
            {
                Header: 'Tanggal Pemesanan',
                accessor: 'tanggalPemesanan',
            },
            {
                Header: 'Tanggal Pengiriman',
                accessor: 'tanggalPengiriman',
            },
            {
                Header: 'Jumlah Order Item',
                accessor: 'jumlahOrderItem',
            },
            {
                Header: 'Total Biaya Pengiriman',
                accessor: 'totalBiayaPengiriman',
            },
            {
                Header: 'Action',
                accessor: 'action',
                Cell: <div className="btn btn-primary btn-xs" >Detail</div>
            }
        ];
        columns = columnsKaryawan
    }

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/login');
        }
        const role = Cookies.get('role');
        setUserRole(role || '');

        const fetchData = async () => {
            try {
                if (idUser && token) {
                    if (role == "KLIEN") {
                        const data = await getOrderByKlien(idUser, token);
                        setOrderData(data);
                    } else {
                        const data = await getAllOrder(token);
                        setOrderData(data);
                    }
                } else {
                    throw new Error('User not found');
                }
            } catch (error: any) {
                setError(error.message);
            }
        };

        fetchData(); // Call fetchData function when component mounts
    }, []);

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
                                <DataTable columns={columns} data={orderData} btnText="Buat Order Baru" type="order"/>
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

function handleConfirmOrder(value: string): void {
    console.log(value)
}

