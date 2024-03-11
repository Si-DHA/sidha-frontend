import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '@/app/components/common/navbar';
import Footer from '@/app/components/common/footer';
import DataTable from "@/app/components/common/datatable/DataTable";
import { FiEdit, FiSave, FiTrash2 } from 'react-icons/fi';
import { deletePenawaranHargaItem } from '@/pages/api/deletePenawaranHargaItem';

interface PenawaranHargaItem {
  id: string;
  source: string;
  destination: string;
  cddPrice: number;
  cddLongPrice: number;
  wingboxPrice: number;
  fusoPrice: number;
  isEditing?: boolean;
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
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const handleBack = () => {
    router.push('/penawaranharga');
  };


  useEffect(() => {
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
  }, [idPenawaranHarga]);

  const formatCurrency = (value: number) => {
  return `Rp${new Intl.NumberFormat('id-ID').format(value)}`;
};

  const handleEditSaveClick = async (item: PenawaranHargaItem) => {
    if (item.isEditing) {
      const bodyData = {
        id: item.id,
        cddPrice: item.cddPrice,
        cddLongPrice: item.cddLongPrice,
        wingboxPrice: item.wingboxPrice,
        fusoPrice: item.fusoPrice,
      };
      try {
        const response = await fetch('/api/updatePenawaranHargaItem', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bodyData),
        });
  
        if (!response.ok) {
          throw new Error('Failed to update the item.');
        }
  
        await fetchItems(); // Re-fetch items to update the list
        toggleEdit(item.id); // Exit editing mode for the item
      } catch (error) {
        console.error('Failed to update item:', error instanceof Error ? error.message : 'An unknown error occurred');
      }
    }
  };
  
  const handleDeleteClick = async (itemId: string) => {
    try {
      // Directly calling the delete function with the itemId
      await deletePenawaranHargaItem(itemId);
  
      // Filter out the deleted item from the list
      setItems(items.filter(item => item.id !== itemId));
      setIsDeleteModalVisible(false); // Close the modal on successful deletion
    } catch (error) {
      console.error('Failed to delete item:', error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };
  
  const toggleEdit = (itemId: string) => {
    console.log(`Toggling edit mode for item ${itemId}`);

    setItems(currentItems =>
      currentItems.map(item =>
        item.id === itemId ? { ...item, isEditing: !item.isEditing } : item
      )
    );
  };

  const handlePriceChange = (itemId: string, priceType: keyof PenawaranHargaItem, newValue: number) => {
    setItems(currentItems =>
      currentItems.map(item =>
        item.id === itemId ? { ...item, [priceType]: newValue } : item
      )
    );
  };

  const fetchItems = async () => {
    setLoading(true);
    try {
      const fetchUrl = `/api/viewAllPenawaranHargaItem?idPenawaranHarga=${idPenawaranHarga}`;
      const response = await fetch(fetchUrl);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch data');
      }
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Failed to fetch Penawaran Harga items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (idPenawaranHarga) {
      fetchItems();
    }
  }, [idPenawaranHarga]);


  const columns= [
    {
      Header: 'Asal',
      accessor: 'source',
    },
    {
      Header: 'Tujuan',
      accessor: 'destination',
    },
    {
      Header: 'Harga CDD',
      accessor: 'cddPrice',
      Cell: ({ row }) => row.original.isEditing ? (
        <input
          type="number"
          defaultValue={row.original.cddPrice}
          onBlur={(e) => handlePriceChange(row.original.id, 'cddPrice', parseFloat(e.target.value))}
          style={{ width: '100px' }}
        />
      ) : formatCurrency(row.original.cddPrice),
    },

    {
      Header: 'Harga CDD Long',
      accessor: 'cddLongPrice',
      Cell: ({ row }) => row.original.isEditing ? (
        <input
          type="number"
          defaultValue={row.original.cddLongPrice}
          onBlur={(e) => handlePriceChange(row.original.id, 'cddLongPrice', parseFloat(e.target.value))}
          style={{ width: '100px' }}
        />
      ) : formatCurrency(row.original.cddLongPrice),
    },


    {
      Header: 'Harga Wingbox',
      accessor: 'wingboxPrice',
      Cell: ({ row }) => row.original.isEditing ? (
        <input
          type="number"
          defaultValue={row.original.wingboxPrice}
          onBlur={(e) => handlePriceChange(row.original.id, 'wingboxPrice', parseFloat(e.target.value))}
          style={{ width: '100px' }}
        />
      ) : formatCurrency(row.original.wingboxPrice),
    },


    {
      Header: 'Harga Fuso',
      accessor: 'fusoPrice',
      Cell: ({ row }) => row.original.isEditing ? (
        <input
          type="number"
          defaultValue={row.original.fusoPrice}
          onBlur={(e) => handlePriceChange(row.original.id, 'fusoPrice', parseFloat(e.target.value))}
          style={{ width: '100px' }}
        />
      ) : formatCurrency(row.original.fusoPrice),
    },

    {
      Header: 'Actions',
      accessor: 'actions', // This is not tied to a specific field in your data
      Cell: ({ row }) => {
        const item = row.original;
        return (
          <>
            {item.isEditing ? (
              <FiSave onClick={() => handleEditSaveClick(item)} style={{ cursor: 'pointer', marginRight: '10px' }} />
            ) : (
              <FiEdit onClick={() => toggleEdit(item.id)} style={{ cursor: 'pointer', marginRight: '10px' }} />
            )}
            <FiTrash2 onClick={() => {
              setItemToDelete(item.id);
              setIsDeleteModalVisible(true);
            }} style={{ cursor: 'pointer' }} />
          </>
        );
      },
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    }
  ];

  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex-1 py-6 px-4">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold">Daftar Penawaran Harga </h1>
          
          <DataTable
            columns={columns}
            data={items}
            progressPending={loading}
            noDataComponent={<CustomNoDataComponent />}
            btnText="Tambah Rute" 
            onClick={() => router.push(`/penawaranharga/${idPenawaranHarga}/create`)}
          />
          <button
              className="btn btn-outlined-alt-danger"
              onClick={() => router.push(`/penawaranharga`)}
            >
              Kembali
            </button>
        </div>
      </div>
      <Footer />
      {isDeleteModalVisible && (
        <div>
          <p>Are you sure you want to delete this item?</p>
          <button onClick={() => itemToDelete && handleDeleteClick(itemToDelete)}>Yes</button>
          <button onClick={() => setIsDeleteModalVisible(false)}>No</button>
        </div>
      )}
    </main>
  );
};

export default PenawaranHargaItemPage;

