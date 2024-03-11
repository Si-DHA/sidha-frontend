import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '@/app/components/common/navbar';
import Footer from '@/app/components/common/footer';
import DataTable from "@/app/components/common/datatable/DataTable";

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
    name: string;
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

                const mergedData = clientsArray.map((klien: Klien) => ({
                    klienId: klien.id,
                    klienName: klien.name,
                    penawaranHargaCreatedAt: klien.penawaranHarga.penawaranHargaCreatedAt,
                    penawaranHargaUpdatedAt: klien.penawaranHarga.penawaranHargaUpdatedAt,
                    idPenawaranHarga: klien.penawaranHarga.idPenawaranHarga,
                }));

                setPenawaranHarga(mergedData);
            })
            .catch(error => console.error('Fetching error:', error))
            .finally(() => setLoading(false));
    }, []);

    const columns = useMemo(() => [
        {
            Header: 'Nama Perusahaan',
            accessor: 'klienName',
            Cell: ({ value }) => <span className="font-bold">{value}</span>, 
        },
        {
            Header: 'Tanggal Pembuatan',
            accessor: 'penawaranHargaCreatedAt',
            Cell: ({ value }) => new Date(value).toLocaleDateString(),
        },
        // {
        //     Header: 'Date Updated',
        //     accessor: 'penawaranHargaUpdatedAt',
        //     Cell: ({ value }) => new Date(value).toLocaleDateString(),
        // },
        {
            Header: 'Rute',
            accessor: 'idPenawaranHarga',
            Cell: ({ value }) => (
                <button
                    onClick={() => router.replace(`/penawaranharga/${value}`)}
                    className="px-4 py-2 border border-gray-300 bg-white text-gray-800 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    Lihat Daftar Rute
                </button>
            ),
        }
    ], [router]);

    return (
        <main className={`flex min-h-screen flex-col`} data-theme="cmyk">
            <Navbar />
            <div className="flex-1 py-6 px-4">
                <div className="container mx-auto">
                    <div className="text-center lg:text-left">
                        <h1 className="text-3xl font-bold">Daftar Penawaran Harga</h1>
                        <br />
                    </div>
                    <DataTable
                        data={penawaranHarga}
                        columns={columns}
                        loading={loading}
                        NoDataComponent={CustomNoDataComponent}
                        btnText="Tambah Nama Klien" onClick={() => router.push('/penawaranharga/create')}
                        type='penawaranHarga'
                    />
                </div>
            </div>
            <Footer />
        </main>
    );
}

export default PenawaranHargaPage;
