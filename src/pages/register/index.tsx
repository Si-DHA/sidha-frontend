import Footer from "@/app/components/common/footer";
import Navbar from "@/app/components/common/navbar";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
import Image from "next/image";
import Link from "next/link";


export default function RegisterPage() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between ${inter.className}`} data-theme="cmyk"
    >
      <Navbar />
      <div className="hero flex flex-col min-h-screen mx-auto  bg-base-">
        <div className="flex flex-col justify-center justify">
          <div className="text-slate-900 text-4xl  text-center font-bold mt-20 my-2 ">
            Account Registration
          </div>

          <div className="text-slate-500 text-l text-center font-italic">
            Choose the role that you want to create and fill the form
          </div>

        </div>
        <div className="flex flex-row align-middle mx-auto justify-between items-center mt-10 pb-12 gap-x-20">
          <div className="flex flex-col justify-center my-auto gap-2 m-4 p-4 md:block hidden">
            <Image src="/register_asset.png" alt="Image" width={500} height={500} />
          </div>
          <div className="flex flex-col">
            <div className="flex flex-col justify-center">
              <button className="btn btn-primary  btn-l text-white m-2 p-3 ">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="opacity-70" width={24} height={24}><title>security</title><path d="M12,12H19C18.47,16.11 15.72,19.78 12,20.92V12H5V6.3L12,3.19M12,1L3,5V11C3,16.55 6.84,21.73 12,23C17.16,21.73 21,16.55 21,11V5L12,1Z" /></svg>

                <Link href="/register/admin" >Admin</Link></button>
            </div>
            <div className="flex flex-col justify-center">

              <button className="btn  btn-primary btn-l text-white m-2 p-3 ">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} className="opacity-70"><title>account-tie</title><path d="M12 3C14.21 3 16 4.79 16 7S14.21 11 12 11 8 9.21 8 7 9.79 3 12 3M16 13.54C16 14.6 15.72 17.07 13.81 19.83L13 15L13.94 13.12C13.32 13.05 12.67 13 12 13S10.68 13.05 10.06 13.12L11 15L10.19 19.83C8.28 17.07 8 14.6 8 13.54C5.61 14.24 4 15.5 4 17V21H20V17C20 15.5 18.4 14.24 16 13.54Z" /></svg>
                <Link href="/register/karyawan" >Employee</Link></button>
            </div>
            <div className="flex flex-col justify-center">
              <button className="btn btn-primary   btn-l text-white m-2 p-3 ">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} className="opacity-70"><title>card-account-details-outline</title><path d="M22,3H2C0.91,3.04 0.04,3.91 0,5V19C0.04,20.09 0.91,20.96 2,21H22C23.09,20.96 23.96,20.09 24,19V5C23.96,3.91 23.09,3.04 22,3M22,19H2V5H22V19M14,17V15.75C14,14.09 10.66,13.25 9,13.25C7.34,13.25 4,14.09 4,15.75V17H14M9,7A2.5,2.5 0 0,0 6.5,9.5A2.5,2.5 0 0,0 9,12A2.5,2.5 0 0,0 11.5,9.5A2.5,2.5 0 0,0 9,7M14,7V8H20V7H14M14,9V10H20V9H14M14,11V12H18V11H14" /></svg>
                <Link href="/register/sopir" >Driver</Link></button>
            </div>
            <div className="flex flex-col justify-center">
              <button className="btn btn-primary   btn-l text-white m-2 p-3 ">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} className="opacity-70"><title>domain</title><path d="M18,15H16V17H18M18,11H16V13H18M20,19H12V17H14V15H12V13H14V11H12V9H20M10,7H8V5H10M10,11H8V9H10M10,15H8V13H10M10,19H8V17H10M6,7H4V5H6M6,11H4V9H6M6,15H4V13H6M6,19H4V17H6M12,7V3H2V21H22V7H12Z" /></svg>
                <Link href="/register/klien" >Klien</Link></button>
            </div>





          </div>


        </div>
      </div>

      <Footer />
    </main>
  );
}