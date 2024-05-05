import FailAlert from "@/app/components/common/FailAlert";
import SuccessAlert from "@/app/components/common/SuccessAlert";
import Footer from "@/app/components/common/footer";
import Navbar from "@/app/components/common/navbar";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
import Image from "next/image";
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie'
import { BASE_URL } from "@/app/constant/constant";
import { useRouter } from "next/router";
import Drawer from "@/app/components/common/drawer";
import Link from 'next/link';



export default function ProfilePage() {
  const id = Cookies.get('idUser');

  console.log(id);
  const [userData, setUserData] = useState<any>(null);
  const [userId, setUserId] = useState(id);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [position, setPosition] = useState('');
  const [phone, setPhone] = useState('');
  const [alert, setAlert] = useState(null);
  const [errors, setErrors] = useState({});
  const [phoneError, setPhoneError] = useState("");
  const [positionError, setPositionError] = useState("");
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  var isLoggedIn = Cookies.get('isLoggedIn');
  const [userRole, setUserRole] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    }
    const role = Cookies.get('role');
    setUserRole(role || '');
  },)


  const validate = () => {
    let tempErrors: any = {};

    // Add validation checks for each field
    tempErrors.name = name ? "" : "Name is required.";
    tempErrors.address = address ? "" : "Address is required.";
    tempErrors.phone = phone ? "" : "Phone is required.";

    setErrors(tempErrors);

    // Only return true if all error messages are empty
    return Object.values(tempErrors).every(x => x === "");
  };

  const validatePhone = (phone: any) => {
    const phoneRegex = /^08[0-9]{8,11}$/;
    if (!phoneRegex.test(phone)) {
      return false;
    } else {
      return true;
    }
  };

  const validatePosition = (position: any) => {
    // This is a simple regex for validation, adjust it according to your needs

    if (userData && userData.role === 'KARYAWAN' && position === "") {
      return false;
    } else {
      return true;
    }
  };


  const handleNameChange = (event: any) => {
    setName(event.target.value);
  }

  const handleAddressChange = (event: any) => {
    setAddress(event.target.value);
  }

  const handlePositionChange = (event: any) => {
    setPosition(event.target.value);
  }

  const handlePhoneChange = (event: any) => {
    setPhone(event.target.value);
  }


  const handleUpdateProfile = async (userId: any) => {
    if (!validate()) {
      setIsLoading(false);
      setAlert(<FailAlert key={Date.now()} message="Mohon pastikan data diisi dengan benar" />);
      return;
    }
    if (!validatePhone(phone)) {
      setIsLoading(false);

      setAlert(<FailAlert key={Date.now()} message="Nomor telepon harus berupa angka, berawalan 08,  dan mempunyai 10-13 digit" />);
      return;
    }

    if (!validatePosition(position)) {
      setIsLoading(false);

      setAlert(<FailAlert key={Date.now()} message="Jabatan tidak boleh kosong" />);
      return;
    }
    await updateProfile(name, address, position, phone, userId);
  }

  useEffect(() => {
    fetchUser(userId);
  }, [userId]);

  const fetchUser = (id: any) => {
    fetch(BASE_URL + `/user/${id}`)
      .then(response => {
        if (!response.ok) {
          setIsLoading(false);

          throw new Error(`HTTP error! status: ${response.status}`);
        }
        setIsLoading(false);

        setImageUrl(BASE_URL + `/image/file/${id}`);
        return response.json();
      })
      .then(data => {
        setUserData(data.content);
        setPosition(data.content.position);
        setName(data.content.name);
        setAddress(data.content.address);
        setPhone(data.content.phone);
      })
      .catch(error => console.error('Fetch error:', error));
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  async function updateProfile(name: string, address: string, position: string, phone: string, userId: string) {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('name', name);
      formData.append('address', address);
      formData.append('position', position);
      formData.append('phone', phone);

      const responseUpdate = await fetch(BASE_URL + `/user/edit/${userId}`, {
        method: 'POST',
        body: formData
      });

      const hasilUpdate = await responseUpdate.json();
      if (hasilUpdate.statusCode == 200) {
        setIsLoading(false);
        setAlert(<SuccessAlert key={Date.now()} message="Informasi profil berhasil diperbaharui !" />);
        Cookies.set('name', name);
        setTimeout(() => {
          router.push('/profile');
        }, 3000);

      } else {
        setIsLoading(false);
        setAlert(<FailAlert key={Date.now()} message={`${data.message}`} />);
      }

    } catch (error) {
      setIsLoading(false);

      setAlert(<FailAlert key={Date.now()} message={`${error.message}`} />);

    }
  }

  return (
    <main
      className={`flex min-h-screen flex-col ${inter.className}`} data-theme="cmyk"
    >
      <Drawer userRole={userRole}>

        <div className="flex flex-row px-12 text-[12px]  sm:text-[16px]">
          {alert}
        </div>

        <div className="flex flex-row gap-y-12 gap-x-12 justify-center mx-auto my-auto">

          <div className=" flex md:flex-col sm:flex-row  justify-center ">
            <div className="hidden sm:card  w-96 bg-base-100 shadow-md">
              <div className="avatar justify-center">
                <div className="w-24 rounded-full flex">
                  <img src={imageUrl} onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://i.pinimg.com/736x/0d/64/98/0d64989794b1a4c9d89bff571d3d5842.jpg"
                  }} />
                </div>
              </div>
              <div className="card-body items-center text-center">
                <h2 className="card-title pb-4">{name} </h2>
                <div className="flex flex-col  justify-center items-center flex-wrap gap-y-4">

                  <div className="card-actions">
                    <button className="btn btn-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
                      </svg>
                      <Link href="/profile/edit/photo">Ganti Foto Profil</Link>

                    </button>
                  </div>
                  <div className="card-actions">
                    <button className="btn btn-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
                      </svg>
                      <Link href="/profile/ganti-password">Ganti Password</Link>

                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="card  bg-base-100 shadow-md">

              <div className="card-body ">
                <h1 className="font-bold text-[21px]">Data Diri</h1>
                <table className="table text-left" >
                  {/* head */}

                  <tbody>
                    {/* row 1 */}
                    <tr>
                      <td className="font-semibold">Nama</td>
                      <td><label className="input input-bordered flex items-center gap-2">
                        <input type="text" className="grow" placeholder="Isi nama lengkap anda" value={name} onChange={handleNameChange} />
                      </label></td>
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
                        <td><label className="input input-bordered flex items-center gap-2">
                          <input type="text" className="grow" placeholder="Isi jabatan Anda" value={position} onChange={handlePositionChange} />
                        </label></td>
                      </tr>

                    )}

                    <tr>
                      <td className="font-semibold">Alamat</td>
                      <td> <label className="input input-bordered flex items-center gap-2 ">
                        <input type="text" className="grow" placeholder="Isi alamat lengkap Anda" value={address} onChange={handleAddressChange} />
                      </label></td>
                    </tr>
                  </tbody>
                </table>

                <h1 className="font-bold text-[21px] pt-4">Kontak</h1>

                <table className="table text-left">


                  <tbody>

                    <tr>
                      <td className="font-semibold">Email</td>
                      <td>{userData.email}</td>
                    </tr>

                    <tr className="">
                      <td className="font-semibold">Nomor HP</td>
                      <td>
                        <label className="input input-bordered flex items-center gap-2 ">

                          <input type="text" className="grow" placeholder="Isi nomor Whatsapp Anda" value={phone} onChange={handlePhoneChange} minLength={11} maxLength={13} />
                        </label>
                      </td>
                    </tr>

                  </tbody>
                </table>

                <div className="flex flex-row justify-center align-middle">
                  <div className="btn btn-secondary" onClick={() => handleUpdateProfile(userId)}>
                    {isLoading ? <span className="loading loading-dots loading-lg"></span> : "Ubah Profil"} </div>
                </div>

              </div>


            </div>


          </div>
        </div>
      </Drawer>




      <Footer />
    </main>
  );
}