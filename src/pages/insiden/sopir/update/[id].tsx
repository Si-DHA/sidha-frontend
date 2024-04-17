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
import { getAcceptedOffersBySopir } from '@/pages/api/tawaran-kerja/getAcceptedOffersBySopir';
import Cookies from 'js-cookie';

const UpdateInsidenPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [insidenData, setInsidenData] = useState({
    kategori: '',
    lokasi: '',
    keterangan: '',
    orderItemId: '',
    buktiFoto: null,
  });
  const [file, setFile] = useState(null);
  const [alert, setAlert] = useState(null);
  const [buktiFotoUrl, setBuktiFotoUrl] = useState('');
  const [orderItems, setOrderItems] = useState([]);

  useEffect(() => {
    const sopirId = Cookies.get('idUser');
    if (id && sopirId) {
      getInsidenById(id).then((data) => {
        setInsidenData({
          kategori: data.kategori,
          lokasi: data.lokasi,
          keterangan: data.keterangan,
          buktiFoto: data.buktiFoto || null,
          orderItemId: data.orderItemId || ''
        });
      }).catch((error) => {
        console.error('Failed to fetch insiden details:', error);
        setAlert(<FailAlert message="Failed to load insiden details." />);
      });

      getAcceptedOffersBySopir(sopirId).then(data => {
        setOrderItems(data.content);
      }).catch(error => {
        console.error('Fetching error:', error);
        setAlert(<FailAlert message="Failed to load order items." />);
      });

      if (insidenData.buktiFoto && insidenData.buktiFoto.id) {
        getBuktiFoto(insidenData.buktiFoto.id)
          .then(blob => {
            setBuktiFotoUrl(URL.createObjectURL(blob));
          }).catch((error) => {
            console.error('Failed to load bukti foto:', error);
          });
      }
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('kategori', insidenData.kategori);
    formData.append('lokasi', insidenData.lokasi);
    formData.append('keterangan', insidenData.keterangan);
    formData.append('orderItemId', insidenData.orderItemId); // Include orderItemId in formData
    if (file) formData.append('buktiFoto', file);

    try {
      await updateInsiden(id, formData);
      setAlert(<SuccessAlert message="Insiden updated successfully." />);
      setTimeout(() => router.push(`/insiden/sopir/detail/${id}`), 3000);
    } catch (error) {
      console.error('Error updating insiden:', error);
      setAlert(<FailAlert message={error.message || "Failed to update insiden."} />);
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
              <label htmlFor="orderItemId" className="block text-sm font-medium text-gray-700">Order Item</label>
              <select
                id="orderItemId"
                value={insidenData.orderItemId}
                onChange={(e) => setInsidenData({ ...insidenData, orderItemId: e.target.value })}
                required
                className="w-full mt-1 p-2 border-2 rounded-md"
              >
                <option value="">Select an Order Item</option>
                {orderItems.map(item => (
                  <option key={item.id} value={item.id}>{item.description}</option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="kategori" className="block text-sm font-medium text-gray-700">Kategori</label>
              <select
                id="kategori"
                value={insidenData.kategori}
                onChange={(e) => setInsidenData({ ...insidenData, kategori: e.target.value })}
                required
                className="w-full mt-1 p-2 border-2 rounded-md"
              >
                <option value="Bencana Alam">Bencana Alam</option>
                <option value="Kecelakaan">Kecelakaan</option>
                <option value="Kendaraan Rusak">Kendaraan Rusak</option>
                <option value="Pencurian Barang">Pencurian Barang</option>
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
