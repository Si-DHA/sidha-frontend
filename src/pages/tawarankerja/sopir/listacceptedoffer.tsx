import React, { useState, useEffect } from 'react';
import router from 'next/router';
import Cookies from 'js-cookie';
import Drawer from "@/app/components/common/drawer";
import Footer from "@/app/components/common/footer";
import DataTable from "@/app/components/common/datatable/DataTable";
import { getTawaranKerjaAccepted } from '@/pages/api/tawaran-kerja/getTawaranKerjaAccepted';
import { getOrderByOrderItem } from '@/pages/api/order/getOrderByOrderItem';


const AcceptedOrderItemsIndexPage = () => {
  const [tawaranKerja, setTawaranKerja] = useState([]);
  const [loading, setLoading] = useState(true);
  const sopirId = Cookies.get('idUser');
  var isLoggedIn = Cookies.get('isLoggedIn');
  const [userRole, setUserRole] = useState('');
  const [error, setError] = useState('');

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
    setLoading(true);
    const fetchData = async () => {
      try {
        const data = await getTawaranKerjaAccepted();
        if (data && Array.isArray(data)) {
          // Filter to include only those items accepted by the logged-in driver
          const filteredData = data
            .filter(tawaran => tawaran.sopir?.id === sopirId && tawaran.orderItem.statusOrder >= 0)
            .map(tawaran => ({
              ...tawaran.orderItem,
              source: tawaran.orderItem.rute?.[0]?.source ?? 'N/A',
              destination: tawaran.orderItem.rute?.[0]?.destination ?? 'N/A',
              isPecahBelah: tawaran.orderItem.isPecahBelah ?? false,
              price: tawaran.orderItem.price ?? 'N/A',
            }));

          // Fetching additional data for each order item
          let completedCount = 0;
          const mergedTawaran = await Promise.all(
            filteredData.map(async item => {
              try {
                const orderData = await getOrderByOrderItem(item.id);
                if (orderData && orderData.content) {
                  // Merge tanggalPengiriman with the order item
                  console.log("tgl pengiriman " + orderData.content.tanggalPengiriman);
                  return {
                    ...item,
                    tanggalPengiriman: orderData.content.tanggalPengiriman,
                  };
                }
                return item;
              } catch (error) {
                console.error('Error fetching additional data:', error.message);
                throw error;
              }
            })
          );

          setTawaranKerja(mergedTawaran);
        } else {
          console.error('Invalid format for order items:', data);
        }
      } catch (error: any) {
        setError(`Gagal memuat tawaran kerja ${error.message ? ` : ${error.message}` : ''}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sopirId]);

  const columns = [
    { Header: 'Asal', accessor: 'source' },
    { Header: 'Tujuan', accessor: 'destination' },
    { Header: 'Mudah Pecah', accessor: 'isPecahBelah', Cell: ({ value }) => value ? 'Yes' : 'No' },
    { Header: 'Harga', accessor: 'price', Cell: ({ value }) => value !== 'N/A' ? `Rp${parseInt(value).toLocaleString('id-ID')}` : 'N/A' },
    {
      Header: 'Tanggal Pengiriman', accessor: 'tanggalPengiriman',
      Cell: ({ value }) => {
        const dateOnly = value.split(' ')[0];
        return dateOnly || 'N/A';
      }
    },
    {
      Header: 'Detail',
      accessor: 'id',  // Assuming `id` now directly relates to `orderItem.id`
      Cell: ({ value }) => (
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => router.push(`/tawarankerja/sopir/detail/${value}/accept`)}
            className="px-4 py-2 border border-gray-300 bg-white text-gray-800 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            Detail
          </button>
        </div>
      ),
    },
  ];
  return (
    <main className="flex min-h-screen flex-col items-center justify-between" data-theme="winter">
      <Drawer userRole={userRole}>
        <div className="flex flex-col justify-center items-center mih-h-screen p-8">
          <h1 className="text-3xl font-bold text-center ">Tawaran Kerja yang Anda Terima</h1>
        </div>

        <div className="flex flex-col gap-6 mx-4 my-4 ">
          <div className="flex flex-col gap-4 justify-center items-center mih-h-screen p-8 border rounded-lg shadow-md">
            <div className="overflow-x-auto w-full">
              {error ? (
                <div>{error}</div>
              ) : (
                <>
                  <DataTable
                    data={tawaranKerja}
                    columns={columns}
                    loading={loading}
                    type='tawaran kerja'
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

export default AcceptedOrderItemsIndexPage;
