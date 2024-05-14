import Footer from "@/app/components/common/footer";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Drawer from "@/app/components/common/drawer";
import Cookies from "js-cookie";
import { Inter } from "next/font/google";
import Link from "next/link";
import { viewInvoice } from "../../api/invoice/viewInvoice";
import DataTable from "@/app/components/common/datatable/DataTable";
import { getKlienFromInvoice } from "../../api/invoice/getKlienFromInvoice";
const inter = Inter({ subsets: ["latin"] });

const InvoiceDetailPage = () => {
  const queryParameters = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const idUserLoggedin = Cookies.get('idUser');

  var id = queryParameters?.get("id");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [invoiceData, setInvoiceData] = useState('');
  const [alert, setAlert] = useState(null);
  var isLoggedIn = Cookies.get('isLoggedIn');
  const [userRole, setUserRole] = useState('');
  const [status, setStatus] = useState('');
  const router = useRouter();
  const [rawData, setRawData] = useState(null);
  const [klienData, setKlienData] = useState(null);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    }
    const role = Cookies.get('role');

    if (id == null && role === 'KLIEN') {
      id = idUserLoggedin;
    }

    setUserRole(role || '');
  }, [isLoggedIn, router])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const klienDataResponse = await getKlienFromInvoice(id || "");
        setKlienData(klienDataResponse['content']);

        const invoiceDataResponse = await viewInvoice(id || "");
        setRawData(invoiceDataResponse['content']);

        const mappedInvoiceData = mapInvoiceData(invoiceDataResponse['content']);
        setInvoiceData(mappedInvoiceData);

        var invoice = invoiceDataResponse['content']['invoice'];

        if (!invoice.buktiDp || invoice.buktiDp.status < 1) {
          setStatus('Menunggu DP'); // If buktiDp is null or status is less than 1
        } else if (!invoice.buktiPelunasan || invoice.buktiPelunasan.status < 1) {
          setStatus('Menunggu Pelunasan'); // If buktiPelunasan is null or status is less than 1
        } else {
          setStatus('Lunas'); // If all conditions are met
        }
      } catch (error: any) {
        setError(`Gagal memuat invoice ${error.message ? ` : ${error.message}` : ''}`);
      } finally {
        setLoading(false)
      }
    };

    fetchData(); // Call fetchData function when component mounts
  }, []);

  let totalDp = 0;
  let totalPrice = 0;
  let totalSisa = 0;

  const mapInvoiceData = (data) => {
    const mappedData = data.orderItems
      .filter(item => item.statusOrder >= 2)
      .map(item => {
        const dp = item.price * 0.6; // 20% of price
        const sisa = item.price * 0.4; // 80% of price
        totalDp += dp;
        totalPrice += item.price;
        totalSisa += sisa;

        return {
          "Lokasi Awal": item.rute[0].source,
          "Lokasi Tujuan": item.rute[0].destination,
          "Tipe Armada": item.tipeTruk,
          "Total Harga": item.price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }),
          "DP": dp.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }),
          "Sisa": sisa.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })
        };
      });
    return mappedData;
  };

  const columns = [{
    Header: 'Lokasi Awal', accessor: 'Lokasi Awal',
  }, {
    Header: 'Lokasi Tujuan', accessor: 'Lokasi Tujuan',
  }, {
    Header: 'Tipe Armada', accessor: 'Tipe Armada',
  }, {
    Header: 'Total Harga', accessor: 'Total Harga',
  }, {
    Header: 'DP', accessor: 'DP',
  }, {
    Header: 'Sisa', accessor: 'Sisa'
  }];

  const goToPembayaranDP = () => {
    router.push(`/pembayaran?id=${id}&isPelunasan=false`);
  }

  const goToPelunasan = () => {
    router.push(`/pembayaran?id=${id}&isPelunasan=true`);
  }

  const goToKonfirmasiPembayaranDP = () => {
    router.push(`/pembayaran/konfirmasi?id=${id}&isPelunasan=false`);
  }

  const goToKonfirmasiPembayaranPelunasan = () => {
    router.push(`/pembayaran/konfirmasi?id=${id}&isPelunasan=true`);
  }


  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between" ${inter.className}`} data-theme="cmyk"
    >
      {invoiceData ? (
        <>
          <Drawer userRole={userRole}>
            <div className="flex flex-col justify-center items-center mih-h-screen p-8">
              <h1 className="text-3xl font-bold text-center ">Invoice {klienData.companyName} <br /> Order ID #{rawData.id} </h1>
            </div>

            <div className="flex flex-col gap-6 mx-4 my-4 ">
              <div className="flex flex-col gap-4 justify-center items-center mih-h-screen p-8 border rounded-lg shadow-md">
                <div className="overflow-x-auto w-full">
                  {error ? (<div>{error}</div>) : (<>
                    {invoiceData ? (
                      <>
                        {status === 'Menunggu DP' && userRole === 'KLIEN' ? (
                          <DataTable
                            columns={columns}
                            data={invoiceData}
                            btnText="Bayar DP"
                            onClick={goToPembayaranDP}
                            loading={loading}
                            type="invoice item"
                          />
                        ) : status === 'Menunggu Pelunasan' && userRole == 'KLIEN' ? (
                          <DataTable
                            columns={columns}
                            data={invoiceData}
                            btnText="Bayar Pelunasan"
                            onClick={goToPelunasan}
                            loading={loading}
                            type="invoice item"
                          />
                        ) : status === 'Menunggu DP' && userRole === 'KARYAWAN' ? (
                          <DataTable
                            columns={columns}
                            data={invoiceData}
                            btnText="Cek Pembayaran DP"
                            onClick={goToKonfirmasiPembayaranDP}
                            loading={loading}
                            type="invoice item"
                          />
                        ) : status === 'Menunggu Pelunasan' && userRole == 'KARYAWAN' ? (
                          <DataTable
                            columns={columns}
                            data={invoiceData}
                            btnText="Cek Pembayaran Pelunasan"
                            onClick={goToKonfirmasiPembayaranPelunasan}
                            loading={loading}
                            type="invoice item"
                          />
                        ) : (
                          <DataTable
                            columns={columns}
                            data={invoiceData}
                            loading={loading}
                            type="invoice item"
                          />
                        )}
                      </>) : (
                      <DataTable columns={columns} data={[]} type="invoice" />)}
                  </>)}
                </div>
              </div>
              <div className="flex flex-col mt-3 align-middle justify-center items-center mx-auto gap-y-4">
                <div className="flex flex-col justify-center items-center bg-slate-50 mb-7 rounded-2xl shadow-md mx-auto my-auto p-4 align-middle">
                  <h1 className="text-[24px] text-slate-900 font-bold ">Status Invoice</h1>
                  <div className="overflow-x-auto">
                    <table className="table items-center align-middle">
                      <tbody>
                        <tr>
                          <td className="font-bold">Status</td>
                          <td className="">{status}</td>
                        </tr>
                        <tr>
                          <td className="font-bold">Total DP</td>
                          <td className="">{(rawData.totalPrice * 0.6).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</td>
                        </tr>
                        <tr>
                          <td className="font-bold">Total Pelunasan</td>
                          <td >{(rawData.totalPrice * 0.4).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</td>
                        </tr>
                        <tr>
                          <td className="font-bold">Total Harga</td>
                          <td >{(rawData.totalPrice * 1).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </Drawer>
          <Footer />
        </>
      ) : (
        <>
          <Drawer userRole={userRole}>
            <div className="flex flex-col justify-center items-center mih-h-screen p-8">
              <div>Loading..</div>
              <div className="btn btn-primary mt-5">
                <Link href={"/dashboard"}>Kembali ke Dashboard</Link>
              </div>
            </div>
          </Drawer>
          <Footer />
        </>

      )}



    </main>
  )
}

export default InvoiceDetailPage;