import Footer from "@/app/components/common/footer";
import DataTable from "@/app/components/common/datatable/DataTable";
import React, { useEffect, useState } from "react";
import { Router, useRouter } from "next/router";
import { viewAllKontrak } from "@/pages/api/kontrak/viewAllKontrak";
import { Inter } from "next/font/google";
import Drawer from "@/app/components/common/drawer";
const inter = Inter({ subsets: ["latin"] });
import Cookies from "js-cookie";

const DaftarKontrakPage: React.FC = () => {
  const router = useRouter();
  const [error, setError] = useState('');
  const [kontrakData, setKontrakData] = useState([]); // State to hold truck data
  var isLoggedIn = Cookies.get('isLoggedIn');
  const [userRole, setUserRole] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    }
    const role = Cookies.get('role');
    setUserRole(role || '');
    if (role !== 'KARYAWAN') {
      setError('Anda tidak diperbolehkan mengakses halaman ini');
    }
  }, [isLoggedIn, router])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const kontrakDataResponse = await viewAllKontrak();
        if (kontrakDataResponse) {
          setKontrakData(kontrakDataResponse['content']);
        }
      } catch (error: any) {
        setError(`Gagal memuat kontrak ${error.message ? ` : ${error.message}` : ''}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData(); // Call fetchData function when component mounts
  }, []);

  const columns = [{
    Header: 'Nama', accessor: 'nama',
  }, {
    Header: 'Perusahaan', accessor: 'companyName',
  }, {
    Header: 'Email', accessor: 'email',
  }, {
    Header: 'No. HP', accessor: 'phone',
  }, {
    Header: 'Tanggal Terbit', accessor: 'createdAt',
    Cell: ({ value }) => formatDate(value)
  }, {
    Header: 'Actions',
    accessor: 'kontrakUrl', // Use 'id' or any unique identifier for each row
    Cell: ({ value }: { value: string }) => (
      <div className="px-4">
        <div className="btn btn-primary btn-xs mx-2" onClick={() => handleDownloadClick(value)}>Download</div>
        <div className="btn btn-primary btn-xs" >Detail</div>
      </div>
    ),
  }
  ];

  const formatDate = (date) => {
    const dateObj = new Date(date);
    const formattedDate = `${dateObj.getDate().toString().padStart(2, '0')}-${(dateObj.getMonth() + 1).toString().padStart(2, '0')}-${dateObj.getFullYear()}`;
    const formattedTime = `${dateObj.getHours().toString().padStart(2, '0')}:${dateObj.getMinutes().toString().padStart(2, '0')}:${dateObj.getSeconds().toString().padStart(2, '0')}`;
    return `${formattedDate} ${formattedTime}`;
  };


  return (<main className={`flex min-h-screen flex-col items-center justify-between ${inter.className}`} data-theme="cmyk">
    <Drawer userRole={userRole}>
      <div className="flex flex-col justify-center items-center mih-h-screen p-8">
        <h1 className="text-3xl font-bold text-center ">Daftar Dokumen Surat Kontrak PT DHA</h1>
      </div>

      <div className="flex flex-col gap-6 mx-4 my-4 ">
        <div className="flex flex-col gap-4 justify-center items-center mih-h-screen p-8 border rounded-lg shadow-md">
          <div className="overflow-x-auto w-full">
            {error ? (
              <div>{error}</div>
            ) : (
              <>
                {kontrakData ? (
                  <DataTable
                    columns={columns}
                    data={kontrakData}
                    loading={loading}
                    type="kontrak" />) : (
                  <DataTable
                    columns={columns}
                    data={[]}
                    loading={loading}
                    type="kontrak" />)}
              </>)}
          </div>
        </div>
      </div>
    </Drawer>
    <Footer />
  </main>);
}
export default DaftarKontrakPage;

function handleDownloadClick(value: any): void {
  window.open(value, '_blank');
}

