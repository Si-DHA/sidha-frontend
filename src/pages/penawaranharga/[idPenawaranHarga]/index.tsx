import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Footer from '@/app/components/common/footer';
import DataTable from "@/app/components/common/datatable/DataTable";
import { FiEdit, FiSave, FiTrash2 } from 'react-icons/fi';
import { deletePenawaranHargaItem } from '@/pages/api/deletePenawaranHargaItem';
import { updatePenawaranHargaItem } from '@/pages/api/updatePenawaranHargaItem';
import Cookies from "js-cookie";
import Drawer from "@/app/components/common/drawer";

interface Klien {
  id: string;
  companyName: string;
}

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
  const [kliens, setKliens] = useState<Klien[]>([]);
  const [companyName, setCompanyName] = useState('');
  const [items, setItems] = useState<PenawaranHargaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { idPenawaranHarga } = router.query;
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
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
    const fetchKliens = async () => {
      try {
        const response = await fetch('/api/proxyKlien');
        if (!response.ok) {
          throw new Error('Failed to fetch kliens');
        }
        const { content } = await response.json();
        setKliens(content);

        // Cari companyName menggunakan idPenawaranHarga
        const currentKlien = content.find(klien =>
          klien.penawaranHarga && klien.penawaranHarga.idPenawaranHarga === idPenawaranHarga
        );
        if (currentKlien && currentKlien.companyName) {
          setCompanyName(currentKlien.companyName);
        }
      } catch (error:any) {
        setError(error.message);
      }
    };

    fetchKliens();
  }, [idPenawaranHarga]);


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
        } catch (error: any) {
          setError('Failed to fetch Penawaran Harga items: ' + error.message);
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
        toggleEdit(item.idPenawaranHargaItem); // Exit editing mode for the item regardless of success or failure
        await fetchItems(); // Re-fetch items to update the list
      } catch (error: any) {
        setError(`Failed to update item: ${error instanceof Error ? error.message : 'An unknown error occurred'}`);
        toggleEdit(item.idPenawaranHargaItem); // Exit editing mode for the item regardless of success or failure
      }
    }
  };


  const handleDeleteClick = async (itemId: string) => {
    try {
      // Directly calling the delete function with the itemId
      await deletePenawaranHargaItem(itemId);

      // Filter out the deleted item from the list
      setItems(items.filter(item => item.idPenawaranHargaItem !== itemId));
      setIsDeleteModalVisible(false);
      await fetchItems();
      // Close the modal on successful deletion
    } catch (error) {
      setError(`Failed to delete item: ${error instanceof Error ? error.message : 'An unknown error occurred'}`);
    }
  };

  const toggleEdit = (itemId: string) => {
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
        item.idPenawaranHargaItem === itemId ? { ...item, [priceType]: updatedValue } : item
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
    } catch (error: any) {
      setError('Failed to fetch Penawaran Harga items: ' + error.message);
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
          onBlur={(e) => handlePriceChange(row.original.idPenawaranHargaItem, 'cddPrice', parseFloat(e.target.value))}
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
          onBlur={(e) => handlePriceChange(row.original.idPenawaranHargaItem, 'cddLongPrice', parseFloat(e.target.value))}
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
          onBlur={(e) => handlePriceChange(row.original.idPenawaranHargaItem, 'wingboxPrice', parseFloat(e.target.value))}
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
          onBlur={(e) => handlePriceChange(row.original.idPenawaranHargaItem, 'fusoPrice', parseFloat(e.target.value))}
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
    <main className="flex min-h-screen flex-col items-center justify-between" data-theme="winter">
      <Drawer userRole={userRole}>
        <div className="flex flex-col justify-center items-center mih-h-screen p-8">
          <h1 className="text-3xl font-bold text-center ">Daftar Rute Penawaran {companyName}</h1>
        </div>

        <div className="flex flex-col gap-6 mx-4 my-4 ">
          <div className="flex flex-col gap-4 justify-center items-center mih-h-screen p-8 border rounded-lg shadow-md">
            <div className="overflow-x-auto w-full">
              {error ? (
                <div>{error}</div>
              ) : (
                <>
                  <DataTable
                    columns={columns}
                    data={items}
                    loading={loading}
                    btnText="Tambah Rute"
                    onClick={() => router.push(`/penawaranharga/${idPenawaranHarga}/create`)}
                    type='penawaran harga item'
                  />
                </>)}
            </div>
          </div>
        </div>
      </Drawer>
      {isDeleteModalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="mx-auto max-w-sm rounded-lg bg-white p-5 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800">Hapus Rute</h2>
            <p className="mt-2 text-gray-600">Apakah Anda yakin ingin menghapus rute ini?</p>
            <div className="flex justify-end mt-4 space-x-3">
              <button
                className="btn"
                onClick={() => setIsDeleteModalVisible(false)}>
                Batal
              </button>
              <button
                className="btn btn-error"
                onClick={() => itemToDelete && handleDeleteClick(itemToDelete)}>
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </main>
  );
};

export default PenawaranHargaItemPage;