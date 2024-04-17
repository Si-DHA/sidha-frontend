import SuccessAlert from "@/app/components/common/SuccessAlert";
import FailAlert from "@/app/components/common/FailAlert";

import Footer from "@/app/components/common/footer";
import Navbar from "@/app/components/common/navbar";
import { Cookie, Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { BASE_URL } from "@/app/constant/constant";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import Drawer from "@/app/components/common/drawer";

export default function ProfilePage() {
  const id = Cookies.get("idUser");
  const [userData, setUserData] = useState(null);
  const [userId, setUserId] = useState(id);
  const [currentPassword, setcurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [alert, setAlert] = useState(null);
  const [statusCode, setStatusCode] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  var isLoggedIn = Cookies.get("isLoggedIn");
  const [userRole, setUserRole] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    }
    const role = Cookies.get("role");
    setUserRole(role || "");
  });

  const togglePasswordVisibility = () => {
    setShowPassword((showPassword) => !showPassword);
  };

  const handlecurrentPasswordChange = (event: any) => {
    setcurrentPassword(event.target.value);
  };

  const handleNewPasswordChange = (event: any) => {
    setNewPassword(event.target.value);
  };
  const handleChangePassword = async (userId: any) => {
    setIsLoading(true);
    await updatePassword(currentPassword, newPassword, userId);
  };

  const handleConfirmNewPasswordChange = (event: any) => {
    setConfirmNewPassword(event.target.value);
  };

  function validatePassword(password: string) {
    // Check if password length is at least 8
    if (password.length < 8) {
      return false;
    }
  
    // Check if first character is uppercase
    if (password[0] !== password[0].toUpperCase()) {
      return false;
    }
  
    // Check if password contains at least one number
    if (!/\d/.test(password)) {
      return false;
    }
  
    return true;
  }

  useEffect(() => {
    fetchUser(userId);
  }, [userId]);
  const fetchUser = (id: any) => {
    fetch(BASE_URL + `/user/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        setImageUrl(BASE_URL + `/image/file/${id}`);
        return response.json();
      })
      .then((data) => setUserData(data.content))
      .catch((error) => console.error("Fetch error:", error));
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  async function updatePassword(
    currentPassword: string,
    newPassword: string,
    userId: string
  ) {
    try {
      if (currentPassword === "" || newPassword === "") {
        setIsLoading(false);
        setAlert(
          <FailAlert key={Date.now()} message="Semua kolom harus diisi !" />
        );
        return;
      }
      if (!validatePassword(newPassword)) {
        setIsLoading(false);
        setAlert(
          <FailAlert key={Date.now()} message="Password baru tidak valid. Harus terdiri dari 8 karakter, huruf awal harus huruf besar, dan mengandung angka." />
        );
        return;
      }

      if (newPassword !== confirmNewPassword) {
        setIsLoading(false);
        setAlert(
          <FailAlert key={Date.now()} message="Kombinasi password baru tidak sesuai !" />
        );
        return;
      }


      const formData = new FormData();
      formData.append("currentPassword", currentPassword);
      formData.append("newPassword", newPassword);

      const response = await fetch(
        BASE_URL + `/user/change-password/${userId}`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      setIsLoading(false);

      // Set the status code
      setStatusCode(data.statusCode);

      if (data.statusCode == 200) {
        setAlert(
          <SuccessAlert
            key={Date.now()}
            message="Kata sandi berhasil diubah, silahkan login ulang untuk melanjutkan."
          />
        );
        setTimeout(() => {
          router.push("/login");
          Cookies.remove("token");
          Cookies.remove("idUser");
          Cookies.remove("role");
          Cookies.remove("isLoggedIn");
          Cookies.remove("name");
          Cookies.remove("companyName");
        }, 5000);
      } else {
        setAlert(<FailAlert key={Date.now()} message={`${data.message}`} />);
      }

      return data;
    } catch (error) {
      setIsLoading(false);
      console.error(error);
      return null;
    }
  }

  return (
    <main
      className={`flex min-h-screen flex-col  ${inter.className}`}
      data-theme="cmyk"
    >
      <Drawer userRole={userRole}>
        <div className="flex flex-col justify-center gap-x-4 gap-y-4 mx-auto my-auto ">
          <div className="flex flex-col px-12 text-[12px]  sm:text-[16px]  ">
            {alert}
          </div>
          

          <div className="flex flex-row gap-x-4 gap-y-4 mx-auto my-auto ">
            <div className="hidden md:card  bg-base-100 shadow-md">
              <div className="avatar justify-center">
                <div className="w-24 rounded-full flex">
                  <img
                    src={imageUrl}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://i.pinimg.com/736x/0d/64/98/0d64989794b1a4c9d89bff571d3d5842.jpg";
                    }}
                  />
                </div>
              </div>
              <div className="card-body items-center text-center ">
                <h2 className="card-title">{userData.name} </h2>
                <p>Halo, {userData.name}</p>
                <p>Silahkan ubah kata sandi Anda supaya lebih aman !</p>
                <p className="font-semibold">Kriteria kata sandi :</p>
                <ul className="list-disc text-left">
                  <li>Minimal 8 karakter</li>
                  <li>Huruf pertama harus huruf kapital</li>
                  <li>Harus mengandung angka</li>
                </ul>

              </div>
            </div>
            <div className="card  bg-base-100 shadow-md ">
              <div className="card-body   ">
                <h1 className="font-bold text-[21px]">Ubah Kata Sandi</h1>
                <table className="table text-left">
                  <tbody className="">
                    <tr>
                      <td className="font-semibold">Kata Sandi Lama</td>
                      <td className="">
                        <label className="input  input-bordered  flex items-center gap-x-2 ">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            className="w-4 h-4 opacity-70"
                          >
                            <title>key-variant</title>
                            <path d="M22,18V22H18V19H15V16H12L9.74,13.74C9.19,13.91 8.61,14 8,14A6,6 0 0,1 2,8A6,6 0 0,1 8,2A6,6 0 0,1 14,8C14,8.61 13.91,9.19 13.74,9.74L22,18M7,5A2,2 0 0,0 5,7A2,2 0 0,0 7,9A2,2 0 0,0 9,7A2,2 0 0,0 7,5Z" />
                          </svg>

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
                      <td className="font-semibold">Kata Sandi Baru</td>
                      <td>
                        <label className="input  input-bordered flex items-center gap-x-2  ">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            className="w-4 h-4 opacity-70"
                          >
                            <title>key-variant</title>
                            <path d="M22,18V22H18V19H15V16H12L9.74,13.74C9.19,13.91 8.61,14 8,14A6,6 0 0,1 2,8A6,6 0 0,1 8,2A6,6 0 0,1 14,8C14,8.61 13.91,9.19 13.74,9.74L22,18M7,5A2,2 0 0,0 5,7A2,2 0 0,0 7,9A2,2 0 0,0 9,7A2,2 0 0,0 7,5Z" />
                          </svg>
                          <input
                            type={showPassword ? "text" : "password"}
                            className="grow"
                            placeholder="Password baru"
                            value={newPassword}
                            onChange={handleNewPasswordChange}
                          />
                        </label>
                      </td>
                    </tr>

                    <tr>
                      <td className="font-semibold">Konfirmasi Kata Sandi  Baru</td>
                      <td>
                        <label className="input input-bordered flex items-center  gap-x-2 ">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            className="w-4 h-4 opacity-70"
                          >
                            <title>key-variant</title>
                            <path d="M22,18V22H18V19H15V16H12L9.74,13.74C9.19,13.91 8.61,14 8,14A6,6 0 0,1 2,8A6,6 0 0,1 8,2A6,6 0 0,1 14,8C14,8.61 13.91,9.19 13.74,9.74L22,18M7,5A2,2 0 0,0 5,7A2,2 0 0,0 7,9A2,2 0 0,0 9,7A2,2 0 0,0 7,5Z" />
                          </svg>
                          <input
                            type={showPassword ? "text" : "password"}
                            className="grow"
                            placeholder="Konfrimasi password baru"
                            value={confirmNewPassword}
                            onChange={handleConfirmNewPasswordChange}
                          />
                        </label>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="form-control flex flex-row justify-center items-end mx-auto">
                  <label className="cursor-pointer label gap-x-4">
                    <span className="label-text">Tampilkan Password</span>
                    <input
                      type="checkbox"
                      checked={showPassword}
                      onChange={togglePasswordVisibility}
                      className="checkbox checkbox-error"
                    />
                  </label>
                </div>
                <div className="flex flex-row justify-center align-middle">
                  <button
                    className="btn btn-sm btn-secondary sm:btn-sm md:btn-s lg:btn-md flex text-sm "
                    onClick={() => handleChangePassword(userId)}
                  >
                    {isLoading ? <span className="loading loading-dots loading-lg"></span> : "Ubah Kata Sandi"}
                  </button>
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
