import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Navbar from '@/app/components/common/navbar';
import Footer from '@/app/components/common/footer';
import DataTable from '@/app/components/common/datatable/DataTable';
import { getAllInsidens } from '@/pages/api/insiden/getAllInsidens';
import Drawer from "@/app/components/common/drawer";

interface InsidenRow {
    id: string;
    createdAt: string;
    updatedAt: string;
    kategori: string;
    status: string;
    sopirId: string;
    sopirName: string;
}

const CustomNoDataComponent = () => (
    <div style={{ padding: '24px' }}>
        <span>No data available</span>
    </div>
);

const KaryawanInsidenIndexPage = () => {
    const [insidens, setInsidens] = useState<InsidenRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();
    const isLoggedIn = Cookies.get('isLoggedIn');
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/login');
        }
        const role = Cookies.get('role');
        setUserRole(role || '');
        if (role === 'KARYAWAN') {
            getAllInsidens()
                .then(data => {
                    setInsidens(data);
                })
                .catch(error => {
                    console.error('Fetching error:', error);
                    setError(`Gagal memuat insiden ${error.message ? ` : ${error.message}` : ''}`)
                }).finally(() =>{
                    setLoading(false);
                });
        } else {
            setError('Anda tidak diperbolehkan mengakses halaman ini');
        }
    }, [isLoggedIn, userRole, router]);

    const columns = [
        {
            Header: 'Tanggal Pembuatan',
            accessor: (row) => {
                // Use updatedAt if available; otherwise, use createdAt
                const dateToFormat = row.updatedAt || row.createdAt;
                // Create a Date object
                const date = new Date(dateToFormat);
                // Format the date and time
                const formattedDate = date.toLocaleString('id-ID', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                });
                return formattedDate;
            },
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
            Header: 'Nama Sopir',
            accessor: 'sopirName',
        },
        {
            Header: 'Detail',
            accessor: 'id',
            Cell: ({ value }) => (
                <button
                    onClick={() => router.push(`/insiden/karyawan/detail/${value}`)}
                    className="px-4 py-2 border border-gray-300 bg-white text-gray-800 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    Lihat Laporan
                </button>
            ),
        },
    ];

    return (
        <>
            <main className="flex min-h-screen flex-col items-center justify-between" data-theme="winter">
                <Drawer userRole={userRole}>
                    <div className="flex flex-col justify-center items-center mih-h-screen p-8">
                        <h1 className="text-3xl font-bold text-center ">Laporan Insiden</h1>
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
                                                type='insiden'
                                            />
                                        ) : (
                                            <DataTable
                                                data={[]}
                                                columns={columns}
                                                loading={loading}
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

export default KaryawanInsidenIndexPage;
