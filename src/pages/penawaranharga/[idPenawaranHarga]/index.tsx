import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '@/app/components/common/navbar';
import Footer from '@/app/components/common/footer';
import DataTable, { TableColumn } from 'react-data-table-component';
import { FiEdit, FiSave, FiTrash2 } from 'react-icons/fi';
// import { deletePenawaranHargaItem } from '@/pages/api/deletePenawaranHargaItem';

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

  const handleEditSaveClick = async (item: PenawaranHargaItem) => {
    if (item.isEditing) {
      const bodyData = {
        id: item.id,
        // source: item.source,
        // destination: item.destination,
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
  
  // const handleDeleteClick = async (itemId: string) => {
  //   try {
  //     // Directly calling the delete function with the itemId
  //     await deletePenawaranHargaItem(itemId);
  
  //     // Filter out the deleted item from the list
  //     setItems(items.filter(item => item.id !== itemId));
  //     setIsDeleteModalVisible(false); // Close the modal on successful deletion
  //   } catch (error) {
  //     console.error('Failed to delete item:', error instanceof Error ? error.message : 'An unknown error occurred');
  //   }
  // };
  
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


  const columns: TableColumn<PenawaranHargaItem>[] = [
    { name: 'Source', selector: row => row.source, sortable: true },
    { name: 'Destination', selector: row => row.destination, sortable: true },
    {
      name: 'CDD Price',
      selector: row => row.cddPrice,
      sortable: true,
      format: row => row.isEditing ? (
        <input
          type="number"
          defaultValue={row.cddPrice}
          onBlur={(e) => handlePriceChange(row.id, 'cddPrice', parseFloat(e.target.value))}
          style={{ width: '100px' }}
        />
      ) : `${row.cddPrice}`,
    },
    {
      name: 'CDD Long Price',
      selector: row => row.cddLongPrice,
      sortable: true,
      format: row => row.isEditing ? (
        <input
          type="number"
          defaultValue={row.cddLongPrice}
          onBlur={(e) => handlePriceChange(row.id, 'cddLongPrice', parseFloat(e.target.value))}
          style={{ width: '100px' }}
        />
      ) : `${row.cddLongPrice}`,
    },

    {
      name: 'CDD Wingbox Price',
      selector: row => row.wingboxPrice,
      sortable: true,
      format: row => row.isEditing ? (
        <input
          type="number"
          defaultValue={row.wingboxPrice}
          onBlur={(e) => handlePriceChange(row.id, 'wingboxPrice', parseFloat(e.target.value))}
          style={{ width: '100px' }}
        />
      ) : `${row.wingboxPrice}`,
    },

    {
      name: 'Fuso Price',
      selector: row => row.fusoPrice,
      sortable: true,
      format: row => row.isEditing ? (
        <input
          type="number"
          defaultValue={row.fusoPrice}
          onBlur={(e) => handlePriceChange(row.id, 'fusoPrice', parseFloat(e.target.value))}
          style={{ width: '100px' }}
        />
      ) : `${row.fusoPrice}`,
    },


    // {
    //   name: 'Actions',
    //   cell: (row) => (
    //     <>
    //       { {row.isEditing ? (
    //         Display a Save icon when the item is in edit mode
    //         <FiSave onClick={() => handleEditSaveClick(row)} style={{ cursor: 'pointer', marginRight: '10px' }} />
    //       ) : (
    //         // Display an Edit icon when the item is not in edit mode
    //         <FiEdit onClick={() => toggleEdit(row.id)} style={{ cursor: 'pointer', marginRight: '10px' }} />
    //       )}}
    //   <FiTrash2 onClick={() => {
    //         setItemToDelete(row.id);
    //         setIsDeleteModalVisible(true);
    //       }} style={{ cursor: 'pointer' }} />
    //     </>
    //   ),
    //   ignoreRowClick: true,
    //   allowOverflow: true,
    //   button: true,
    // }
  ];

  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex-1 py-6 px-4">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold">Daftar Penawaran Harga </h1>
          <br>
          </br>

          {typeof idPenawaranHarga === 'string' && (
            <button
              className="mb-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300"
              onClick={() => router.push(`/penawaranharga/${idPenawaranHarga}/create`)}
            >
              Tambah Rute
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
      {/* {isDeleteModalVisible && (
        <div>
          <p>Are you sure you want to delete this item?</p>
          <button onClick={() => itemToDelete && handleDeleteClick(itemToDelete)}>Yes</button>
          <button onClick={() => setIsDeleteModalVisible(false)}>No</button>
        </div>
      )} */}
    </main>
  );
};

export default PenawaranHargaItemPage;

