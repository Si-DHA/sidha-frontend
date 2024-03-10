import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '@/app/components/common/navbar';
import Footer from '@/app/components/common/footer';
import DataTable, { TableColumn } from 'react-data-table-component';
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

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

    // Define columns outside useEffect
    const columns: TableColumn<PenawaranHargaRow>[] = [
        { name: 'Client Name', selector: row => row.klienName || 'No Client', sortable: true },
        { name: 'Date Created', selector: row => new Date(row.penawaranHargaCreatedAt).toLocaleDateString(), sortable: true },
        { name: 'Date Updated', selector: row => new Date(row.penawaranHargaUpdatedAt).toLocaleDateString(), sortable: true },
        {
            name: 'Details',
            cell: (row) => <button onClick={() => router.push(`/penawaranharga/${row.idPenawaranHarga}`)}>View Details</button>,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

    return (
        <main className={`flex min-h-screen flex-col ${inter.className}`} data-theme="cmyk">
            <Navbar />
            <div className="flex-1 py-6 px-4">
                <div className="container mx-auto">
                    <div className="text-center lg:text-left">
                        <h1 className="text-3xl font-bold">Daftar Penawaran Harga</h1>
                        <br></br>
                    </div>
                    <div className="flex justify-between mb-4">
                        <button className="btn btn-primary" onClick={() => router.push('/penawaranharga/create')}>
                            Tambah Perusahaan
                        </button>
                    </div>
                    <DataTable
                        columns={columns}
                        data={penawaranHarga}
                        progressPending={loading}
                        noDataComponent={<CustomNoDataComponent />}
                        customStyles={{
                            headCells: {
                                style: {
                                    backgroundColor: "#f0f0f0",
                                },
                            },
                        }}
                    />
                </div>
            </div>
            <Footer />
        </main>
    );
}

export default PenawaranHargaPage;
