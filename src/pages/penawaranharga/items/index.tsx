import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { fetchPenawaranHargaItems, updatePenawaranHargaItem, deletePenawaranHargaItem } from '@/pages/api/penawaranHargaItem';

// Define the interface
interface PenawaranHargaItem {
  id: string;
  source: string;
  destination: string;
  cddPrice: number;
  cddLongPrice: number;
  wingboxPrice: number;
  fusoPrice: number;
}

const PenawaranHargaItemPage = () => {
  const router = useRouter();
  const { id } = router.query; // Get the id from the URL
  const [items, setItems] = useState<PenawaranHargaItem[]>([]);

  useEffect(() => {
    const loadData = async () => {
      if (id) {
        try {
          const data = await fetchPenawaranHargaItems(id.toString());
          setItems(data);
        } catch (error) {
          console.error('Failed to fetch Penawaran Harga Items', error);
        }
      }
    };

    loadData();
  }, [id]);

  const handleTambahClick = () => {
    router.push('/penawaranharga/items/create');
  };

  return (
    <div>
      <h1>Penawaran Harga Items</h1>
      <button onClick={handleTambahClick} className="btn btn-primary mb-4">
        Tambah Penawaran Item
      </button>
      <table>
        <thead>
          <tr>
            <th>Source</th>
            <th>Destination</th>
            <th>Price CDD</th>
            <th>Price CDD Long</th>
            <th>Price Wingbox</th>
            <th>Price Fuso</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.source}</td>
              <td>{item.destination}</td>
              <td>{item.cddPrice}</td>
              <td>{item.cddLongPrice}</td>
              <td>{item.wingboxPrice}</td>
              <td>{item.fusoPrice}</td>
              <td>
                {/* Implement your "Ubah" and "Hapus" button functionalities here */}
                <button>Ubah</button>
                <button>Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PenawaranHargaItemPage;
