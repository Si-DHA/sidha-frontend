import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Navbar from '@/app/components/common/navbar';
import Footer from '@/app/components/common/footer';
import DataTable from '@/app/components/common/datatable/DataTable';
import { getInsidensBySopir } from '@/pages/api/insiden/getInsidensBySopir';
import Drawer from '@/app/components/common/drawer';

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
    const router = useRouter();
    const sopirId = Cookies.get('idUser');

    useEffect(() => {
        if (sopirId) {
            getInsidensBySopir(sopirId)
                .then(data => {
                    const activeInsidens = data.filter(insiden => !insiden.deleted);
                    setInsidens(activeInsidens);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Fetching error:', error);
                    setLoading(false);
                });
        } else {
            router.push('/login');
        }
    }, [sopirId, router]);


    const columns = [
        {
            Header: 'Tanggal Pembuatan',
            accessor: row => new Date(row.updatedAt || row.createdAt).toLocaleString('id-ID', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            }),
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
            <Drawer userRole='userRole'>
            <main className="flex flex-col items-center justify-between" data-theme="winter">
                    <h2 className="text-2xl font-bold mb-4">Laporan Insiden Anda</h2>
                <DataTable
                    data={insidens}
                    columns={columns}
                    loading={loading}
                    NoDataComponent={CustomNoDataComponent}
                    btnText="Buat Laporan" onClick={() => router.push(`/insiden/sopir/create`)}
                    type='insiden'
                />
            </main>
            </Drawer>
            <Footer />
        </>
    );
    
};

export default IndexPage;
