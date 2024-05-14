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
  const [imageUrl, setImageUrl] = useState('');
  const [document, setDocument] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);



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
  const handleDocumentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const fileSize = file.size / 1024 / 1024; // in MB
      if (fileSize > 10) {
        event.target.files = null;
        event.target.value = '';
        setAlert(<FailAlert key={Date.now()} message="Ukuran file harus kurang dari 10 MB" />);
      } else {
        const file = event.target.files[0];
        setDocument(file);

        const reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onload = () => {
          setPreviewUrl(reader.result as string);
        };
      }
    }
  };



  useEffect(() => {
    fetchUser(userId);
  }, [userId]);

  const fetchUser = (id: any) => {
    fetch(BASE_URL + `/user/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
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

  async function updateProfile(document: File) {
    try {
      const formData = new FormData();
      formData.append('imageFile', document);


      const responseUpdate = await fetch(BASE_URL + `/user/edit/${userId}`, {
        method: 'POST',
        body: formData
      });

      const hasilUpdate = await responseUpdate.json();
      if (hasilUpdate.statusCode == 200) {
        setAlert(<SuccessAlert key={Date.now()} message="Foto Profil berhasil diubah!" />);
        setTimeout(() => {
          router.push('/profile');
        }, 3000);

      } else {
        setAlert(<FailAlert key={Date.now()} message={`${data.message}`} />);
      }

    } catch (error) {
      setAlert(<FailAlert key={Date.now()} message={`${error.message}`} />);

    }
  }

  const handleSubmit = async () => {
    if (document) {
      await updateProfile(document);
    } else {
      setAlert(<FailAlert key={Date.now()} message="Tolong unggah foto terlebih dahulu!" />);
    }
  }

  return (
    <main
      className={`flex flex-col items-center justify min-h-screen ${inter.className}`} data-theme="cmyk"
    >
      <Drawer userRole={userRole}>


        <div className="flex flex-row">
          {alert}
        </div>

        <div className=" flex md:flex-col sm:flex-row mx-auto my-auto justify-center align-center ">
          <div className="card w-96 bg-base-100 shadow-md">
            <div className="avatar justify-center">
              <div className="w-24 rounded-full flex">
                <img src={previewUrl || imageUrl} onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = { document };
                }}
                />
              </div>
            </div>
            <div className="card-body items-center text-center">
              <h2 className="card-title">{userData.name} </h2>
              <h2>{userData.email}</h2>
              <div className="flex flex-col  justify-center flex-wrap gap-y-4">

                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text">Ganti foto Profil Anda</span>
                    <span className="label-text-alt">.jpg/.jpeg/.png</span>
                  </div>
                  <input type="file" accept="image/*" className="file-input file-input-bordered w-full max-w-xs" onChange={handleDocumentChange} required />
                  <div className="label">
                    <span className="label-text-alt">max. size</span>
                    <span className="label-text-alt">10Mb</span>
                  </div>
                </label>

                <div className="btn btn-secondary" onClick={handleSubmit}>
                  Ubah Profile
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