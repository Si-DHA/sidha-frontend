import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getTawaranKerjaByOrderItemId } from '@/pages/api/tawaran-kerja/getTawaranKerjaByOrderItem';
import { confirmTawaranKerja } from '@/pages/api/tawaran-kerja/confirmTawaranKerja';
import Footer from '@/app/components/common/footer';
import Drawer from '@/app/components/common/drawer';
import Cookies from 'js-cookie';
import SuccessAlert from "@/app/components/common/SuccessAlert";
import FailAlert from "@/app/components/common/FailAlert";

const KaryawanDetailPage = () => {
  const [orderItemDetails, setOrderItemDetails] = useState(null);
  const [sopirOffers, setSopirOffers] = useState([]);
  const [selectedSopirId, setSelectedSopirId] = useState('');
  const [confirmedSopir, setConfirmedSopir] = useState(null);
  const [confirmationStatus, setConfirmationStatus] = useState(false);
  const router = useRouter();
  const { orderItemId } = router.query;
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    const confirmedId = localStorage.getItem(`confirmedSopir-${orderItemId}`);
    if (confirmedId) {
      setConfirmationStatus(true);
      setSelectedSopirId(confirmedId);
      // Optionally, also fetch and set the sopir details if needed
    }

    if (orderItemId) {
      getTawaranKerjaByOrderItemId(orderItemId).then(response => {
        setSopirOffers(response);
        if (response.length > 0) {
          setOrderItemDetails(response[0].orderItem);
          if (confirmedId) {
            const sopir = response.find(offer => offer.id === confirmedId);
            setConfirmedSopir(sopir);
          }
        }
      }).catch(error => {
        console.error('Error fetching job offers by order item ID:', error);
      });
    }
  }, [orderItemId]);

  const handleConfirmSopir = async () => {
    if (!selectedSopirId) {
      setAlert({ show: true, message: 'Pilih sopir terlebih dahulu', type: 'fail' });
      return;
    }
    try {
      const karyawanId = Cookies.get('idUser');
      await confirmTawaranKerja(selectedSopirId, karyawanId);
      localStorage.setItem(`confirmedSopir-${orderItemId}`, selectedSopirId);
      setConfirmationStatus(true);
      const sopir = sopirOffers.find(offer => offer.id === selectedSopirId);
      setConfirmedSopir(sopir);
      setAlert({ show: true, message: 'Sopir berhasil terkonfirmasi', type: 'success' });
    } catch (error) {
      console.error('Error confirming sopir for the job offer:', error);
      setAlert({ show: true, message: 'Gagal mengkonfirmasi sopir', type: 'fail' });
    }
  };

  return (
    <Drawer userRole="karyawan">
      <main className="flex flex-col items-center justify-between" data-theme="winter">
        {alert.show && (alert.type === 'success' ? <SuccessAlert message={alert.message} /> : <FailAlert message={alert.message} />)}
        {orderItemDetails ? (
          <>
            <div className="flex-1 pr-4 max-w-lg">
              <h2 className="text-2xl font-bold mb-4">Detail Penawaran Kerja</h2>
              <div className="grid grid-cols-2 gap-4">
                <p><strong>Asal:</strong> {orderItemDetails.rute[0]?.source ?? 'N/A'}</p>
                <p><strong>Tujuan:</strong> {orderItemDetails.rute[0]?.destination ?? 'N/A'}</p>
                <p><strong>Harga:</strong> Rp{orderItemDetails.price?.toLocaleString('id-ID')}</p>
                <p><strong>Mudah Pecah:</strong> {orderItemDetails.isPecahBelah ? 'Yes' : 'No'}</p>
                <p><strong>Tipe Barang:</strong> {orderItemDetails.tipeBarang}</p>
                <p><strong>Tipe Truk:</strong> {orderItemDetails.tipeTruk}</p>
                <p><strong>Alamat Pengiriman:</strong> {orderItemDetails.rute[0]?.alamatPengiriman ?? 'N/A'}</p>
                <p><strong>Alamat Penjemputan:</strong> {orderItemDetails.rute[0]?.alamatPenjemputan ?? 'N/A'}</p>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-xl mb-1 font-semibold">Select Sopir for this Order</h3>
              <select
                value={selectedSopirId}
                onChange={(e) => setSelectedSopirId(e.target.value)}
                className="select select-bordered w-full max-w-xs mb-4"
                disabled={confirmationStatus}
              >
                <option disabled value="">Select Sopir</option>
                {sopirOffers.map((offer) => (
                  <option key={offer.id} value={offer.id}>
                    {offer.sopir.name} - {offer.lokasi}
                  </option>
                ))}
              </select>
              <button
                onClick={handleConfirmSopir}
                className="btn btn-primary"
                disabled={confirmationStatus || !selectedSopirId}
              >
                Confirm Sopir
              </button>
              {confirmedSopir && (
                <p className="text-green-500 mt-2 mb-4">
                <strong>{confirmedSopir.sopir.name}</strong> dari <strong>{confirmedSopir.lokasi}</strong> telah dikonfirmasi untuk pekerjaan ini.
              </p>
              
              )}
            </div>
          </>
        ) : (
          <p>Loading order details...</p>
        )}
      </main>
      <Footer />
    </Drawer>
  );
};

export default KaryawanDetailPage;
