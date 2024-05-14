import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Footer from '@/app/components/common/footer';
import DataTable from "@/app/components/common/datatable/DataTable";
import Cookies from "js-cookie";
import Drawer from "@/app/components/common/drawer";



interface PenawaranHargaRow {
    klienId: string;
    klienName: string;
    penawaranHargaCreatedAt: string;
    penawaranHargaUpdatedAt: string;
    idPenawaranHarga: string;
}

// Interface for clients
interface Klien {
    penawaranHarga: any;
    id: string;
    companyName: string;
}

const CustomNoDataComponent = () => (
    <div style={{ padding: '24px' }}>
        <span>No data available</span>
    </div>
);

const PenawaranHargaPage = () => {
    const [penawaranHarga, setPenawaranHarga] = useState<PenawaranHargaRow[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [error, setError] = useState('');
    var isLoggedIn = Cookies.get('isLoggedIn');
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/login');
        }
        const role = Cookies.get('role');
        setUserRole(role || '');
        if (role !== 'KARYAWAN') {
            setError('Anda tidak diperbolehkan mengakses halaman ini');
        }
    },)


    useEffect(() => {
        const fetchPenawaranHarga = '/api/viewAllPenawaranHarga';
        const fetchKliens = '/api/proxyKlien';

        Promise.all([fetch(fetchPenawaranHarga), fetch(fetchKliens)])
            .then(async ([penawaranHargaRes, kliensRes]) => {
                if (!penawaranHargaRes.ok || !kliensRes.ok) throw new Error('Failed to fetch data');
                const penawaranHargaData = await penawaranHargaRes.json();
                const kliensData = await kliensRes.json();
                const clientsArray: Klien[] = kliensData.content;
                console.log('Clients Array:', clientsArray);

                // Filter out clients that do not have a penawaranHarga
                const filteredClients = clientsArray.filter((klien: Klien) => klien.penawaranHarga);

                const mergedData = filteredClients.map((klien: Klien) => ({
                    klienId: klien.id,
                    klienName: klien.companyName,
                    penawaranHargaCreatedAt: klien.penawaranHarga.penawaranHargaCreatedAt,
                    penawaranHargaUpdatedAt: klien.penawaranHarga.penawaranHargaUpdatedAt,
                    idPenawaranHarga: klien.penawaranHarga.idPenawaranHarga,
                }));

                setPenawaranHarga(mergedData);
            })
            .catch(error => setError('Fetching error: ', error.message))
            .finally(() => setLoading(false));
    }, [penawaranHarga]);

    const columns = useMemo(() => [
        {
            Header: 'Nama Perusahaan',
            accessor: 'klienName',
            Cell: ({ value }) => <span className="font-bold">{value}</span>,
        },
        {
            Header: 'Tanggal Pembuatan',
            accessor: 'penawaranHargaCreatedAt',
            Cell: ({ value }) => new Date(value).toLocaleDateString('id-ID', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            }),
        },
        {
            Header: 'Terakhir Diubah',
            accessor: 'penawaranHargaUpdatedAt',
            Cell: ({ value }) => new Date(value).toLocaleDateString('id-ID', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            }),
        },
        {
            Header: 'Rute',
            accessor: 'idPenawaranHarga',
            Cell: ({ value }) => (
                <button
                    onClick={() => router.push(`/penawaranharga/${value}`)}
                    className="px-4 py-2 border border-gray-300 bg-white text-gray-800 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    Lihat Daftar Rute
                </button>
            ),
        }
    ], [router]);

    return (
        <main className="flex min-h-screen flex-col items-center justify-between" data-theme="winter">
            <Drawer userRole={userRole}>
                <div className="flex flex-col justify-center items-center mih-h-screen p-8">
                    <h1 className="text-3xl font-bold text-center ">Daftar Penawaran Harga</h1>
                </div>

                <div className="flex flex-col gap-6 mx-4 my-4 ">
                    <div className="flex flex-col gap-4 justify-center items-center mih-h-screen p-8 border rounded-lg shadow-md">
                        <div className="overflow-x-auto w-full">
                            {error ? (
                                <div>{error}</div>
                            ) : (
                                <>
                                    <DataTable
                                        data={penawaranHarga}
                                        columns={columns}
                                        loading={loading}
                                        btnText="Tambah Nama Klien" onClick={() => router.push('/penawaranharga/create')}
                                        type='penawaran harga'
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

export default PenawaranHargaPage;
