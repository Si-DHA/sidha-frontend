import Footer from "@/app/components/common/footer";
import DataTable from "@/app/components/common/datatable/DataTable";
import { viewAllTruk } from "../api/truk/viewAllTruk";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Drawer from "@/app/components/common/drawer";
import Cookies from "js-cookie";
import Link from "next/link";

const TrukPage: React.FC = () => {
    const router = useRouter();
    const [error, setError] = useState('');
    const [trukData, setTrukData] = useState([]); // State to hold truck data
    const [loading, setLoading] = useState(true);

    var isLoggedIn = Cookies.get('isLoggedIn');
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/login');
        }
        const role = Cookies.get('role');
        setUserRole(role || '');
        if (role !== 'ADMIN') {
            setError('Anda tidak diperbolehkan mengakses halaman ini');
        }

    }, [isLoggedIn, router])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const trukDataResponse = await viewAllTruk();
                const trukData = trukDataResponse['content']
                if (trukData) {
                    setTrukData(trukData);
                }
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData(); // Call fetchData function when component mounts
    }, []);

    const columns = [
        {
            Header: 'Nomor Polisi',
            accessor: 'licensePlate',
        },
        {
            Header: 'Tipe',
            accessor: 'type',
        },
        {
            Header: 'Kubikasi',
            accessor: 'kubikasiBox',
        },
        {
            Header: 'Expired KIR',
            accessor: 'expiredKir',
            Cell: ({ value }) => (formatDate(value))
        },
        {
            Header: 'Sopir',
            Cell: ({ row }) => (
                <>
                    {row.original.sopir ? (
                        <Link href={`/list-user/detail?id=${row.original.sopir.id}`} style={{ textDecoration: 'underline' }}>
                            {row.original.sopir.name}
                        </Link>
                    ) : (
                        '-'
                    )}
                </>
            )
        },
        {
            Header: 'Detail',
            Cell: ({ row }) => (
                <div className="flex justify-center space-x-4">
                    <button
                        onClick={() => router.push(`/truk/detail?id=${row.original.idTruk}`)}
                        className="px-4 py-2 border border-gray-300 bg-white text-gray-800 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        Detail
                    </button>
                </div>
            ),
        },
    ];

    const formatDate = (date) => {
        const dateObj = new Date(date);
        const day = dateObj.getDate().toString().padStart(2, '0');
        const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
        const year = dateObj.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const createTruk = () => {
        router.push('/truk/create');
    };


    return (
        <main className="flex min-h-screen flex-col items-center justify-between" data-theme="winter">
            <Drawer userRole={userRole}>
                <div className="flex flex-col justify-center items-center mih-h-screen p-8">
                    <h1 className="text-3xl font-bold text-center ">List Truk PT DHA</h1>
                </div>

                <div className="flex flex-col gap-6 mx-4 my-4 ">
                    <div className="flex flex-col gap-4 justify-center items-center mih-h-screen p-8 border rounded-lg shadow-md">
                        <div className="overflow-x-auto w-full">
                            {error ? (
                                <div>{error}</div>
                            ) : (
                                <>
                                    <DataTable
                                        columns={columns}
                                        data={trukData}
                                        btnText="Tambah truk"
                                        onClick={createTruk}
                                        loading={loading}
                                        type='truk' />
                                </>)}
                        </div>
                    </div>
                </div>
            </Drawer>
            <Footer />
        </main>
    );
}
export default TrukPage;