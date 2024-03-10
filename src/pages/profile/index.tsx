import Footer from "@/app/components/common/footer";
import Navbar from "@/app/components/common/navbar";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

import Image from "next/image";
import Link from 'next/link';
import React, { useEffect, useState } from 'react';




export default function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [userId, setUserId] = useState('a5d26ca9-c047-42f1-bb56-6594e8710d6b');

  useEffect(() => {
    fetchUser(userId);
  }, [userId]);
  const fetchUser = (id) => {
    fetch(`http://localhost:8081/api/user/${id}`)
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
    return <div>gada data...</div>;
  }


  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between ${inter.className}`} data-theme="cmyk"
    >
      <Navbar />



      <div className="flex flex-row gap-y-12 gap-x-12">
        <div className="flex flex-col grow justify-center align-center ">
          <div className="card w-96 bg-base-100 shadow-md">
            <div className="avatar justify-center">
              <div className="w-24 rounded-full flex">
                <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
              </div>
            </div>
            <div className="card-body items-center text-center">
              <h2 className="card-title">{userData.name} </h2>
              <p>Halo, Gabriel</p>
              <div className="flex flex-col  justify-center flex-wrap gap-y-4">

                <div className="card-actions justify-center" text-xs>
                  <button className="btn btn-sm text-xs ">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                    </svg>
                    <Link href="/profile/edit">Edit Profile</Link>
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
          <div className="card w-1600 bg-base-100 shadow-md">

            <div className="card-body ">
              <h1 className="font-bold">Data Diri</h1>
              <table className="table text-left" >

                <tbody>
                  <tr>
                    <td>Name</td>
                    <td>{userData.name}</td>
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
                      <td>{userData.position}</td>
                    </tr>
                  )}
                  <tr>
                    <td>Address</td>
                    <td>{userData.address}</td>
                  </tr>
                </tbody>
              </table>

              <h1 className="font-bold">Kontak</h1>

              <table className="table text-left">

                <tbody>
                  <tr>
                    <td>Email</td>
                    <td>{userData.email}</td>
                  </tr>
                  <tr className="">
                    <td>Phone</td>
                    <td>{userData.phone}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>


      <Footer />
    </main>
  );
}

