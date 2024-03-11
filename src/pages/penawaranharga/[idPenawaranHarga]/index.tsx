import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '@/app/components/common/navbar';
import Footer from '@/app/components/common/footer';
import DataTable from "@/app/components/common/datatable/DataTable";
import { FiEdit, FiSave, FiTrash2 } from 'react-icons/fi';
import { deletePenawaranHargaItem } from '@/pages/api/deletePenawaranHargaItem';
import { updatePenawaranHargaItem } from '@/pages/api/updatePenawaranHargaItem';

interface PenawaranHargaItem {
  idPenawaranHargaItem: string;
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
        idPenawaranHargaItem: item.idPenawaranHargaItem,
        cddPrice: item.cddPrice,
        cddLongPrice: item.cddLongPrice,
        wingboxPrice: item.wingboxPrice,
        fusoPrice: item.fusoPrice,
      };
      try {
        const response = await updatePenawaranHargaItem(bodyData);

        if (!response.ok) {
          throw new Error('Failed to update the item.');
        }

        await fetchItems(); // Re-fetch items to update the list
      } catch (error) {
        console.error('Failed to update item:', error instanceof Error ? error.message : 'An unknown error occurred');
      } finally {
        toggleEdit(item.idPenawaranHargaItem); // Exit editing mode for the item regardless of success or failure
      }
    }
  };


  const handleDeleteClick = async (itemId: string) => {
    try {
      // Directly calling the delete function with the itemId
      await deletePenawaranHargaItem(itemId);

      // Filter out the deleted item from the list
      setItems(items.filter(item => item.id !== itemId));
      setIsDeleteModalVisible(false);
      await fetchItems();
      // Close the modal on successful deletion
    } catch (error) {
      console.error('Failed to delete item:', error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };

  const toggleEdit = (itemId: string) => {
    console.log(`Toggling edit mode for item ${itemId}`);

    setItems(currentItems =>
      currentItems.map(item =>
        item.idPenawaranHargaItem === itemId ? { ...item, isEditing: !item.isEditing } : item
      )
    );
  };

  const handlePriceChange = (itemId: string, priceType: keyof PenawaranHargaItem, newValue: number) => {
    const updatedValue = Math.max(0, newValue);
    
    setItems(currentItems =>
      currentItems.map(item =>
        item.id === itemId ? { ...item, [priceType]: updatedValue } : item
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


  const columns = [
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
          min="0"
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
          min="0"
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
          min="0"
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
          min="0"
        />
      ) : formatCurrency(row.original.fusoPrice),
    },

    {
      Header: 'Ubah/Hapus',
      accessor: 'actions',
      Cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex items-center justify-center space-x-2">
            {item.isEditing ? (
              <FiSave
                onClick={() => handleEditSaveClick(item)}
                className="cursor-pointer text-lg hover:text-blue-500" 
                style={{ fontSize: '1.5rem' }}
              />
            ) : (
              <FiEdit
                onClick={() => toggleEdit(item.idPenawaranHargaItem)}
                className="cursor-pointer text-lg hover:text-green-500"
                style={{ fontSize: '1.5rem' }} // Make icon bigger
              />
            )}
            <FiTrash2
              onClick={() => {
                setItemToDelete(item.idPenawaranHargaItem);
                setIsDeleteModalVisible(true);
              }}
              className="cursor-pointer text-lg hover:text-red-500"
              style={{ fontSize: '1.5rem' }} 
            />
          </div>
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
        <h1 className="text-3xl font-bold mt-1 mb-5" style={{ color: '#2d3254' }}>Daftar Rute Penawaran</h1>

          
          <DataTable
            columns={columns}
            data={items}
            progressPending={loading}
            noDataComponent={<CustomNoDataComponent />}
            btnText="Tambah Rute"
            onClick={() => router.push(`/penawaranharga/${idPenawaranHarga}/create`)}
            type='penawaranHargaItem'
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="mx-auto max-w-sm rounded-lg bg-white p-5 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800">Delete Confirmation</h2>
            <p className="mt-2 text-gray-600">Apakah Anda yakin ingin menghapus rute ini?</p>
            <div className="flex justify-end mt-4 space-x-3">
              <button
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                onClick={() => itemToDelete && handleDeleteClick(itemToDelete)}>
                Yes
              </button>
              <button
                className="px-4 py-2 rounded bg-gray-300 text-gray-700 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50"
                onClick={() => setIsDeleteModalVisible(false)}>
                No
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
};

export default PenawaranHargaItemPage;