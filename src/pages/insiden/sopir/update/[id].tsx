import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getInsidenById } from '@/pages/api/insiden/getInsidenById'
import { updateInsiden } from '@/pages/api/insiden/updateInsiden'
import { getBuktiFoto } from '@/pages/api/insiden/getBuktiFoto'
import Navbar from '@/app/components/common/navbar';
import Footer from '@/app/components/common/footer';
import SuccessAlert from '@/app/components/common/SuccessAlert';
import FailAlert from '@/app/components/common/FailAlert';
import Drawer from "@/app/components/common/drawer";

const UpdateInsidenPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [insidenData, setInsidenData] = useState({
    kategori: '',
    lokasi: '',
    keterangan: '',
    buktiFoto: null,
  });
  const [file, setFile] = useState(null);
  const [alert, setAlert] = useState(null);
  const [buktiFotoUrl, setBuktiFotoUrl] = useState('');

  useEffect(() => {
    if (id) {
      getInsidenById(id).then((data) => {
        setInsidenData({
          kategori: data.kategori,
          lokasi: data.lokasi,
          keterangan: data.keterangan,
          buktiFoto: data.buktiFoto || null,
        });

        if (data.buktiFoto && data.buktiFoto.id) {
          getBuktiFoto(data.id)
            .then(blob => {
              setBuktiFotoUrl(URL.createObjectURL(blob));
            }).catch((error) => {
              console.error('Failed to load bukti foto:', error);
            });
        }
      }).catch((error) => {
        console.error('Failed to fetch insiden details:', error);
        setAlert(<FailAlert message="Failed to load insiden details." />);
      });
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('kategori', insidenData.kategori);
      formData.append('lokasi', insidenData.lokasi);
      formData.append('keterangan', insidenData.keterangan);
      if (file) formData.append('buktiFoto', file);

      await updateInsiden(id, formData);
      setAlert(<SuccessAlert message="Insiden updated successfully." />);
      setTimeout(() => router.push(`/insiden/sopir/detail/${id}`), 3000);
    } catch (error) {
      console.error('Error updating insiden:', error);
      setAlert(<FailAlert message="Failed to update insiden." />);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <>
      <Drawer userRole='userRole'>
      <main className="flex flex-col items-left justify-between px-4" data-theme="winter"> 
      {alert}
      <h2 className="text-2xl font-bold text-center my-6">Update Insiden</h2>
        <form onSubmit={handleSubmit}>
          
          <div className="mb-4">
            <label htmlFor="kategori" className="block text-sm font-medium text-gray-700">Kategori</label>
            <select
              id="kategori"
              value={insidenData.kategori}
              onChange={(e) => setInsidenData({ ...insidenData, kategori: e.target.value })}
              required
              className="w-full mt-1 p-2 border-2 rounded-md"
            >
              <option value="Alamat Hilang">Alamat Hilang</option>
              <option value="Pencurian Barang">Pencurian Barang</option>
              {/* Tambahkan opsi lain sesuai kebutuhan */}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="lokasi" className="block text-sm font-medium text-gray-700">Lokasi</label>
            <input
              id="lokasi"
              type="text"
              value={insidenData.lokasi}
              onChange={(e) => setInsidenData({ ...insidenData, lokasi: e.target.value })}
              required
              className="w-full mt-1 p-2 border-2 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="keterangan" className="block text-sm font-medium text-gray-700">Keterangan</label>
            <textarea
              id="keterangan"
              value={insidenData.keterangan}
              onChange={(e) => setInsidenData({ ...insidenData, keterangan: e.target.value })}
              required
              className="w-full mt-1 p-2 border-2 rounded-md"
              rows="4"
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="buktiFoto" className="block text-sm font-medium text-gray-700">Upload Bukti</label>
            <input
              id="buktiFoto"
              type="file"
              onChange={handleFileChange}
              className="w-full mt-1 p-2 border-2 rounded-md file:bg-blue-500 file:text-white file:border-none file:px-4 file:py-2 file:rounded-md file:cursor-pointer"
            />
          </div>
          {buktiFotoUrl && (
            <div className="mt-4 mb-4">
              <p className="text-sm text-gray-700">Bukti Foto Saat Ini:</p>
              <img src={buktiFotoUrl} alt="Bukti Foto" className="mt-2 max-h-60 w-auto" />
            </div>
          )}
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mb-4">
            Update
          </button>
        </form>
      </main>
      </Drawer>
      <Footer />
    </>
  );
};

export default UpdateInsidenPage;
