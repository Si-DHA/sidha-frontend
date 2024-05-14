import React, { useEffect } from 'react'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { viewUserById } from '@/pages/api/user/viewUserById';
import Navbar from '@/app/components/common/navbar';
import { Inter } from "next/font/google";
import Footer from "@/app/components/common/footer";
import Image from "next/image";
import Link from 'next/link';
import Cookies from "js-cookie";
import Drawer from '@/app/components/common/drawer';
import { BASE_URL } from '@/app/constant/constant';
import { deleteUser } from '@/pages/api/user/deleteUser';
import SuccessAlert from '@/app/components/common/SuccessAlert';
import FailAlert from '@/app/components/common/FailAlert';

const inter = Inter({ subsets: ["latin"] });
export default function UserDetailPage() {
  const queryParameters = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const id = queryParameters?.get("id");
  const router = useRouter();
  const [error, setError] = useState('');
  const [userData, setUserData] = useState(null);
  const [userRole, setUserRole] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [alert, setAlert] = useState(null);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [canEdit, setCanEdit] = useState(true);

  var isLoggedIn = Cookies.get('isLoggedIn');
  const role = Cookies.get('role');


  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    }
    if(role == 'KLIEN' || role == 'SOPIR') {
      setShouldRedirect(true);
      router.push('/404');
    }

    setUserRole(role || '');
  }, [isLoggedIn, router])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userDataResponse = await viewUserById(id);
        setImageUrl(BASE_URL + `/image/file/${id}`);
        setUserData(userDataResponse['content']);
        if(role == 'ADMIN'){
          setCanEdit(true);
        } 
        if(userDataResponse['content'].role == 'ADMIN' || userDataResponse['content'].role == 'SOPIR' || userDataResponse['content'].role == 'KARYAWAN'){
          if(role != 'ADMIN'){
            setCanEdit(false);
          }
        }
      } catch (error: any) {
        setError(`Gagal memuat data pengguna ${error.message ? ` : ${error.message}` : ''}`);
      }
    }


    fetchData();
  }, [])

  async function handleDeleteAccount() {
    const response = await deleteUser(id);
    if (response.statusCode == 200) {
      setTimeout(() => {
        router.reload();
      }, 3000);
      setAlert(<SuccessAlert message="Akun berhasil dihapus" />);
    } else {
      setAlert(<FailAlert message={response.message || "Gagal Menghapus Akun"} />);
    }
  }

  if(shouldRedirect){
    return null;
  }
  if (!userData) {
    return <div>Loading...</div>
  }

  return (
    <main
      className={`flex min-h-screen flex-col ${inter.className}`} data-theme="cmyk"
    >

      <Drawer userRole={userRole}>
        <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Hapus Akun</h3>
            <p className="p-8">Apakah Anda yakin akan menghapus akun dengan nama :  <span className='font-bold'>{userData.name}</span> ?</p>
            <div className="modal-action">
              <button className="btn mr-2" onClick={() => document.getElementById('my_modal_5').close()}>Batal</button>
              <button className="btn btn-error" onClick={() => { handleDeleteAccount(); document.getElementById('my_modal_5').close(); }}>Hapus</button>
            </div>

          </div>
        </dialog>




        <div className="flex flex-col  justify-center gap-x-16  gap-y-16 mx-auto my-auto px-12 py-12">
          <div className="flex flex-row">
            {alert}
          </div>
          <div className="flex sm:flex-row flex-col gap-x-8 gap-y-8">
            <div className="card w-96 bg-base-100 shadow-md justify-center pt-16">
              <div className="avatar justify-center">
                <div className="w-24 rounded-full flex">
                  <img src={imageUrl} onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://i.pinimg.com/736x/0d/64/98/0d64989794b1a4c9d89bff571d3d5842.jpg"
                  }} />
                </div>
              </div>
              <div className="card-body  justify-center items-center ">
                <h2 className="card-title text-[24px]">{userData.name} </h2>
                <div className="badge badge-success">{userData.role}</div>
                {userData.isDeleted && <div className="badge badge-error">Akun dihapus</div>}
                <div className="flex flex-col  items-center pt-8 flex-wrap gap-y-4">

                  <div className="card-actions" text-xs>
                  { canEdit &&  !userData.isDeleted &&   <button className="btn btn-md btn-warning "
                    onClick={() => router.push(`/list-user/detail/edit?id=${id}`) }
                    >
                      Edit Akun
                    </button>}
                  </div>
                  <div className="card-actions">
                    {canEdit && !userData.isDeleted && <button onClick={() => document.getElementById('my_modal_5').showModal()} className="btn btn-md btn-error">
                      Delete Akun
                    </button>}
                  </div>
                </div>

              </div>
            </div>
            <div className="card w-96 bg-base-100 shadow-md">

              <div className="card-body ">
                <h1 className="font-bold text-[20px]">Data Diri</h1>
                <table className="table text-left" >

                  <tbody>
                    <tr>
                      <td className="font-semibold">Nama Lengkap</td>
                      <td>{userData.name}</td>
                    </tr>
                    <tr className="">
                      <td className="font-semibold italic">Username</td>
                      <td>{userData.username}</td>
                    </tr>
                    {userData.role === 'KLIEN' && (
                      <tr>
                        <td className="font-semibold">Nama Perusahaan</td>
                        <td>{userData.companyName}</td>
                      </tr>
                    )}
                    {userData.role === 'KARYAWAN' && (
                      <tr>
                        <td className="font-semibold">Jabatan</td>
                        <td>{userData.position}</td>
                      </tr>
                    )}
                    <tr>
                      <td className="font-semibold">Alamat</td>
                      <td>{userData.address}</td>
                    </tr>
                  </tbody>
                </table>

                <h1 className="font-bold text-[20px]  pt-12">Kontak</h1>

                <table className="table text-left">

                  <tbody>
                    <tr>
                      <td className="font-semibold">Email</td>
                      <td>{userData.email}</td>
                    </tr>
                    <tr className="">
                      <td className="font-semibold">Nomor HP</td>
                      <td>{userData.phone}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

      </Drawer>

      <Footer />
    </main>
  )
}
