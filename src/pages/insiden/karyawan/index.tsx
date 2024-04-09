import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Navbar from '@/app/components/common/navbar';
import Footer from '@/app/components/common/footer';
import DataTable from '@/app/components/common/datatable/DataTable';
import { getAllInsidens } from '@/pages/api/insiden/getAllInsidens';

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
    const router = useRouter();
    const karyawanId = Cookies.get('idUser');

    useEffect(() => {
        if (karyawanId) {
            getAllInsidens()
                .then(data => {
                    setInsidens(data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Fetching error:', error);
                    setLoading(false);
                });
        } else {
            router.push('/login');
        }
    }, [karyawanId, router]);

    const columns = [
        {
            Header: 'Tanggal Pembuatan',
            accessor: 'createdAt',
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
            Header: 'Sopir',
            accessor: 'sopirName',
        },
        {
            Header: 'Actions',
            accessor: 'id',
            Cell: ({ value }) => (
                <button
                    onClick={() => router.push(`/insiden/karyawan/detail/${value}`)}
                    className="px-4 py-2 border border-gray-300 bg-white text-gray-800 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    Details
                </button>
            ),
        },
    ];

    return (
        <>
            <Navbar />
            <div className="container mx-auto p-4">
                <h2 className="text-2xl font-bold mb-2">Semua Insiden</h2>
                <DataTable
                    data={insidens}
                    columns={columns}
                    loading={loading}
                    NoDataComponent={CustomNoDataComponent}
                />
            </div>
            <Footer />
        </>
    );
};

export default KaryawanInsidenIndexPage;
