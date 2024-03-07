import Footer from "@/app/components/common/footer";
import Navbar from "@/app/components/common/navbar";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
import Image from "next/image";


export default function RegisterPage() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between ${inter.className}`} data-theme="cmyk"
    >
      <Navbar />
      <div className="hero flex flex-col min-h-screen mx-auto  bg-base-">
        <div className="flex flex-col justify-center justify">
          <div className="text-slate-900 text-4xl  text-center font-bold mt-20 my-2 ">
            Registrasi Akun Klien
          </div>

          <div className="text-slate-500 text-l text-center font-italic">
            Pastikan Anda mengisi identitas klien dengan benar.
          </div>

        </div>
        <div className="flex flex-row align-middle mx-auto justify-between items-center mt-10 pb-12 gap-x-20">
          <div className="flex flex-col justify-center my-auto gap-2 m-4 p-4 md:block hidden">
            <Image src="/register_asset.png" alt="Image" width={500} height={500} />
          </div>
          <div className="flex flex-col">
            <form action="" className="">
              <label className="input input-bordered flex items-center gap-2 m-2 p-3">
                <input type="text" className="grow" placeholder="Full Name" />
              </label>
              <label className="input input-bordered flex items-center gap-2 m-2 p-3">
                <input type="text" className="grow" placeholder="Company Name" />
              </label>
              <label className="input input-bordered flex items-center gap-2 m-2 p-3">
                <input type="text" className="grow" placeholder="Email" />
              </label>
              <label className="input input-bordered flex items-center gap-2 m-2 p-3">
                <input type="text" className="grow" placeholder="Address" />
              </label>
              <label className="input input-bordered flex items-center gap-2 m-2 p-3">
                <input type="text" className="grow" placeholder="Phone" />
              </label>

              <div className="text-slate-500 p-3">Pilih Foto:</div>
              <input type="file" accept="image/*" placeholder="You can't touch this" className="file-input file-input-bordered w-full max-w-xs m-2" />

              <div className="flex flex-col justify-center">

                <button className="btn btn-primary btn-l text-white m-2 p-3 ">Register</button>
                <div className="text-slate-500 m-2 p-3 text-center justify-center">
                  Anda bingung? <a href="/login" className="text-lime-500 ttext-center justify-center">Hubungi Admin</a>
                </div>
              </div>
            </form>

          </div>


        </div>
      </div>

      <Footer />
    </main>
  );
}