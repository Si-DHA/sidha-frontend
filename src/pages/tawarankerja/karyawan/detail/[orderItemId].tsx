import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getTawaranKerjaByOrderItemId } from '@/pages/api/tawaran-kerja/getTawaranKerjaByOrderItem';
import { confirmTawaranKerja } from '@/pages/api/tawaran-kerja/confirmTawaranKerja';
import Footer from '@/app/components/common/footer';
import Drawer from '@/app/components/common/drawer';
import Cookies from 'js-cookie';

const KaryawanDetailPage = () => {
  const [orderItemDetails, setOrderItemDetails] = useState(null);
  const [sopirOffers, setSopirOffers] = useState([]);
  const [selectedSopirId, setSelectedSopirId] = useState('');
  const [confirmedSopir, setConfirmedSopir] = useState(null);
  const [confirmationStatus, setConfirmationStatus] = useState(false);
  const router = useRouter();
  const { orderItemId } = router.query;

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
      alert('Please select a sopir to confirm.');
      return;
    }
    try {
      const karyawanId = Cookies.get('idUser');
      await confirmTawaranKerja(selectedSopirId, karyawanId);
      localStorage.setItem(`confirmedSopir-${orderItemId}`, selectedSopirId);
      setConfirmationStatus(true);
      const sopir = sopirOffers.find(offer => offer.id === selectedSopirId);
      setConfirmedSopir(sopir);
      alert('Sopir confirmed for the job offer.');
    } catch (error) {
      console.error('Error confirming sopir for the job offer:', error);
      alert('Failed to confirm sopir for the job offer.');
    }
  };

  return (
    <Drawer userRole="karyawan">
      <main className="container mx-auto p-4">
        {orderItemDetails ? (
          <>
            <div>
              <h2 className="text-2xl font-bold mb-4">Order Details</h2>
              <p><strong>Source:</strong> {orderItemDetails.rute[0]?.source ?? 'N/A'}</p>
              <p><strong>Destination:</strong> {orderItemDetails.rute[0]?.destination ?? 'N/A'}</p>
              <p><strong>Price:</strong> Rp {orderItemDetails.price?.toLocaleString('id-ID')}</p>
            </div>
            <div className="mt-4">
              <h3 className="text-xl font-semibold">Select Sopir for this Order</h3>
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
                <p className="text-green-500 mt-4">
                  {confirmedSopir.sopir.name} from {confirmedSopir.lokasi} has been confirmed for this job.
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
