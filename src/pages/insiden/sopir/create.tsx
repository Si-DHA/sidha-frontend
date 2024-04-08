// import React, { useState, useEffect, ChangeEvent } from 'react';
// import { useRouter } from 'next/router';
// import Navbar from '@/app/components/common/navbar';
// import Footer from '@/app/components/common/footer';
// import SuccessAlert from "@/app/components/common/SuccessAlert";
// import FailAlert from "@/app/components/common/FailAlert";
// import Drawer from "@/app/components/common/drawer";
// import Cookies from "js-cookie";

// const CreateInsidenPage = () => {
//     const router = useRouter();
//     const [formData, setFormData] = useState({
//         kategori: '',
//         lokasi: '',
//         keterangan: '',
//         buktiFoto: null,
//     });
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [alert, setAlert] = useState(null);
//     const [userRole, setUserRole] = useState('');

//     useEffect(() => {
//         const isLoggedIn = Cookies.get('isLoggedIn');
//         if (!isLoggedIn) {
//             router.push('/login');
//         } else {
//             const role = Cookies.get('role');
//             setUserRole(role);
//         }
//     }, [router]);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({ ...formData, [name]: value });
//     };

//     const handleFileChange = (e) => {
//         setFormData({ ...formData, buktiFoto: e.target.files[0] });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setIsSubmitting(true);

//         const dataToSubmit = new FormData();
//         dataToSubmit.append('kategori', formData.kategori);
//         dataToSubmit.append('lokasi', formData.lokasi);
//         dataToSubmit.append('keterangan', formData.keterangan);
//         if (formData.buktiFoto) {
//             dataToSubmit.append('buktiFoto', formData.buktiFoto);
//         }

//         try {
//             const sopirId = Cookies.get('sopirId'); // Get sopirId from cookies
//             dataToSubmit.append('sopirId', sopirId);

//             // Replace with the actual endpoint for your insiden creation API
//             const response = await fetch('/api/insiden/createInsiden', {
//                 method: 'POST',
//                 body: dataToSubmit,
//             });

//             if (!response.ok) {
//                 throw new Error(`HTTP error! Status: ${response.status}`);
//             }

//             const result = await response.json();
//             setAlert(<SuccessAlert message="Insiden reported successfully!" />);
//             router.push('/some-success-page'); // Redirect to a success page
//         } catch (error) {
//             setAlert(<FailAlert message="Failed to report the incident. Please try again." />);
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     return (
//         <div className="min-h-screen flex flex-col">
//             <Navbar />
//             <Drawer userRole={userRole}>
//                 <main className="flex-grow container mx-auto p-4">
//                     {alert}
//                     <form onSubmit={handleSubmit} encType="multipart/form-data">
//                         <h2 className="text-xl font-bold mb-4">Report New Incident</h2>

//                         <label htmlFor="kategori">Category:</label>
//                         <input
//                             type="text"
//                             name="kategori"
//                             id="kategori"
//                             value={formData.kategori}
//                             onChange={handleChange}
//                             required
//                         />

//                         <label htmlFor="lokasi">Location:</label>
//                         <input
//                             type="text"
//                             name="lokasi"
//                             id="lokasi"
//                             value={formData.lokasi}
//                             onChange={handleChange}
//                             required
//                         />

//                         <label htmlFor="keterangan">Description:</label>
//                         <textarea
//                             name="keterangan"
//                             id="keterangan"
//                             value={formData.keterangan}
//                             onChange={handleChange}
//                             required
//                         />

//                         <label htmlFor="buktiFoto">Evidence Photo:</label>
//                         <input
//                             type="file"
//                             name="buktiFoto"
//                             id="buktiFoto"
//                             onChange={handleFileChange}
//                         />

//                         <button type="submit" disabled={isSubmitting}>
//                             {isSubmitting ? 'Submitting...' : 'Report Incident'}
//                         </button>
//                     </form>
//                 </main>
//             </Drawer>
//             <Footer />
//         </div>
//     );
// };

// export default CreateInsidenPage;

// Next.js page for Sopir to create an Insiden
// Next.js page for Sopir to create an Insiden

import { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function CreateInsidenPage() {
  const [kategori, setKategori] = useState('');
  const [lokasi, setLokasi] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [buktiFoto, setBuktiFoto] = useState<File | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('kategori', kategori);
    formData.append('lokasi', lokasi);
    formData.append('keterangan', keterangan);
    // We assume buktiFoto is a file input in your form
    if (buktiFoto) {
      formData.append('buktiFoto', buktiFoto);
    }

    try {
      const response = await axios.post('/api/insiden/createInsiden', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
      // Handle success, maybe set some state to show a success message
    } catch (error) {
      console.error('There was an error!', error);
      // Handle error, maybe set some state to show an error message
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Kategori" value={kategori} onChange={(e) => setKategori(e.target.value)} required />
      <input type="text" placeholder="Lokasi" value={lokasi} onChange={(e) => setLokasi(e.target.value)} required />
      <input type="text" placeholder="Keterangan" value={keterangan} onChange={(e) => setKeterangan(e.target.value)} required />
      <input type="file" onChange={(e) => setBuktiFoto(e.target.files ? e.target.files[0] : null)} />
      <button type="submit">Submit Insiden</button>
    </form>
  );
}