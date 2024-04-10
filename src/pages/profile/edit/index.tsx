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
    const phoneRegex = /^[0-9]{10,13}$/;
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
      setAlert(<FailAlert key={Date.now()} message="Mohon pastikan data diisi dengan benar" />);
      return;
    }
    if (!validatePhone(phone)) {
      setAlert(<FailAlert key={Date.now()} message="Nomor telepon harus berupa angka dan mempunyai 10-13 digit" />);
      return;
    }

    if (!validatePosition(position)) {
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
          throw new Error(`HTTP error! status: ${response.status}`);
        }
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
        setAlert(<SuccessAlert key={Date.now()} message="Profile updated successfully" />);
        // redirect to profile page

      } else {
        setAlert(<FailAlert key={Date.now()} message={`${data.message}`} />);
      }

    } catch (error) {
      setAlert(<FailAlert key={Date.now()} message={`${error.message}`} />);

    }
  }

  return (
    <main
      className={`flex flex-col items-center justify-center align-middle min-h-screen ${inter.className}`} data-theme="cmyk"
    >
      <Drawer userRole={userRole}>
       
        <div className="hero flex flex-col align-middle min-h-screen mx-auto">
        <div className="flex flex-row">
          {alert}
        </div>

          <div className="flex flex-row gap-y-12 gap-x-12">
            <div className=" flex md:flex-col sm:flex-row grow justify-center align-center ">
              <div className="card w-96 bg-base-100 shadow-md">
                <div className="avatar justify-center">
                  <div className="w-24 rounded-full flex">
                    <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                  </div>
                </div>
                <div className="card-body items-center text-center">
                  <h2 className="card-title">{userData.name} </h2>
                  <div className="flex flex-col  justify-center flex-wrap gap-y-4">

                    <label className="form-control w-full max-w-xs">
                      <div className="label">
                        <span className="label-text">Ganti foto Profil Anda</span>
                        <span className="label-text-alt">.jpg/.jpeg/.png</span>
                      </div>
                      <input type="file" accept="image/*" className="file-input file-input-bordered w-full max-w-xs" />
                      <div className="label">
                        <span className="label-text-alt">max. size</span>
                        <span className="label-text-alt">10Mb</span>
                      </div>
                    </label>

                  </div>

                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="card w-1600 bg-base-100 shadow-md">

                <div className="card-body ">
                  <h1 className="font-bold">Data Diri</h1>
                  <table className="table text-left" >
                    {/* head */}

                    <tbody>
                      {/* row 1 */}
                      <tr>
                        <td>Name</td>
                        <td><label className="input input-bordered flex items-center gap-2">
                          <input type="text" className="grow" placeholder="Isi nama lengkap anda" value={name} onChange={handleNameChange} />
                        </label></td>
                      </tr>
                      <tr className="">
                        <td>Username</td>
                        <td>{userData.username}</td>
                      </tr>

                      {userData.role === 'KLIEN' && (
                        <tr>
                          <td>Company Name</td>
                          <td>{userData.companyName}</td>
                        </tr>
                      )}

                      {userData.role === 'KARYAWAN' && (
                        <tr>
                          <td>Position</td>
                          <td><label className="input input-bordered flex items-center gap-2">
                            <input type="text" className="grow" placeholder="Isi jabatan Anda" value={position} onChange={handlePositionChange} />
                          </label></td>
                        </tr>

                      )}

                      <tr>
                        <td>Address</td>
                        <td> <label className="input input-bordered flex items-center gap-2 ">
                          <input type="text" className="grow" placeholder="Isi alamat lengkap Anda" value={address} onChange={handleAddressChange} />
                        </label></td>
                      </tr>
                    </tbody>
                  </table>

                  <h1 className="font-bold">Kontak</h1>

                  <table className="table text-left">
                    {/* head */}

                    <tbody>
                      {/* row 1 */}
                      <tr>
                        <td>Email</td>
                        <td>{userData.email}</td>
                      </tr>
                      <tr className="">
                        <td>Phone</td>
                        <td>
                          <label className="input input-bordered flex items-center gap-2 ">

                            <input type="text" className="grow" placeholder="Isi nomor Whatsapp Anda" value={phone} onChange={handlePhoneChange} minLength={11} maxLength={13} />
                          </label>
                        </td>
                      </tr>

                    </tbody>

                  </table>
                  <div className="flex flex-row justify-center align-middle">
                    <button className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg flex flex-grow" onClick={() => handleUpdateProfile(userId)}>Edit </button>

                  </div>


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