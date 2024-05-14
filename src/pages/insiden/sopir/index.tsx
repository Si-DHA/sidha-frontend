import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Footer from '@/app/components/common/footer';
import DataTable from '@/app/components/common/datatable/DataTable';
import { getInsidensBySopir } from '@/pages/api/insiden/getInsidensBySopir';
import Drawer from '@/app/components/common/drawer';
import { format } from 'date-fns';
import idLocale from 'date-fns/locale/id';

interface InsidenRow {
    id: string;
    createdAt: string;
    kategori: string;
    orderItem?: {
        id: string;
        rute: Array<{
            source: string;
            destination: string;
        }>;
    };
}

const CustomNoDataComponent = () => (
    <div style={{ padding: '24px' }}>
        <span>No data available</span>
    </div>
);

const IndexPage = () => {
    const [insidens, setInsidens] = useState<InsidenRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();
    const isLoggedIn = Cookies.get('isLoggedIn');
    const [userRole, setUserRole] = useState('');
    var sopirId;

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/login');
        }
        const role = Cookies.get('role');
        setUserRole(role || '');
        if (role === 'SOPIR') {
            sopirId = Cookies.get('idUser');
            if (sopirId) {
                getInsidensBySopir(sopirId)
                    .then(data => {
                        const activeInsidens = data.filter(insiden => !insiden.deleted);
                        setInsidens(activeInsidens);
                    })
                    .catch(error => {
                        setError(`Gagal memuat insiden ${error.message ? ` : ${error.message}` : ''}`)
                    }).finally(() => {
                        setLoading(false)
                    }
                );
            } else {
                setError('ID tidak ditemukan');
            }
        } else {
            setError('Anda tidak diperbolehkan mengakses halaman ini');
        }

    }, [sopirId, router]);


    const columns = [
        {
            Header: 'Tanggal Pembuatan',
            accessor: row => format(new Date(row.updatedAt || row.createdAt), 'dd MMMM yyyy, HH:mm', { locale: idLocale }),
            Cell: ({ value }) => value,
        },
        {
            Header: 'Kategori',
            accessor: 'kategori',
        },
        {
            Header: 'Status',
            accessor: 'status',
        },
        {
            Header: 'Rute',
            accessor: (row: InsidenRow) => row.orderItem && row.orderItem.rute.length > 0
                ? `${row.orderItem.rute[0].source} to ${row.orderItem.rute[0].destination}`
                : 'N/A',
        },
        {
            Header: 'Actions',
            accessor: 'id',
            Cell: ({ value }) => (
                <button
                    onClick={() => router.push(`/insiden/sopir/detail/${value}`)}
                    className="px-4 py-2 border border-gray-300 bg-white text-gray-800 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    Detail Insiden
                </button>
            ),
        },
    ];

    return (
        <>
            <main className="flex min-h-screen flex-col items-center justify-between" data-theme="winter">
                <Drawer userRole={userRole}>
                    <div className="flex flex-col justify-center items-center mih-h-screen p-8">
                        <h1 className="text-3xl font-bold text-center ">Laporan Insiden Anda</h1>
                    </div>

                    <div className="flex flex-col gap-6 mx-4 my-4 ">
                        <div className="flex flex-col gap-4 justify-center items-center mih-h-screen p-8 border rounded-lg shadow-md">
                            <div className="overflow-x-auto w-full">
                                {error ? (
                                    <div>{error}</div>
                                ) : (
                                    <>
                                        {insidens ? ( // Check if insiden is empty
                                            <DataTable
                                                data={insidens}
                                                columns={columns}
                                                loading={loading}
                                                btnText="Buat Laporan" onClick={() => router.push(`/insiden/sopir/create`)}
                                                type='insiden'
                                            />
                                        ) : (
                                            <DataTable
                                                data={[]}
                                                columns={columns}
                                                loading={loading}
                                                btnText="Buat Laporan" onClick={() => router.push(`/insiden/sopir/create`)}
                                                type='insiden'
                                            />
                                        )}
                                    </>)}
                            </div>
                        </div>
                    </div>
                </Drawer>
                <Footer />
            </main>
        </>
    );

};

export default IndexPage;
