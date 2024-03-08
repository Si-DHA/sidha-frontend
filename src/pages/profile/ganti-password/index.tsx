import Footer from "@/app/components/common/footer";
import Navbar from "@/app/components/common/navbar";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
import Image from "next/image";



export default function ProfilePage() {
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
              <h2 className="card-title">Gabriel Zebaoth Krisopras Putra </h2>
              <p>Halo, Gabriel</p>
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
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" /></svg>
                        <input
                          type="password"
                          className="grow"
                          placeholder="Search"
                        />
                      </label>
                    </td>
                  </tr>

                  <tr>
                    <td>Password Baru</td>
                    <td><label className="input input-bordered flex items-center gap-2 ">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" /></svg>
                      <input
                        type="password"
                        className="grow"
                        placeholder="Search"
                        value="jdnfjdnfjn" />
                    </label></td>
                  </tr>

                </tbody>
              </table>
              <div className="flex flex-row justify-center align-middle">
                <button className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg flex flex-grow">Ganti Password </button>

              </div>




            </div>


          </div>


        </div>
      </div>


      <Footer />
    </main>
  );
}