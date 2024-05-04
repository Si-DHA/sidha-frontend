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
    const router = useRouter();
    const karyawanId = Cookies.get('idUser');
    const [error, setError] = useState('');

    var isLoggedIn = Cookies.get('isLoggedIn');
    const [userRole, setUserRole] = useState('');
  
    useEffect(() => {
      if (!isLoggedIn) {
        router.push('/login');
      }
      const role = Cookies.get('role');
      if (role === 'KARYAWAN') {
        setUserRole(role);
        getAllInsidens()
                .then(data => {
                    console.log("Insiden Data:", data); // Log the insidenData array
                    setInsidens(data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Fetching error:', error);
                    setLoading(false);
                });
      } else {
        setError('You are not allowed to access this page');
      }
  
    }, [isLoggedIn, karyawanId, router])

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
            
            <Drawer userRole={userRole}>
            <main className="flex flex-col items-center justify-between" data-theme="winter">
                    <h2 className="text-2xl font-bold mb-4 mt-6">Laporan Insiden</h2>
                <DataTable
                    data={insidens}
                    columns={columns}
                    loading={loading}
                    NoDataComponent={CustomNoDataComponent}
                />
            </main>
            </Drawer>
            <Footer />
        </>
    );
};

export default KaryawanInsidenIndexPage;
