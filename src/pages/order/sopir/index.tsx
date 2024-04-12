
import React, { useEffect, useState } from 'react';
import DataTable from "@/app/components/common/datatable/DataTable";
import { FiEdit } from 'react-icons/fi';
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
  const [loading, setLoading] = useState<boolean>(true);

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

  // const handleEdit = (id: string) => {
  //   router.push(`/uploadBuktiBongkarMuat/${id}`);
  // };

  const columns = [
    // {
    //   Header: 'ID Order Item',
    //   accessor: 'id',
    // },
    {
      Header: 'Price',
      accessor: 'price',
    },
    // {
    //   Header: 'Status Order',
    //   accessor: 'statusOrder',
    // },
    // {
    //   Header: 'Alasan Penolakan',
    //   accessor: 'alasanPenolakan',
    // },
    {
      Header: 'Pecah Belah',
      accessor: 'isPecahBelah',
      Cell: ({ value }) => (value ? 'Yes' : 'No'),
    },
    {
      Header: 'Tipe Barang',
      accessor: 'tipeBarang',
    },
    {
      Header: 'Tipe Truk',
      accessor: 'tipeTruk',
    },
    // {
    //   Header: 'Keterangan',
    //   accessor: 'keterangan',
    // },
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
      Header: 'Bukti Bongkar Muat',
      accessor: 'id',
      Cell: ({ row }) => (
        <div className="flex space-x-4">
          <button
            onClick={() => router.push(`/order/sopir/upload-bukti-muat/${row.original.id}`)}
            className="px-4 py-2 border border-gray-300 bg-white text-gray-800 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            Upload Bukti Muat
          </button>
          <button
            onClick={() => router.push(`/order/sopir/upload-bukti-bongkar/${row.original.id}`)}
            className="px-4 py-2 border border-gray-300 bg-white text-gray-800 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            Upload Bukti Bongkar
          </button>
        </div>
      ),
    },
  ];

    return (
        <>
            <Drawer userRole='userRole'>
            <div className="container mx-auto p-4" data-theme="winter">
                <h2 className="text-2xl font-bold mb-2">Order Anda</h2>
                <DataTable
                    data={orderItems}
                    columns={columns}
                    loading={loading}
                    NoDataComponent={CustomNoDataComponent}
                    // btnText="Buat Laporan" onClick={() => router.push(`/insiden/sopir/create`)}
                    // type='insiden'
                />
            </div>
            </Drawer>
            <Footer />
        </>
    );
    
};

export default ViewAllOrderItemsPage;