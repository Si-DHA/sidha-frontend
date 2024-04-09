import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Navbar from '@/app/components/common/navbar';
import Footer from '@/app/components/common/footer';
import DataTable from '@/app/components/common/datatable/DataTable';
import { getInsidensBySopir } from '@/pages/api/insiden/getInsidensBySopir';

interface InsidenRow {
    id: string;
    createdAt: string;
    kategori: string;
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
            Header: 'Date Created',
            accessor: 'createdAt',
            Cell: ({ value }) => new Date(value).toLocaleDateString(),
        },
        {
            Header: 'Category',
            accessor: 'kategori',
        },
        {
            Header: 'Status',
            accessor: 'status',
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
            <Navbar />
            <div className="container mx-auto p-4">
                <h2 className="text-2xl font-semibold">Insiden Anda</h2>
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

export default IndexPage;
