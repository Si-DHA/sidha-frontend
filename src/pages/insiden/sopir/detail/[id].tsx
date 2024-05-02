import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getInsidenById } from '@/pages/api/insiden/getInsidenById'
import { getBuktiFoto } from '@/pages/api/insiden/getBuktiFoto'
import { deleteInsiden } from '@/pages/api/insiden/deleteInsiden'
import Footer from "@/app/components/common/footer";
import SuccessAlert from '@/app/components/common/SuccessAlert';
import FailAlert from '@/app/components/common/FailAlert';
import Drawer from "@/app/components/common/drawer";

const InsidenDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [insiden, setInsiden] = useState(null);
  const [buktiFotoUrl, setBuktiFotoUrl] = useState(null);
  const [alert, setAlert] = useState(null);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);

  useEffect(() => {
    if (id) {
      getInsidenById(id as string)
        .then(data => {
          setInsiden(data);
          if (data.buktiFoto && data.buktiFoto.id) {
            getBuktiFoto(data.id)
              .then(blob => {
                setBuktiFotoUrl(URL.createObjectURL(blob));
              })
              .catch(console.error);
          }
        })
        .catch(console.error);
    }
  }, [id]);

  const toggleDeleteConfirmModal = () => {
    setShowDeleteConfirmModal(!showDeleteConfirmModal);
  };

  const handleDelete = async () => {
    if (!id) {
      setAlert(<FailAlert message="No incident ID provided for deletion." />);
      return;
    }
    try {
      await deleteInsiden(id.toString());
      setAlert(<SuccessAlert message="Incident deleted successfully" />);
      setTimeout(() => {
        router.push('/insiden/sopir');
      }, 3000);
    } catch (error) {
      console.error('Error deleting the incident:', error);
      setAlert(<FailAlert message="Error deleting the incident." />);
    }
    finally {
      toggleDeleteConfirmModal(); // Close the modal
    }
  };

  const deleteButton = insiden && insiden.status === 'PENDING' ? (
    <button onClick={toggleDeleteConfirmModal} className="btn btn-error">
      Hapus Laporan
    </button>
  ) : null;


  const updateButton = insiden && insiden.status === 'PENDING' ? (
    <button onClick={() => router.push(`/insiden/sopir/update/${id}`)} className="btn btn-primary">
      Update Laporan
    </button>
  ) : null;


  if (!insiden) return <div>Loading...</div>;

  return (
    <main className="flex flex-col items-center justify-between" data-theme="winter">
      <Drawer userRole='sopir'>
        {alert}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-xl text-center font-bold mb-2">Detail Laporan Insiden</h3>
          </div>
          <dl>
            {insiden.orderItem && (
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Asal - Tujuan</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{insiden.orderItem.rute[0].source} to {insiden.orderItem.rute[0].destination}
                </dd>
              </div>
            )}
            {insiden.createdAt && (
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Tanggal Laporan</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {
                    new Date(insiden.updatedAt || insiden.createdAt).toLocaleString('id-ID', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  }
                </dd>
              </div>

            )}
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Kategori</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{insiden.kategori}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Lokasi</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{insiden.lokasi}</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Keterangan</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{insiden.keterangan}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{insiden.status}</dd>
            </div>
            {buktiFotoUrl && (
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Bukti Foto</dt>
                <dd className="mt-1 sm:mt-0 sm:col-span-2">
                  <img
                    src={buktiFotoUrl}
                    width={300}
                    className="rounded-lg"
                    alt="Bukti Foto"
                    style={{ maxWidth: '100%', height: 'auto' }}
                  />
                </dd>
              </div>
            )}
          </dl>
          <div className="px-4 py-5 sm:px-6 flex justify-between">
            <button
              onClick={() => router.push('/insiden/sopir')}
              className="btn btn-secondary"
            >
              Kembali
            </button>
            <div className="flex space-x-4">
              {updateButton}
              {deleteButton}
            </div>
          </div>
        </div>
        {showDeleteConfirmModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <h3 className="text-lg font-medium">Konfirmasi Penghapusan</h3>
              <p>Apakah Anda yakin ingin menghapus laporan ini?</p>
              <div className="flex justify-end mt-4">
                <button onClick={toggleDeleteConfirmModal} className="btn btn-secondary mr-2">
                  Cancel
                </button>
                <button onClick={handleDelete} className="btn btn-error">
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </Drawer>
      <Footer />
    </main>
  );
};

export default InsidenDetailPage;
