import SuccessAlert from "@/app/components/common/SuccessAlert";
import FailAlert from "@/app/components/common/FailAlert";

import Footer from "@/app/components/common/footer";
import Navbar from "@/app/components/common/navbar";
import { Cookie, Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
import Image from "next/image";
import React, { useState, useEffect } from 'react';
import { BASE_URL } from "@/app/constant/constant";
import Cookies from "js-cookie";



export default function ProfilePage() {
  const id = Cookies.get('idUser');
  const [userData, setUserData] = useState(null);
  const [userId, setUserId] = useState(id);
  const [currentPassword, setcurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [alert, setAlert] = useState(null);
  const [statusCode, setStatusCode] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(showPassword => !showPassword);
  };

  const handlecurrentPasswordChange = (event) => {
    setcurrentPassword(event.target.value);
  };

  const handleNewPasswordChange = (event) => {
    setNewPassword(event.target.value);
  };
  const handleChangePassword = async (userId) => {
    await updatePassword(currentPassword, newPassword, userId);
  };

  const handleConfirmNewPasswordChange = (event) => {
    setConfirmNewPassword(event.target.value);
  }

  useEffect(() => {
    fetchUser(userId);
  }, [userId]);
  const fetchUser = (id) => {
    fetch(BASE_URL + `/user/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => setUserData(data.content))
      .catch(error => console.error('Fetch error:', error));
  };

  if (!userData) {
    return <div>Loading...</div>;
  }



  async function updatePassword(currentPassword: string, newPassword: string, userId: string) {
    try {
      if (currentPassword === '' || newPassword === '') {
        setAlert(<FailAlert key={Date.now()} message="Password cannot be empty" />);
        return;
      }
      if (newPassword !== confirmNewPassword) {
        setAlert(<FailAlert key={Date.now()} message="New password doesn't match" />);
        return;
      }
      const formData = new FormData();
      formData.append('currentPassword', currentPassword);
      formData.append('newPassword', newPassword);

      const response = await fetch(BASE_URL + `/user/change-password/${userId}`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      // Set the status code
      setStatusCode(data.statusCode);


      if (data.statusCode == 200) {
        setAlert(<SuccessAlert key={Date.now()} message="Password updated successfully" />);
      } else {
        setAlert(<FailAlert key={Date.now()} message={`${data.message}`} />);
      }


      return data;
    } catch (error) {
      console.error(error);
      return null;
    }

  }


  return (

    <main
      className={`flex min-h-screen flex-col items-center justify-between ${inter.className}`} data-theme="cmyk"
    >

      <Navbar />
      <div className="flex flex-row">

        {alert}
      </div>




      <div className="flex flex-row gap-y-12 gap-x-12">

        <div className="hidden md:flex flex-col grow justify-center align-center ">
          <div className="card w-96 bg-base-100 shadow-md">
            <div className="avatar justify-center">
              <div className="w-24 rounded-full flex">
                <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
              </div>
            </div>
            <div className="card-body items-center text-center">
              <h2 className="card-title">{userData.name} </h2>
              <p>Halo, {userData.name}</p>
              <p>Silahkan ganti password Anda supaya lebih aman</p>
              <div className="flex flex-col  justify-center flex-wrap gap-y-4">


              </div>

            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="card w-1600 bg-base-100 shadow-md">

            <div className="card-body ">
              <h1 className="font-bold">Ganti Password</h1>
              <table className="table text-left" >

                <tbody>
                  <tr>
                    <td>Password Lama</td>
                    <td>
                      <label className="input input-bordered flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 opacity-70"><title>key-variant</title><path d="M22,18V22H18V19H15V16H12L9.74,13.74C9.19,13.91 8.61,14 8,14A6,6 0 0,1 2,8A6,6 0 0,1 8,2A6,6 0 0,1 14,8C14,8.61 13.91,9.19 13.74,9.74L22,18M7,5A2,2 0 0,0 5,7A2,2 0 0,0 7,9A2,2 0 0,0 9,7A2,2 0 0,0 7,5Z" /></svg>

                        <input
                          type={showPassword ? "text" : "password"}
                          className="grow"
                          placeholder="Password lama"
                          value={currentPassword}
                          onChange={handlecurrentPasswordChange}
                        />
                      </label>
                    </td>
                  </tr>

                  <tr>
                    <td>Password Baru</td>
                    <td><label className="input input-bordered flex items-center gap-2 ">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 opacity-70"><title>key-variant</title><path d="M22,18V22H18V19H15V16H12L9.74,13.74C9.19,13.91 8.61,14 8,14A6,6 0 0,1 2,8A6,6 0 0,1 8,2A6,6 0 0,1 14,8C14,8.61 13.91,9.19 13.74,9.74L22,18M7,5A2,2 0 0,0 5,7A2,2 0 0,0 7,9A2,2 0 0,0 9,7A2,2 0 0,0 7,5Z" /></svg>
                      <input
                        type={showPassword ? "text" : "password"}
                        className="grow"
                        placeholder="Password baru"
                        value={newPassword}
                        onChange={handleNewPasswordChange}

                      />
                    </label></td>
                  </tr>

                  <tr>
                    <td>Konfirmasi Password Baru</td>
                    <td><label className="input input-bordered flex items-center gap-2 ">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 opacity-70"><title>key-variant</title><path d="M22,18V22H18V19H15V16H12L9.74,13.74C9.19,13.91 8.61,14 8,14A6,6 0 0,1 2,8A6,6 0 0,1 8,2A6,6 0 0,1 14,8C14,8.61 13.91,9.19 13.74,9.74L22,18M7,5A2,2 0 0,0 5,7A2,2 0 0,0 7,9A2,2 0 0,0 9,7A2,2 0 0,0 7,5Z" /></svg>
                      <input
                        type={showPassword ? "text" : "password"}
                        className="grow"
                        placeholder="Konfrimasi password baru"
                        value={confirmNewPassword}
                        onChange={handleConfirmNewPasswordChange}

                      />
                    </label></td>
                  </tr>

                </tbody>
              </table>
              <div className="form-contro flex flex-row justify-end gap-x-4">
                <label className="cursor-pointer label gap-x-4">
                  <span className="label-text">Tampilkan Password</span>
                  <input type="checkbox" checked={showPassword} onChange={togglePasswordVisibility} className="checkbox checkbox-error" />
                </label>
              </div>
              <div className="flex flex-row justify-center align-middle">
                <button className="btn btn-sm sm:btn-sm md:btn-s lg:btn-md flex text-sm " onClick={() => handleChangePassword(userId)}>Ganti Password</button>


              </div>




            </div>


          </div>


        </div>
      </div>


      <Footer />
    </main>
  );
}