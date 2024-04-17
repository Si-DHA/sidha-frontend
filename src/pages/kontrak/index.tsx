import Footer from "@/app/components/common/footer";
import Navbar from "@/app/components/common/navbar";
import SuccessAlert from "@/app/components/common/SuccessAlert";
import FailAlert from "@/app/components/common/FailAlert";
import { viewDetailKontrak } from "../api/kontrak/viewDetailKontrak";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Drawer from "@/app/components/common/drawer";
import Cookies from "js-cookie";
import { Inter } from "next/font/google";
import Link from "next/link";
const inter = Inter({ subsets: ["latin"] });

const KontrakDetailPage = () => {
  const queryParameters = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const idUserLoggedin = Cookies.get('idUser');

  var id = queryParameters?.get("id");

  const [error, setError] = useState('');
  const [kontrakData, setKontrakData] = useState({ user: { companyName: 'A' }, createdAt: 'B', kontrakUrl: 'C' });
  const [alert, setAlert] = useState(null);
  var isLoggedIn = Cookies.get('isLoggedIn');
  const [userRole, setUserRole] = useState('');
  const router = useRouter();

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
        if (userRole === 'KLIEN' && id == null && idUserLoggedin) {
          const kontrakDataResponse1 = await viewDetailKontrak(idUserLoggedin || ""); // Provide a default value of an empty string for the id parameter
          setKontrakData(kontrakDataResponse1['content']);
        } else {

          const kontrakDataResponse = await viewDetailKontrak(id || "");
          setKontrakData(kontrakDataResponse['content']);
        }
 
      } catch (error: any) {
        router.push('/404');
        setError(error.message);
      }
    };

    fetchData(); // Call fetchData function when component mounts
  }, []);


  const formatDate = (dateTimeString: any) => {
    const date = new Date(dateTimeString); // Convert datetime string to Date object
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options);
  }

  return (
    <main
      className={`flex min-h-screen flex-col  ${inter.className}`} data-theme="cmyk"
    >



      {kontrakData ? (
        <div>
          <Drawer userRole={userRole}>
            <div className="py-12">
              <div className="flex flex-col">

                <div className="flex flex-col gap-y-10 justify-center mx-auto py-5">
                  <h4 className="text-slate-900 text-[32px] font-bold">Kontrak {kontrakData.user.companyName}</h4>
                </div>

                <div className="flex flex-col gap-y-4 rounded-2xl mx-20 bg-slate-100 py-12 px-8">
                  <h4 className="text-slate-900 text-[24px] font-semibold">Detail Kontrak:</h4>


                  <div className="flex flex-col sm:flex-row justify-between align-middle">
                    <div className="flex flex-col">
                      <div className="flex flex-row gap-x-8 ">
                        <div className="font-semibold">Nama Perusahaan : </div>
                        <div> {kontrakData.user.companyName}</div>
                      </div>
                      <div className="flex flex-row gap-x-8 ">
                        <div className="font-semibold">Tanggal Penerbitan :</div>
                        <div>
                          {formatDate(kontrakData.createdAt)}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <div className="btn btn-primary"  >
                        <svg xmlns="http://www</svg>.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none">
                          <path d="M4 4C4 3.44772 4.44772 3 5 3H14H14.5858C14.851 3 15.1054 3.10536 15.2929 3.29289L19.7071 7.70711C19.8946 7.89464 20 8.149 20 8.41421V20C20 20.5523 19.5523 21 19 21H5C4.44772 21 4 20.5523 4 20V4Z" stroke="#200E32" strokeWidth="2" strokeLinecap="round" />
                          <path d="M20 8H15V3" stroke="#200E32" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                          <path d="M12 9L12 17" stroke="#200E32" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                          <path d="M9 14L12 17L15 14" stroke="#200E32" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <Link href={kontrakData.kontrakUrl}>Unduh Dokumen</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-y-4 rounded-2xl mx-20 bg-slate-100 py-12 px-8">
              <iframe src={kontrakData.kontrakUrl + "/view"} className="w-full aspect-video" width="100%" height="500px">
              </iframe>

            </div>

          </Drawer>
          <Footer />

        </div>



      ) : (
        <div>
        <Drawer userRole={userRole}>
          <div className="py-12">
            <div className="flex flex-col">

              <div className="flex flex-col gap-y-10 align-middle items-center  mx-auto py-5">
                <h4 className="text-slate-900 text-[32px] font-bold">Tidak ada data kontrak yang ditampilkan</h4>
                <div>
                <div className="btn btn-primary btn-sm"><Link href={"/dashboard"}>Kembali ke Dashboard</Link></div>

                </div>
              </div>

            </div>
          </div>

          

        </Drawer>
        <Footer />

      </div>

      )}



    </main>
  )
}

export default KontrakDetailPage;