import FailAlert from "@/app/components/common/FailAlert";
import SuccessAlert from "@/app/components/common/SuccessAlert";
import Footer from "@/app/components/common/footer";
import Navbar from "@/app/components/common/navbar";
import { BASE_URL } from "@/app/constant/constant";
import { addRequestMeta } from "next/dist/server/request-meta";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from "next/router";
import Drawer from "@/app/components/common/drawer";




export default function RegisterPage() {
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [position, setPosition] = useState("");
  const [alert, setAlert] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  var isLoggedIn = Cookies.get('isLoggedIn');
  const [userRole, setUserRole] = useState('');
  const router = useRouter();
  const role = Cookies.get('role');

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    }
    const role = Cookies.get('role');
    if (role != 'ADMIN') {
      router.push('/dashboard');
    }

    setUserRole(role || '');
  },)



  const handleNameChange = (event: any) => {
    setName(event.target.value);
  }

  const handleCompanyNameChange = (event: any) => {
    setCompanyName(event.target.value);
  }

  const handleEmailChange = (event: any) => {
    setEmail(event.target.value);
  }

  const handleAddressChange = (event: any) => {
    setAddress(event.target.value);
  }

  const handlePhoneChange = (event: any) => {
    setPhone(event.target.value);
  }

  const handlePositionChange = (event: any) => {
    setPosition(event.target.value);
  }

  const validatePhone = (phone: any) => {
    const phoneRegex = /^08[0-9]{8,11}$/;
    if (!phoneRegex.test(phone)) {
      return false;
    } else {
      return true;
    }
};


  const handleSubmit = async (event: any) => {


    try {
      event.preventDefault();
      if (!validatePhone(phone)) {
        setAlert(<FailAlert key={Date.now()} message="Nomor HP harus berawalan 08 dan berjumlah 10-13 digit " />);
        return;
      }
      setIsLoading(true);

      const formData = new FormData();
      formData.append('name', name);
      formData.append('role', "KARYAWAN");
      formData.append('position', position);
      formData.append('email', email);
      formData.append('address', address);
      formData.append('phone', phone);

      const response = await fetch(BASE_URL + '/auth/register', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();


      if (data.statusCode == 201) {
        setIsLoading(false);

        setAlert(<SuccessAlert key={Date.now()} message="Akun Karyawan berhasil dibuat!" />);
        setTimeout(() => {
          router.push('/list-user?role=karyawan');
          
        },  3000);
      } else {
        setIsLoading(false);
        setAlert(<FailAlert key={Date.now()} message={`${data.message}`} />);
        setTimeout(() => {
          setAlert(null);
        }, 3000); 
      }

      console.log(data);

    } catch (error: any) {
      setAlert(<FailAlert key={Date.now()} message={`${error.message}`} />);
      setTimeout(() => {
        setAlert(null);
      }, 3000); 
    }
  };


  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between ${inter.className}`} data-theme="winter"
    >
      <Drawer userRole={userRole}>
        <div className="hero flex flex-col min-h-screen mx-auto  bg-base-">
          <div className="flex flex-col justify-center justify">
            <div className="text-slate-900 text-4xl  text-center font-bold mt-20 my-2 ">
              Registrasi Akun Karyawan
            </div>

            <div className="text-slate-500 text-l text-center font-italic">
              Pastikan Anda mengisi identias Karyawan dengan benar
            </div>
            <div>
              {alert}
            </div>

          </div>
          <div className="flex flex-row align-middle mx-auto justify-between items-center mt-10 pb-12 gap-x-20">
            <div className="flex flex-col justify-center my-auto gap-2 m-4 p-4 md:block hidden">
              <Image src="/register_asset.png" alt="Image" width={500} height={500} />
            </div>
            <div className="flex flex-col">
              <form onSubmit={handleSubmit} className="">
              <div className="label">
                <span className="label-text">Nama</span>
              </div>
                <label className="input input-bordered flex items-center gap-2 m-2 p-3">
                  <input type="text" className="grow" placeholder="Budi Firmansyah" value={name} onChange={handleNameChange} required />
                </label>
                <div className="label">
                <span className="label-text">Jabatan</span>
              </div>
                <label className="input input-bordered flex items-center gap-2 m-2 p-3">
                  <input type="text" className="grow" placeholder="Asisten Manager, Logistik, dll" value={position} onChange={handlePositionChange} required />
                </label>
                <div className="label">
                <span className="label-text">Email</span>
              </div>
                <label className="input input-bordered flex items-center gap-2 m-2 p-3">
                  <input type="email" className="grow" placeholder="abc@def.com" value={email} onChange={handleEmailChange} required />
                </label>
                <div className="label">
                <span className="label-text">Alamat Lengkap</span>
              </div>
                <label className="input input-bordered flex items-center gap-2 m-2 p-3">
                  <input type="text" className="grow" placeholder="Jalan Kemangi Depok 12341" value={address} onChange={handleAddressChange} required />
                </label>
                <div className="label">
                <span className="label-text">Nomor HP</span>
              </div>
                <label className="input input-bordered flex items-center gap-2 m-2 p-3">
                  <input type="text" className="grow" placeholder="08xxxxxxxxxx" value={phone} min={10} max={13} onChange={handlePhoneChange} required />
                </label>


                <div className="flex flex-col justify-center">
                  <button type="submit" className="btn btn-secondary btn-l text-white m-2 p-3 ">
                    {isLoading ? <span className="loading loading-dots loading-lg"></span> : "Daftarkan"}
                  </button>
                  <div className="text-slate-500 m-2 p-3 text-center justify-center">
                  </div>
                </div>
              </form>

            </div>


          </div>
        </div>
      </Drawer>

      <Footer />
    </main>
  );
}