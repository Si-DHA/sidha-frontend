import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '@/app/components/common/navbar';
import Footer from '@/app/components/common/footer';
import DataTable, { TableColumn } from 'react-data-table-component';
import { Inter } from "next/font/google"; 

const inter = Inter({ subsets: ["latin"] });

interface PenawaranHargaRow {
    klien: {
        name: string;
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
        { name: 'Klien', selector: row => row.klien.name, sortable: true },
        { name: 'Date Created', selector: row => row.penawaranHargaCreatedAt, sortable: true },
        { name: 'Date Updated', selector: row => row.penawaranHargaUpdatedAt, sortable: true },
        {
            name: 'Details',
            cell: (row) => <button onClick={() => router.push(`/penawaranharga/${row.idPenawaranHarga}/details`)}>View Details</button>,
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
                        <p className="py-6">Here you can view the list of penawaran harga and their details.</p>
                    </div>
                    <div className="flex justify-between mb-4">
                        {/* You can add more controls here if needed */}
                        <button className="btn btn-primary" onClick={() => router.push('/penawaranharga/create')}>
                            Tambah Penawaran Harga
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
};

export default PenawaranHargaPage;


// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/router';
// import Navbar from '@/app/components/common/navbar';
// import Footer from '@/app/components/common/footer';
// import DataTable, { TableColumn } from 'react-data-table-component';

// interface PenawaranHargaRow {
//     klien: {
//         companyName: string;
//     };
//     penawaranHargaCreatedAt: string;
//     penawaranHargaUpdatedAt: string;
//     idPenawaranHarga: string;
// }

// const fetchPenawaranHarga = async (): Promise<PenawaranHargaRow[]> => {
//     const response = await fetch('/api/penawaran-harga/view-all');
//     if (!response.ok) {
//         throw new Error('Failed to fetch');
//     }
//     return await response.json();
// };

// const CustomNoDataComponent = () => (
//     <div style={{ padding: '24px' }}>
//       <span>No data available</span>
//     </div>
// );

// const PenawaranHargaPage = () => {
//     const [penawaranHarga, setPenawaranHarga] = useState<PenawaranHargaRow[]>([]);
//     const [loading, setLoading] = useState(true);
//     const router = useRouter();

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const result = await fetchPenawaranHarga();
//                 setPenawaranHarga(result);
//             } catch (error) {
//                 console.error(error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchData();
//     }, []);

//     const columns: TableColumn<PenawaranHargaRow>[] = [
//         { name: 'Klien', selector: (row) => row.klien.companyName, sortable: true },
//         { name: 'Date Created', selector: (row) => row.penawaranHargaCreatedAt, sortable: true },
//         { name: 'Date Updated', selector: (row) => row.penawaranHargaUpdatedAt, sortable: true },
//         {
//             name: 'Details',
//             cell: (row) => <button onClick={() => router.push(`/penawaranharga/${row.idPenawaranHarga}/details`)}>View Penawaran Items</button>,
//             ignoreRowClick: true,
//             allowOverflow: true,
//             button: true,
//         },
//     ];

//     return (
//         <div className="flex flex-col min-h-screen">
//             <Navbar />
//             <main className="flex-grow">
//                 <div className="container mx-auto px-4 py-8">
//                     <h1 className="text-xl font-semibold my-4">Penawaran Harga</h1>
//                     <button className="btn btn-primary mb-4" onClick={() => router.push('/penawaranharga/create')}>
//                         Tambah Penawaran Harga
//                     </button>
//                     <DataTable 
//                         columns={columns} 
//                         data={penawaranHarga} 
//                         progressPending={loading}
//                         noDataComponent={<CustomNoDataComponent />} 
//                     />
//                 </div>
//             </main>
//             <Footer />
//         </div>
//     );
// };

// export default PenawaranHargaPage;

// import React, { useState, useEffect } from 'react';
// import DataTable, { TableColumn } from 'react-data-table-component';
// import Modal from '@/app/components/common/modal';
// import createPenawaranHarga from '../api/createPenawaranHarga';
// import Navbar from '@/app/components/common/navbar';
// import Footer from '@/app/components/common/footer';

// // Define the interfaces
// interface Klien {
//     id: string;
//     name: string;
// }

// interface PenawaranHargaRow {
//     klien: {
//         companyName: string;
//     };
//     penawaranHargaCreatedAt: string;
//     penawaranHargaUpdatedAt: string;
//     idPenawaranHarga: string;
// }

// // Fetch clients function (adjust the endpoint as needed)
// const fetchKliens = async (): Promise<Klien[]> => {
//     const response = await fetch('/api/proxyKlien');
//     if (!response.ok) {
//         throw new Error('Failed to fetch clients');
//     }
//     return response.json();
// };

// // Fetch Penawaran Harga function (adjust the endpoint as needed)
// const fetchPenawaranHarga = async (): Promise<PenawaranHargaRow[]> => {
//     const response = await fetch('/api/penawaran-harga/view-all');
//     if (!response.ok) {
//         throw new Error('Failed to fetch penawaran harga');
//     }
//     return response.json();
// };

// // Custom component for no data
// const CustomNoDataComponent = () => (
//     <div style={{ padding: '24px' }}>
//         <span>No data available</span>
//     </div>
// );

// // Main component
// const PenawaranHargaPage = () => {
//     const [penawaranHarga, setPenawaranHarga] = useState<PenawaranHargaRow[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [kliens, setKliens] = useState<Klien[]>([]);
//     const [selectedKlienId, setSelectedKlienId] = useState('');

//     useEffect(() => {
//         const loadData = async () => {
//             try {
//                 const kliensData = await fetchKliens();
//                 setKliens(kliensData);
//                 const penawaranHargaData = await fetchPenawaranHarga();
//                 setPenawaranHarga(penawaranHargaData);
//             } catch (error) {
//                 console.error(error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         loadData();
//     }, []);

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         try {
//             // Assuming createPenawaranHarga is an API call to your backend to create a new penawaran harga
//             // You need to implement this function to make the actual request
//             await createPenawaranHarga({ idKlien: selectedKlienId });
//             const updatedPenawaranHarga = await fetchPenawaranHarga();
//             setPenawaranHarga(updatedPenawaranHarga);
//             setIsModalOpen(false); // Close the modal on success
//         } catch (error) {
//             console.error('Failed to create Penawaran Harga:', error);
//             alert('Failed to create Penawaran Harga');
//         }
//     };

//     const columns: TableColumn<PenawaranHargaRow>[] = [
//         { name: 'Klien', selector: row => row.klien.companyName, sortable: true },
//         { name: 'Date Created', selector: row => row.penawaranHargaCreatedAt, sortable: true },
//         { name: 'Date Updated', selector: row => row.penawaranHargaUpdatedAt, sortable: true },
//         // Add more columns as needed
//     ];

//     return (
//         <div className="flex flex-col min-h-screen">
//             <Navbar />
//             <main className="flex-grow">
//                 <div className="container mx-auto px-4 py-8">
//                     <h1 className="text-xl font-semibold my-4">Penawaran Harga</h1>
//                     <button className="btn btn-primary mb-4" onClick={() => setIsModalOpen(true)}>
//                         Tambah Penawaran Harga
//                     </button>
//                     <DataTable
//                         columns={columns}
//                         data={penawaranHarga}
//                         progressPending={loading}
//                         noDataComponent={<CustomNoDataComponent />}
//                     />
//                 </div>
//             </main>
//             <Footer />

//             {isModalOpen && (
//                 <Modal onClose={() => setIsModalOpen(false)}>
//                     <form onSubmit={handleSubmit}>
//                         <div>
//                             <label htmlFor="klienId">Select a client:</label>
//                             <select
//                                 id="klienId"
//                                 value={selectedKlienId}
//                                 onChange={(e) => setSelectedKlienId(e.target.value)}
//                                 required
//                             >
//                                 <option value="">Select a client</option>
//                                 {kliens.map((klien) => (
//                                     <option key={klien.id} value={klien.id}>{klien.name}</option>
//                                 ))}
//                             </select>
//                         </div>
//                         <button type="submit">Submit</button>
//                     </form>
//                 </Modal>
//             )}
//         </div>
//     );
// };

// export default PenawaranHargaPage;
