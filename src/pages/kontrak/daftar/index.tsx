import Footer from "@/app/components/common/footer";
import Navbar from "@/app/components/common/navbar";
import DataTable from "@/app/components/common/datatable/DataTable";
import React, { useEffect, useState } from "react";
import { Router, useRouter } from "next/router";
import { viewAllKontrak } from "@/pages/api/kontrak/viewAllKontrak";
import { Inter } from "next/font/google";
import Drawer from "@/app/components/common/Drawer";
const inter = Inter({ subsets: ["latin"] });
import Cookies from "js-cookie";

const DaftarKontrakPage: React.FC = () => {
  const router = useRouter();
  const [error, setError] = useState('');
  const [kontrakData, setKontrakData] = useState([]); // State to hold truck data
  var isLoggedIn = Cookies.get('isLoggedIn');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    }
    const role = Cookies.get('role');

    setUserRole(role || '');
  }, [isLoggedIn, router])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const kontrakDataResponse = await viewAllKontrak();
        if (kontrakDataResponse) {
          setKontrakData(kontrakDataResponse['content']);
        }
      } catch (error: any) {
        setError(error.message);
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


  return (<main className={`flex min-h-screen flex-col   ${inter.className}`} data-theme="cmyk">
    <Drawer userRole={userRole}>
      <div className="flex flex-col  align-middle justify-center items-center mx-auto gap-y-4">
        <h1 className="card-title">Daftar Dokumen Surat Kontrak PT DHA</h1>
        {error ? (<div>{error}</div>) : (<>
          {kontrakData ? (
            <DataTable columns={columns} data={kontrakData}
              type="kontrak" />) : (
            <DataTable columns={columns} data={[]} type="kontrak" />)}
        </>)}
      </div>
    </Drawer>
    <Footer />
  </main>);
}
export default DaftarKontrakPage;

function handleDownloadClick(value: any): void {
  window.open(value, '_blank');
}

