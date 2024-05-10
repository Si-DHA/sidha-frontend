import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getInsidenById } from '@/pages/api/insiden/getInsidenById';
import { updateStatus } from '@/pages/api/insiden/updateStatus';
import Footer from '@/app/components/common/footer';
import SuccessAlert from '@/app/components/common/SuccessAlert';
import FailAlert from '@/app/components/common/FailAlert';
import { getBuktiFoto } from '@/pages/api/insiden/getBuktiFoto'
import Drawer from "@/app/components/common/drawer";
import Cookies from 'js-cookie';

const KaryawanInsidenDetailPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const [insiden, setInsiden] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [alert, setAlert] = useState(null);
    const [buktiFotoUrl, setBuktiFotoUrl] = useState(null);
    const [userRole, setUserRole] = useState('');
    const [error, setError] = useState('');
    var isLoggedIn = Cookies.get('isLoggedIn');

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/login');
        }
        const role = Cookies.get('role');
        if (role === 'KARYAWAN') {
            setUserRole(role);
        } else {
            setError('You are not allowed to access this page');
        }

    }, [isLoggedIn, router])

    useEffect(() => {
        const fetchUserRole = Cookies.get('role');
        setUserRole(fetchUserRole || 'defaultRole');
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
            await updateStatus(id as string, selectedStatus);
            setAlert(<SuccessAlert message="Insiden status updated successfully" />);
            setTimeout(() => {
                window.location.reload();
            }, 1000);
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
        <main className="flex flex-col items-center justify-between" data-theme="winter">
            <Drawer userRole={userRole}>
                {alert}
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-xl text-center font-bold mb-2">Detail Laporan Insiden</h3>
                    </div>
                    <dl>
                        {insiden.orderItem && (
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">ID Order Item</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{insiden.orderItem.id}
                                </dd>
                            </div>
                        )}
                        {insiden.orderItem && (
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Asal - Tujuan</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{insiden.orderItem.rute[0].source} - {insiden.orderItem.rute[0].destination}
                                </dd>
                            </div>
                        )}
                        {insiden.createdAt && (
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Tanggal Laporan</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {new Date(insiden.updatedAt || insiden.createdAt).toLocaleString('id-ID', {
                                        day: '2-digit',
                                        month: 'long',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
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
                    <div className="px-4 py-5 sm:px-6 flex justify-end">
                        <button
                            onClick={() => router.push('/insiden/karyawan')}
                            className="btn btn-secondary mr-4"
                        >
                            Kembali
                        </button>
                        <button
                            disabled={insiden.status == 'COMPLETED' || insiden.status == 'CANCELLED'}
                            onClick={handleUpdateStatus}
                            className="btn btn-primary"
                        >
                            Perbarui Status
                        </button>
                    </div>
                </div>
            </Drawer>
            <Footer />
        </main>
    );
};

export default KaryawanInsidenDetailPage;
