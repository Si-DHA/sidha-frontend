import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '@/app/components/common/navbar';
import Footer from '@/app/components/common/footer';
import DataTable, { TableColumn } from 'react-data-table-component';

interface PenawaranHargaRow {
    klien: {
        companyName: string;
    };
    penawaranHargaCreatedAt: string;
    penawaranHargaUpdatedAt: string;
    idPenawaranHarga: string;
}

const fetchPenawaranHarga = async (): Promise<PenawaranHargaRow[]> => {
    const response = await fetch('/api/penawaran-harga/view-all');
    if (!response.ok) {
        throw new Error('Failed to fetch');
    }
    return await response.json();
};

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
        const fetchData = async () => {
            try {
                const result = await fetchPenawaranHarga();
                setPenawaranHarga(result);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const columns: TableColumn<PenawaranHargaRow>[] = [
        { name: 'Klien', selector: (row) => row.klien.companyName, sortable: true },
        { name: 'Date Created', selector: (row) => row.penawaranHargaCreatedAt, sortable: true },
        { name: 'Date Updated', selector: (row) => row.penawaranHargaUpdatedAt, sortable: true },
        {
            name: 'Details',
            cell: (row) => <button onClick={() => router.push(`/penawaranharga/${row.idPenawaranHarga}/details`)}>View Penawaran Items</button>,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-xl font-semibold my-4">Penawaran Harga</h1>
                    <button className="btn btn-primary mb-4" onClick={() => router.push('/penawaranharga/create')}>
                        Tambah Penawaran Harga
                    </button>
                    <DataTable 
                        columns={columns} 
                        data={penawaranHarga} 
                        progressPending={loading}
                        noDataComponent={<CustomNoDataComponent />} 
                    />
                </div>
            </main>
            <Footer />
        </div>
    );
};



export default PenawaranHargaPage;
