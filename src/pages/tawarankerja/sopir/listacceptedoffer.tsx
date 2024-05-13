import React, { useState, useEffect } from 'react';
import router from 'next/router';
import Cookies from 'js-cookie';
import Drawer from "@/app/components/common/drawer";
import Footer from "@/app/components/common/footer";
import DataTable from "@/app/components/common/datatable/DataTable";
import { getTawaranKerjaAccepted } from '@/pages/api/tawaran-kerja/getTawaranKerjaAccepted';

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
    getTawaranKerjaAccepted().then(data => {
      if (data && Array.isArray(data)) {
        // Filter to include only those items accepted by the logged-in driver
        const filteredData = data.filter(tawaran => tawaran.sopir?.id === sopirId).map(tawaran => ({
          ...tawaran.orderItem,
          source: tawaran.orderItem.rute?.[0]?.source ?? 'N/A',
          destination: tawaran.orderItem.rute?.[0]?.destination ?? 'N/A',
          isPecahBelah: tawaran.orderItem.isPecahBelah ?? false,
          price: tawaran.orderItem.price ?? 'N/A',
          createdDate: tawaran.orderItem.orderItemHistories?.[0]?.createdDate
            ? new Date(tawaran.orderItem.orderItemHistories[0].createdDate).toLocaleString('id-ID')
            : 'N/A'
        }));
        setTawaranKerja(filteredData);
      } else {
        console.error('Invalid format for order items:', data);
      }
    }).catch(error => {
      setError('Fetching error: ' + error.message);
    }).finally(() => {
      setLoading(false);
    });
  }, [sopirId]);

  const columns = [
    { Header: 'Asal', accessor: 'source' },
    { Header: 'Tujuan', accessor: 'destination' },
    { Header: 'Mudah Pecah', accessor: 'isPecahBelah', Cell: ({ value }) => value ? 'Yes' : 'No' },
    { Header: 'Harga', accessor: 'price', Cell: ({ value }) => value !== 'N/A' ? `Rp${parseInt(value).toLocaleString('id-ID')}` : 'N/A' },
    { Header: 'Tanggal Pembuatan', accessor: 'createdDate' },
    {
      Header: 'Details',
      accessor: 'id',  // Assuming `id` now directly relates to `orderItem.id`
      Cell: ({ value }) => (
        <button
          onClick={() => router.push(`/tawarankerja/sopir/detail/${value}/accept`)}
          className="btn btn-primary"
        >
          Detail
        </button>
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
