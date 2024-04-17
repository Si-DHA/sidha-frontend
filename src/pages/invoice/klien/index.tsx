import Footer from "@/app/components/common/footer";
import DataTable from "@/app/components/common/datatable/DataTable";
import { viewInvoiceKlien } from "../api/invoice/viewInvoiceKlien";
import { viewInvoice } from "../api/invoice/viewInvoice";
import { viewAllKlien } from "../../api/user/viewKlien";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Drawer from "@/app/components/common/drawer";
import Cookies from "js-cookie";
import Link from "next/link";

const InvoiceKlienPage: React.FC = () => {
    const router = useRouter();
    const [error, setError] = useState('');
    const [klienData, setKlienData] = useState([]);

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
        const fetchData = async () => {
            try {
                const klienDataResponse = await viewAllKlien();
                setKlienData(klienDataResponse['content']);
            } catch (error: any) {
                setError(error.message);
            }
        };

        fetchData();
    }, []);

    const columns = [
        {
            Header: 'Nama Perusahaan',
            accessor: 'id',
            Cell: ({ row }) => (
                <Link href={`/list-user/detail?id=${row.original.id}`}>
                    {row.original.companyName}
                </Link>
            )
        },
        {
            Header: 'Nama CP',
            accessor: 'name',
            Cell: ({ row }) => (
                <Link href={`/list-user/detail?id=${row.original.id}`}>
                    {row.original.name}
                </Link>
            )
        },
        {
            Header: 'Alamat Perusahaan',
            accessor: 'address',
        },
        {
            Header: 'Kelola',
            Cell: ({ row }) => (
                <div className="flex justify-center space-x-4">
                    <button
                        onClick={() => router.push(`/invoice?idKlien=${row.original.id}&&companyName=${row.original.companyName}`)}
                        className="px-4 py-2 border border-gray-300 bg-white text-gray-800 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        List Invoice
                    </button>
                </div>
            ),
        },
    ];

    return (
        <main className="flex min-h-screen flex-col items-center justify-between" data-theme="winter">
            <Drawer userRole={userRole}>
                <div className="flex flex-col justify-center items-center mih-h-screen p-8">
                    <h1 className="text-3xl font-bold text-center ">List Invoice Klien</h1>
                </div>

                <div className="flex flex-col gap-6 mx-4 my-4 ">
                    <div className="flex flex-col gap-4 justify-center items-center mih-h-screen p-8 border rounded-lg shadow-md">
                        <div className="overflow-x-auto w-full">
                            {error ? (
                                <div>{error}</div>
                            ) : (
                                <>
                                    {klienData ? ( // Check if trukData is empty
                                        <DataTable 
                                            columns={columns} 
                                            data={klienData} 
                                        />
                                    ) : (
                                        <DataTable 
                                            columns={columns} 
                                            data={[]} 
                                        />
                                    )}
                                </>)}
                        </div>
                    </div>
                </div>
            </Drawer>
            <Footer />

        </main>
    );
}
export default InvoiceKlienPage;