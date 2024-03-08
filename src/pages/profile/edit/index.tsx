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
      <div className="flex flex-row">
        <div role="alert" className="alert alert-warning grow">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-8 w-8" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          <span className="grow">Segera ganti password Anda !</span>
        </div>

      </div>

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

                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text">Edit Profile Anda</span>
                    <span className="label-text-alt">.jpg/.jpeg/.png</span>
                  </div>
                  <input type="file" className="file-input file-input-bordered w-full max-w-xs" />
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
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" /></svg>
                      <input type="text" className="grow" placeholder="Search" value="Gabriel Zebaoth Krisopras Putra" />
                    </label></td>
                  </tr>
                  <tr className="">
                    <td>Username</td>
                    <td>gabiiing13</td>
                  </tr>
                  {/* row 3 */}
                  <tr>
                    <td>Company Name</td>
                    <td>
                    <label className="input input-bordered flex items-center gap-2 ">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" /></svg>
                      <input type="text" className="grow" placeholder="Search" value="PT. GZKP" />
                    </label>
                    </td>
                  </tr>
                  <tr>
                    <td>Address</td>
                    <td> <label className="input input-bordered flex items-center gap-2 ">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" /></svg>
                      <input type="text" className="grow" placeholder="Search" value="Jl. Raya Kediri, Kediri, Jawa Timur" />
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
                    <td>Gabiiing13@gmail.com</td>
                  </tr>
                  <tr className="">
                    <td>Phone</td>
                    <td>0895376699044</td>
                  </tr>

                </tbody>

              </table>
              <div className="flex flex-row justify-center align-middle">
                <button className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg flex flex-grow">Edit </button>

              </div>


            </div>


          </div>


        </div>
      </div>


      <Footer />
    </main>
  );
}