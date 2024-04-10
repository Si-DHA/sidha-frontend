import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getInsidenById } from '@/pages/api/insiden/getInsidenById';
import { updateStatus } from '@/pages/api/insiden/updateStatus';
import Navbar from '@/app/components/common/navbar';
import Footer from '@/app/components/common/footer';
import SuccessAlert from '@/app/components/common/SuccessAlert';
import FailAlert from '@/app/components/common/FailAlert';
import { getBuktiFoto } from '@/pages/api/insiden/getBuktiFoto'
import Drawer from "@/app/components/common/drawer";

const KaryawanInsidenDetailPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const [insiden, setInsiden] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [alert, setAlert] = useState(null);
    const [buktiFotoUrl, setBuktiFotoUrl] = useState(null);

    useEffect(() => {
        if (id) {
            getInsidenById(id as string)
                .then(data => {
                    setInsiden(data);
                    setSelectedStatus(data.status);
                    if (data.buktiFoto && data.buktiFoto.id) {
                        getBuktiFoto(data.id)
                          .then(blob => {
                            setBuktiFotoUrl(URL.createObjectURL(blob));
                          })
                          .catch(console.error);
                      }
                })
                .catch(error => {
                    console.error('Fetching error:', error);
                });
        }
    }, [id]);

    const handleUpdateStatus = async () => {
        try {
            // Pass the selectedStatus as the status parameter to the updateStatus function
            await updateStatus(id as string, selectedStatus);
            setAlert(<SuccessAlert message="Insiden status updated successfully" />);
            
            // Reload the page after a brief delay to reflect the updated status
            setTimeout(() => {
                window.location.reload(); // Refresh the page
            }, 1000); // Delay of 1 second (adjust as needed)
        } catch (error) {
            console.error('Error updating status:', error);
            setAlert(<FailAlert message="Error updating insiden status" />);
        }
    };

    const handleStatusChange = (e) => {
        setSelectedStatus(e.target.value);
    };

    if (!insiden) return <div>Loading...</div>;

    return (
        <>
            <Drawer userRole='userRole'>
            <main className="container mx-auto p-4">
                {alert}
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Insiden Detail</h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">Detail Insiden</p>
                    </div>
                    <div className="border-t border-gray-200">
                        <dl>
                            <div className="border-t border-gray-200">
                                <dl>
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
                            </div>
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Status</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    <select value={selectedStatus} onChange={handleStatusChange} className="w-full p-2 border border-gray-300 rounded-md">
                                        <option value="PENDING">Pending</option>
                                        <option value="ON_PROGRESS">On Progress</option>
                                        <option value="COMPLETED">Completed</option>
                                        <option value="CANCELLED">Cancelled</option>
                                    </select>
                                </dd>
                            </div>
                        </dl>
                    </div>
                    <div className="px-4 py-5 sm:px-6 flex justify-end">
                        <button
                            onClick={() => router.push('/insiden/karyawan')}
                            className="btn btn-secondary mr-4" // Added margin to the right
                        >
                            Back
                        </button>
                        <button
                            onClick={handleUpdateStatus}
                            className="btn btn-primary"
                        >
                            Update Status
                        </button>
                    </div>
                </div>
            </main>
            </Drawer>
            <Footer />
        </>
    );
};

export default KaryawanInsidenDetailPage;
