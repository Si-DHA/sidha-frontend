import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '@/app/components/common/navbar';
import Footer from '@/app/components/common/footer';
import DataTable, { TableColumn } from 'react-data-table-component';

interface PenawaranHargaItem {
  id: string;
  source: string;
  destination: string;
  cddPrice: number;
  cddLongPrice: number;
  wingboxPrice: number;
  fusoPrice: number;
}

const CustomNoDataComponent = () => (
  <div style={{ padding: '24px' }}>
    <span>No data available</span>
  </div>
);

const PenawaranHargaItemPage = () => {
  const [items, setItems] = useState<PenawaranHargaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { idPenawaranHarga } = router.query;

  useEffect(() => {
    // Only attempt to fetch data if idPenawaranHarga is available
    if (idPenawaranHarga) {
      (async () => {
        setLoading(true); // Start loading
        try {
          const fetchUrl = `/api/viewAllPenawaranHargaItem?idPenawaranHarga=${idPenawaranHarga}`;
          const response = await fetch(fetchUrl);
  
          if (!response.ok) {
            const errorData = await response.json(); 
            throw new Error(errorData.message || 'Failed to fetch data');
          }
  
          const data: PenawaranHargaItem[] = await response.json();
          setItems(data); // Update state with the fetched data
        } catch (error) {
          console.error('Failed to fetch Penawaran Harga items:', error);
        } finally {
          setLoading(false); // Stop loading regardless of the outcome
        }
      })();
    }
  }, [idPenawaranHarga]); // Re-run this effect if idPenawaranHarga changes
  

  const columns: TableColumn<PenawaranHargaItem>[] = [
    { name: 'Source', selector: row => row.source, sortable: true },
    { name: 'Destination', selector: row => row.destination, sortable: true },
    { name: 'CDD Price', selector: row => `${row.cddPrice}`, sortable: true },
    { name: 'CDD Long Price', selector: row => `${row.cddLongPrice}`, sortable: true },
    { name: 'Wingbox Price', selector: row => `${row.wingboxPrice}`, sortable: true },
    { name: 'Fuso Price', selector: row => `${row.fusoPrice}`, sortable: true },
    {
      name: 'Actions',
      cell: (row) => (
        <>
          <button onClick={() => router.push(`/penawaranharga/items/edit/${row.id}`)}>Edit</button>
          <button onClick={() => console.log('Delete functionality to be implemented')}>Delete</button>
        </>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex-1 py-6 px-4">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold">Penawaran Harga Items for {idPenawaranHarga}</h1>
          
          {typeof idPenawaranHarga === 'string' && (
            <button
              className="mb-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300"
              onClick={() => router.push(`/penawaranharga/${idPenawaranHarga}/create`)}
            >
              Add New Penawaran Harga Item
            </button>
          )}
          
          <DataTable
            columns={columns}
            data={items}
            progressPending={loading}
            noDataComponent={<CustomNoDataComponent />}
          />
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default PenawaranHargaItemPage;


// import { useRouter } from 'next/router';
// import React, { useEffect, useState } from 'react';
// import { fetchPenawaranHargaItems, updatePenawaranHargaItem, deletePenawaranHargaItem } from '@/pages/api/penawaranHargaItem';

// // Define the interface
// interface PenawaranHargaItem {
//   id: string;
//   source: string;
//   destination: string;
//   cddPrice: number;
//   cddLongPrice: number;
//   wingboxPrice: number;
//   fusoPrice: number;
// }

// const PenawaranHargaItemPage = () => {
//   const router = useRouter();
//   const { id } = router.query; // Get the id from the URL
//   const [items, setItems] = useState<PenawaranHargaItem[]>([]);

//   useEffect(() => {
//     const loadData = async () => {
//       if (id) {
//         try {
//           const data = await fetchPenawaranHargaItems(id.toString());
//           setItems(data);
//         } catch (error) {
//           console.error('Failed to fetch Penawaran Harga Items', error);
//         }
//       }
//     };

//     loadData();
//   }, [id]);

//   const handleTambahClick = () => {
//     router.push('/penawaranharga/items/create');
//   };

//   return (
//     <div>
//       <h1>Penawaran Harga Items</h1>
//       <button onClick={handleTambahClick} className="btn btn-primary mb-4">
//         Tambah Penawaran Item
//       </button>
//       <table>
//         <thead>
//           <tr>
//             <th>Source</th>
//             <th>Destination</th>
//             <th>Price CDD</th>
//             <th>Price CDD Long</th>
//             <th>Price Wingbox</th>
//             <th>Price Fuso</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {items.map((item) => (
//             <tr key={item.id}>
//               <td>{item.source}</td>
//               <td>{item.destination}</td>
//               <td>{item.cddPrice}</td>
//               <td>{item.cddLongPrice}</td>
//               <td>{item.wingboxPrice}</td>
//               <td>{item.fusoPrice}</td>
//               <td>
//                 {/* Implement your "Ubah" and "Hapus" button functionalities here */}
//                 <button>Ubah</button>
//                 <button>Hapus</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default PenawaranHargaItemPage;
