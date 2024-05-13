import Footer from "@/app/components/common/footer";
import DataTable from "@/app/components/common/datatable/DataTable";
import { viewInvoiceKlien } from "../api/invoice/viewInvoiceKlien";
import { viewInvoice } from "../api/invoice/viewInvoice";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Drawer from "@/app/components/common/drawer";
import Cookies from "js-cookie";
import Link from "next/link";

const InvoiceListPage: React.FC = () => {
    const queryParameters = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const idKlien = queryParameters?.get("idKlien");
    const router = useRouter();
    const [error, setError] = useState('');
    const [invoiceData, setInvoiceData] = useState([]);
    const [loading, setLoading] = useState(true);

    var isLoggedIn = Cookies.get('isLoggedIn');
    const [userRole, setUserRole] = useState('');
    const [companyName, setCompanyName] = useState('');

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/login');
        }
        const role = Cookies.get('role');
        setUserRole(role || '');
        if (role === 'KLIEN') {
            setCompanyName(Cookies.get('companyName'));
        } else if (role === 'KARYAWAN') {
            setCompanyName(queryParameters?.get('companyName'));
        } else {
            setError('Anda tidak diperbolehkan mengakses halaman ini');
        }

    }, [isLoggedIn, router])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const invoiceDataResponse = await viewInvoiceKlien(idKlien);
                if (invoiceDataResponse) {
                    const invoice = invoiceDataResponse['content'];
                    if (invoice) {
                        const mappedData = await mapInvoiceData(invoice);
                        setInvoiceData(mappedData);
                    }
                }
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        const mapInvoiceData = async (invoice) => {
            const mappedData = [];

            for (const item of invoice) {
                let status;

                if (!item.buktiDp || item.buktiDp.status < 1) {
                    status = 'Menunggu DP';
                } else if (!item.buktiPelunasan || item.buktiPelunasan.status < 1) {
                    status = 'Menunggu Pelunasan';
                } else {
                    status = 'Lunas';
                }

                // Fetch order ID based on the invoice ID
                try {
                    const response = await viewInvoice(item.idInvoice);
                    const data = response['content'];
                    const orderId = data.id;
                    mappedData.push({
                        idInvoice: item.idInvoice,
                        totalDp: item.totalDp ? item.totalDp.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }) : '',
                        totalPelunasan: item.totalPelunasan ? item.totalPelunasan.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }) : '',
                        status: status,
                        orderId: orderId
                    });
                } catch (error) {
                    console.error(`Error fetching order ID for invoice ${item.idInvoice}:`, error);
                    mappedData.push({
                        idInvoice: item.idInvoice,
                        totalDp: item.totalDp ? item.totalDp.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }) : '',
                        totalPelunasan: item.totalPelunasan ? item.totalPelunasan.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }) : '',
                        status: status,
                        orderId: 'N/A' // Set default value if fetching fails
                    });
                }
            }

            return mappedData;
        };

        fetchData();
    }, []);

    const columns = [
        {
            Header: 'ID Order',
            accessor: 'orderId',
            Cell: ({ value }) =>
                <Link href={`/order/klien/${value}`} style={{ textDecoration: 'underline' }}>{value}</Link>
        },
        {
            Header: 'Total DP',
            accessor: 'totalDp',
        },
        {
            Header: 'Total Pelunasan',
            accessor: 'totalPelunasan',
        },
        {
            Header: 'Status',
            accessor: 'status',
            Cell: ({ value }) => {
                let badgeClass = '';
                if (value === 'Lunas') {
                    badgeClass = 'badge-success';
                } else {
                    badgeClass = 'badge-warning';
                }
                return <div className={`badge ${badgeClass} text-xs`}>{value}</div>;
            }
        },
        {
            Header: 'Detail',
            Cell: ({ row }) => (
                <div className="flex justify-center space-x-4">
                    <button
                        onClick={() => router.push(`/invoice/detail?id=${row.original.idInvoice}`)}
                        className="px-4 py-2 border border-gray-300 bg-white text-gray-800 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        Detail
                    </button>
                </div>
            ),
        },
    ];

    return (
        <main className="flex min-h-screen flex-col items-center justify-between" data-theme="winter">
            <Drawer userRole={userRole}>
                <div className="flex flex-col justify-center items-center mih-h-screen p-8">
                    <h1 className="text-3xl font-bold text-center ">List Invoice {companyName}</h1>
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
                                        data={invoiceData}
                                        loading={loading}
                                        type='invoice'
                                    />
                                </>)}
                        </div>
                    </div>
                </div>
            </Drawer>
            <Footer />

        </main>
    );
}
export default InvoiceListPage;