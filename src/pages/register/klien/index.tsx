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
import Drawer from "@/app/components/common/Drawer";


export default function RegisterPage() {
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [document, setDocument] = useState<File | null>("");
  const [alert, setAlert] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  var isLoggedIn = Cookies.get('isLoggedIn');
  const [userRole, setUserRole] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    }
    const role = Cookies.get('role');
    if (role == 'KLIEN' || role == 'ADMIN' || role == 'SOPIR') {
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
  const validatePhone = (phone: any) => {
    const phoneRegex = /^08[0-9]{8,11}$/;
    if (!phoneRegex.test(phone)) {
      return false;
    } else {
      return true;
    }
};

  const handleDocumentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const fileSize = file.size / 1024 / 1024; // in MB
      if (fileSize > 10) {
        event.target.files= null;
        event.target.value = '';
        setAlert(<FailAlert key={Date.now()} message="Ukuran file harus kurang dari 10 MB" />);
      } else {
        const file = event.target.files[0];
        setDocument(file);
      }
    }
  };

  const handleSubmit = async (event: any) => {


    try {
      event.preventDefault();
      if (!validatePhone(phone)) {
        setAlert(<FailAlert key={Date.now()} message="Nomor HP harus mempunyai 10-13 digit" />);
        return;
      }
      setIsLoading(true);

      const formData = new FormData();
      formData.append('name', name);
      formData.append('companyName', companyName);
      formData.append('role', "KLIEN");
      formData.append('email', email);
      formData.append('address', address);
      formData.append('phone', phone);


      const response = await fetch(BASE_URL + '/auth/register', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.statusCode != 201) {
        setIsLoading(false);
        setAlert(<FailAlert key={Date.now()} message={`${data.message}`} />);
        return;
      }
      const userID = data.content.user.id;

      const documentData = new FormData();
      if (document) {
        documentData.append("file", document);
      }


      const uploadDocumentResponse = await fetch(BASE_URL + `/kontrak/${userID}`, {
        method: 'POST',
        body: documentData,
      });

      const documentResponse = await uploadDocumentResponse.json();

      const payload = {
        idKlien: userID,
      };


      const responsePenawaranHarga = await fetch('/api/createPenawaranHarga', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (data.statusCode == 201 && documentResponse.statusCode == 200 && responsePenawaranHarga.ok) {
        setIsLoading(false);
        setAlert(<SuccessAlert key={Date.now()} message="Akun berhasil dibuat" />);
        setName("");
        setCompanyName("");
        setEmail("");
        setAddress("");
        setPhone("");
        setTimeout(() => {
          router.push('/list-user?role=klien');
        }, 3000);
       

      } else {
        setIsLoading(false);
        setAlert(<FailAlert key={Date.now()} message="Ada kesalahan dalam mendaftarkan klien" />);
        console.log(data.message);
      }

      console.log(data);

    } catch (error) {
      setAlert(<FailAlert key={Date.now()} message={`${error.message}`} />);


    }
  };


  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between ${inter.className}`} data-theme="cmyk"
    >
      <Drawer userRole={userRole}>
        <div className="hero flex flex-col min-h-screen mx-auto">
          <div className="flex flex-col justify-center justify">
            <div className="text-slate-900 text-4xl  text-center font-bold mt-20 my-2 ">
              Registrasi Akun Klien
            </div>

            <div className="text-slate-500 text-l text-center font-italic">
              Pastikan Anda mengisi identias Klien dengan benar
            </div>
            <div>
              {alert}
            </div>

          </div>
          <div className="flex flex-row align-middle mx-auto justify-between items-center mt-10 pb-12 gap-x-2 ">

            <div className="flex flex-col ">
              <form onSubmit={handleSubmit} className="">
                  <div className="label">
                    <span className="label-text">Nama</span>
                  </div>
                <label className="input input-bordered flex items-center ">
                  <input type="text" className="grow" placeholder="Budi Firmansyah" value={name} onChange={handleNameChange} required />
                </label>
                <div className="label">
                  <span className="label-text">Nama perusahaan</span>
                </div>
                <label className="input input-bordered flex items-center">

                  <input type="text" className="grow" placeholder="PT Abadi Karya" value={companyName} onChange={handleCompanyNameChange} required />
                </label>
                <div className="label">
                  <span className="label-text">Email</span>
                </div>
                <label className="input input-bordered flex items-center ">
                  <input type="email" className="grow" placeholder="abc@def.com" value={email} onChange={handleEmailChange} required />
                </label>
                <div className="label">
                  <span className="label-text">Alamat</span>
                </div>
                <label className="input input-bordered flex items-center ">
                  <input type="text" className="grow" placeholder="Jalan Kusuma Bangsa 17, Depok, 13111" value={address} onChange={handleAddressChange} required />
                </label>
                <div className="label">
                  <span className="label-text">Nomor HP</span>
                </div>
                <label className="input input-bordered flex items-center ">
                  <input type="text" className="grow" placeholder="08xxxxx (10-13 digit)" value={phone} min={10} max={13} onChange={handlePhoneChange} required />
                </label>
                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text">Dokumen Surat Kontrak</span>
                    <span className="label-text-alt">.pdf</span>
                  </div>
                  <input type="file" className="file-input file-input-bordered w-full max-w-xs" accept=".pdf" onChange={handleDocumentChange} required />
                  <div className="label">
                    <span className="label-text-alt">Ukuran maksimum</span>
                    <span className="label-text-alt">10 MB</span>
                  </div>
                </label>


                <div className="flex flex-col justify-center items-center">
                  <button type="submit" className="btn btn-secondary btn-l text-white m-2 p-3  max-w-36">
                    {isLoading ? <span className="loading loading-dots loading-lg"></span> : "Daftarkan"}
                  </button>
                  <div className="text-slate-500 m-2 p-3 text-center justify-center">
                    Anda bingung? <Link href="https://wa.me/62895376699044" className="text-lime-500 text-center justify-center" >Kontak CS</Link>
                  </div>
                </div>
              </form>
            </div>
            <div className="flex flex-col justify-center items-center useContext(second) my-auto gap-2 m-4 p-4  md:block hidden">
              <Image src="/register_asset.png" alt="Image" width={300} height={300} />
            </div>



          </div>
        </div>
      </Drawer>

    </main>
  );
}