import Footer from "@/app/components/common/footer";
import Navbar from "@/app/components/common/navbar";
import SuccessAlert from "@/app/components/common/SuccessAlert";
import FailAlert from "@/app/components/common/FailAlert";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Drawer from "@/app/components/common/drawer";
import Cookies from "js-cookie";
import { Inter } from "next/font/google";
import Link from "next/link";
import { viewUserById } from "@/pages/api/user/viewUserById";
import { updateKontrak } from "@/pages/api/kontrak/updateKontrak";

const inter = Inter({ subsets: ["latin"] });

const UpdateKontrakPage = () => {
  const queryParameters = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const idUserLoggedin = Cookies.get('idUser');

  var id = queryParameters?.get("id");

  const [error, setError] = useState('');
  const [kontrakData, setKontrakData] = useState({ user: { companyName: 'A' }, createdAt: 'B', kontrakUrl: 'C' });
  const [alert, setAlert] = useState(null);
  var isLoggedIn = Cookies.get('isLoggedIn');
  const [userRole, setUserRole] = useState('');
  const [document, setDocument] = useState<File | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const router = useRouter();

  const handleDocumentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const fileSize = file.size / 1024 / 1024; // in MB
      if (fileSize > 10) {
        event.target.files= null;
        event.target.value = '';
        setAlert(<FailAlert key={Date.now()} message="Ukuran file harus kurang dari 10 MB" />);
      } else {
        const file = event.target.files[0];
        setDocument(file);
      }
    }
  }

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    }
    const role = Cookies.get('role');

    if (id == null && role === 'KLIEN') {
      id = idUserLoggedin;
    }

    if (role)


      setUserRole(role || '');
  }, [isLoggedIn, router])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await viewUserById(id || "");
        setUserData(userData['content']);


      } catch (error: any) {
        router.push('/404');
        setError(error.message);
      }
    };

    fetchData(); // Call fetchData function when component mounts
  }, []);

  const handleSubmit = async () => {
    if (document) {
      try {
        const response = await updateKontrak(id, document);
        if (response.statusCode == 200) {
          setAlert(<SuccessAlert key={Date.now()} message="Kontrak berhasil diubah" />)
          setTimeout(() => {
            router.push('/kontrak?id='+id)}, 2000);
        } else {
          setAlert(<FailAlert key={Date.now()} message="Ada kesalahan dalam menggunggah Dokumen" />)
        }
      } catch (error) {
      }
    } else{
      setAlert(<FailAlert key={Date.now()} message="Harap unggah dokumen terlebih dahulu !" />)
    }
  }

  const formatDate = (dateTimeString: any) => {
    const date = new Date(dateTimeString); // Convert datetime string to Date object
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options);
  }

  return (
    <main className={`flex min-h-screen flex-col  ${inter.className}`} data-theme="cmyk">
      {userData ? (
        <div>
          <Drawer userRole={userRole}>
            <div className="flex flex-row">
              {alert}
            </div>
            <div className="flex md:flex-col sm:flex-row mx-auto my-auto justify-center align-center">
              <div className="card w-96 bg-base-100 shadow-md">
                <div className="card-body items-center text-center">
                  <h2 className="card-title">Perbaharui Dokumen</h2>
                  <h2>{userData.name}</h2>
                  <h2>{userData.email}</h2>
                  <h2>{userData.companyName}</h2>
                  <div className="flex flex-col justify-center flex-wrap gap-y-4">
                    <label className="form-control w-full max-w-xs">
                      <div className="label">
                        <span className="label-text">Unggah dokumen kontrak user</span>
                        <span className="label-text-alt">.pdf</span>
                      </div>
                      <input type="file" accept=".pdf" className="file-input file-input-bordered w-full max-w-xs required" onChange={handleDocumentChange} required />
                      <div className="label">
                        <span className="label-text-alt">max. size</span>
                        <span className="label-text-alt">10Mb</span>
                      </div>
                    </label>
                    <div className="btn btn-secondary" onClick={handleSubmit}>
                      Perbarui Dokumen
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Drawer>
          <Footer />
        </div>
      ) : (
        <div>
          <Drawer userRole={userRole}>
            <div className="py-12">
              <div className="flex flex-col">
                <div className="flex flex-col gap-y-10 align-middle items-center mx-auto py-5">
                  <h4 className="text-slate-900 text-[32px] font-bold">404 Not Found</h4>
                  <div>
                    <div className="btn btn-primary btn-sm">
                      <Link href={"/dashboard"}>Kembali ke Dashboard</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Drawer>
          <Footer />
        </div>
      )}
    </main>
  );
}

export default UpdateKontrakPage;