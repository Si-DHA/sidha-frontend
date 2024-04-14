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
import Drawer from '@/app/components/common/Drawer';
import { BASE_URL } from '@/app/constant/constant';
import { deleteUser } from '@/pages/api/user/deleteUser';
import SuccessAlert from '@/app/components/common/SuccessAlert';
import FailAlert from '@/app/components/common/FailAlert';

const inter = Inter({ subsets: ["latin"] });
export default function UserEditPage() {
  const queryParameters = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const id = queryParameters?.get("id");
  const router = useRouter();
  const [error, setError] = useState('');
  const [userData, setUserData] = useState(null);
  const [userRole, setUserRole] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [alert, setAlert] = useState(null);

  var isLoggedIn = Cookies.get('isLoggedIn');

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
        const userDataResponse = await viewUserById(id);
        setImageUrl(BASE_URL + `/image/file/${id}`);
        setUserData(userDataResponse['content']);
      } catch (error: any) {
        setError(error.message);
      }
    }
    fetchData();
  }, [])

  async function handleDeleteAccount() {
    const response = await deleteUser(id);
    if (response.statusCode == 200) {
      setTimeout(() => {
        router.push('/list-user');
      }, 3000);
      setAlert(<SuccessAlert message="Akun berhasil dihapus" />);
    } else {
      setAlert(<FailAlert message={response.message || "Gagal Menghapus Akun"} />);
    }
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





      </Drawer>

      <Footer />
    </main>
  )
}
