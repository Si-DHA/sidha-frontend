
import React, { useEffect, useState } from 'react';
import DataTable from "@/app/components/common/datatable/DataTable";
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Drawer from '@/app/components/common/drawer';
import Footer from '@/app/components/common/footer';

interface OrderItem {
  id: string;
  price: number;
  statusOrder: number;
  alasanPenolakan: string | null;
  isPecahBelah: boolean;
  tipeBarang: string;
  tipeTruk: string;
  keterangan: string;
  rute: {
    id: number;
    source: string;
    destination: string;
    alamatPengiriman: string;
    alamatPenjemputan: string;
    price: number;
  }[];
  buktiBongkar: {
    id: number;
    name: string;
    type: string;
    filePath: string;
  };
  buktiMuat: {
    id: number;
    name: string;
    type: string;
    filePath: string;
  };
}

const CustomNoDataComponent = () => (
  <div style={{ padding: '24px' }}>
    <span>No data available</span>
  </div>
);

const ViewAllOrderItemsPage: React.FC = () => {
  const router = useRouter();
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  var isLoggedIn = Cookies.get('isLoggedIn');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    }
    const role = Cookies.get('role');
    setUserRole(role || '');
    if (role !== 'SOPIR') {
      setError('Anda tidak diperbolehkan mengakses halaman ini');
    }

  }, [isLoggedIn, router])

  useEffect(() => {
    const fetchOrderItems = async () => {
      try {
        const response = await fetch(`/api/order/viewAllOrderItemByIdSopir?sopir=${Cookies.get('idUser')}`);
        if (!response.ok) {
          throw new Error('Failed to fetch order items');
        }
        const data = await response.json();
        setOrderItems(data);
      } catch (error) {
        console.error('Error fetching order items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderItems();
  }, []);

  const getStatusDescription = (status: number) => {
    switch (status) {
      case 0:
        return 'Menunggu Konfirmasi Tawaran Kerja';
      case 1:
        return 'Menunggu Bukti Muat';
      case 2:
      case 3:
        return 'Menunggu Bukti Bongkar';
      case 4:
      case 5:
        return 'Pengantaran Selesai';
      default:
        return 'Unknown Status';
    }
  };

  const columns = [
    {
      Header: 'ID Order Item',
      accessor: 'id',
    },
    {
      Header: 'Status Order',
      accessor: 'statusOrder',
      Cell: ({ value }) => getStatusDescription(value),
    },
    {
      Header: 'Pecah Belah',
      accessor: 'isPecahBelah',
      Cell: ({ value }) => (value ? 'Ya' : 'Tidak'),
    },
    {
      Header: 'Tipe Barang',
      accessor: 'tipeBarang',
    },
    {
      Header: 'Tipe Truk',
      accessor: 'tipeTruk',
    },
    {
      Header: 'Keterangan',
      accessor: 'keterangan',
      Cell: ({ value }) => value ? value : '-',
    },
    {
      Header: 'Rute',
      accessor: 'rute',
      Cell: ({ value }) => (
        <ul>
          {value.map((route, index) => (
            <li key={index}>
              {route.source} to {route.destination}
            </li>
          ))}
        </ul>
      ),
    },
    {
      Header: 'Bukti Muat Bongkar',
      Cell: ({ row }) => (
        <div className="flex justify-center space-x-4">
          <button
            disabled={row.original.statusOrder < 1}
            onClick={() => router.push(`/order/sopir/kelola-bukti-muat/${row.original.id}`)}
            className={`px-4 py-2 border border-gray-300 bg-white text-gray-800 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${row.original.statusOrder < 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Kelola Bukti Muat
          </button>
          <button
            disabled={row.original.statusOrder < 3}
            onClick={() => router.push(`/order/sopir/kelola-bukti-bongkar/${row.original.id}`)}
            className={`px-4 py-2 border border-gray-300 bg-white text-gray-800 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${row.original.statusOrder < 3 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Kelola Bukti Bongkar
          </button>
        </div>

      ),
    },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center justify-between" data-theme="winter">
      <Drawer userRole={userRole}>
        <div className="flex flex-col justify-center items-center mih-h-screen p-8">
          <h1 className="text-3xl font-bold text-center ">Order Anda</h1>
        </div>

        <div className="flex flex-col gap-6 mx-4 my-4 ">
          <div className="flex flex-col gap-4 justify-center items-center mih-h-screen p-8 border rounded-lg shadow-md">
            <div className="overflow-x-auto w-full">
              {error ? (
                <div>{error}</div>
              ) : (
                <>
                  <DataTable
                    data={orderItems}
                    columns={columns}
                    loading={loading}
                  />
                </>)}
            </div>
          </div>
        </div>
      </Drawer>
      <Footer />
    </main>
  );

};

export default ViewAllOrderItemsPage;