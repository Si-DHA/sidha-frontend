import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
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
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [idPenawaranHarga, setIdPenawaranHarga] = useState<string | null>(null);

  var isLoggedIn = Cookies.get('isLoggedIn');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    }
    const role = Cookies.get('role');
    setUserRole(role || '');
    if (role === 'KLIEN') {
      setCompanyName(Cookies.get('companyName') || '');
    } else {
      setError('Anda tidak diperbolehkan mengakses halaman ini');
    }
  }, [isLoggedIn, router])

  useEffect(() => {
    const fetchKliens = async () => {
      try {
        const response = await fetch('/api/proxyKlien');
        if (!response.ok) {
          throw new Error('Failed to fetch kliens');
        }
        const { content } = await response.json();
        setKliens(content);

        // Find the logged-in Klien and set the idPenawaranHarga
        const loggedInKlien = content.find(klien => klien.id === Cookies.get('idUser'));
        if (loggedInKlien && loggedInKlien.penawaranHarga) {
          setIdPenawaranHarga(loggedInKlien.penawaranHarga.idPenawaranHarga);
        } else {
          setError('Anda belum memiliki penawaran harga');
        }
      } catch (error: any) {
        setError(error.message);
      }
    };
    fetchKliens();
  }, []);

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

  const formatCurrency = (value: number) => {
    return `Rp${new Intl.NumberFormat('id-ID').format(value)}`;
  };

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
  ];

  console.log("id " + idPenawaranHarga);

  return (<main className={`flex min-h-screen flex-col items-center justify-between ${inter.className}`} data-theme="cmyk">
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
                  type='penawaran harga item'
                />
              </>)}
          </div>
        </div>
      </div>
    </Drawer>
    <Footer />
  </main>);
};

export default PenawaranHargaItemPage;
