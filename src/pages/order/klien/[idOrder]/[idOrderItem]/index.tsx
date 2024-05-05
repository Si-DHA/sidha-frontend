import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { viewOrderItemById } from '@/pages/api/order/viewOrderItemById'
import { getImageMuat } from '@/pages/api/order/getImageMuat'
import { getImageBongkar } from '@/pages/api/order/getImageBongkar'
import Cookies from "js-cookie";
import Footer from "@/app/components/common/footer";
import Drawer from "@/app/components/common/drawer";

const OrderItemDetailPage = () => {
    const router = useRouter();
    const { idOrder, idOrderItem } = router.query;
    const [error, setError] = useState('');
    const [alert, setAlert] = useState(null);
    const [imageBongkarUrl, setImageBongkarUrl] = useState(null);
    const [imageMuatUrl, setImageMuatUrl] = useState(null);
    const [orderItemData, setOrderItemData] = useState(null);
    const [buktiBongkar, setBuktiBongkar] = useState(null);
    const [buktiMuat, setBuktiMuat] = useState(null);
    var isLoggedIn = Cookies.get('isLoggedIn');
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/login');
        }
        const role = Cookies.get('role');
        setUserRole(role || '');
    },)

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!idOrderItem) {
                    throw new Error('Order item ID is missing');
                }
                const imageBongkarResponse = await getImageBongkar(idOrderItem);
                const imageMuatResponse = await getImageMuat(idOrderItem);
                const objectBongkarUrl = URL.createObjectURL(imageBongkarResponse);
                const objectMuatUrl = URL.createObjectURL(imageMuatResponse);
                setImageBongkarUrl(objectBongkarUrl);
                setImageMuatUrl(objectMuatUrl);
            } catch (error: any) {
                setError(error.message || 'An error occurred');
            }
        };
        if (idOrderItem) {
            fetchData();
        }
    }, [idOrderItem]);

    useEffect(() => {
        if (idOrderItem) {
            viewOrderItemById(idOrderItem as string)
                .then(async data => {
                    setOrderItemData(data);
                    if (data.buktiBongkar && data.buktiBongkar.id) {
                        getImageBongkar(data.id)
                            .then(blob => {
                                setBuktiBongkar(URL.createObjectURL(blob));
                            })
                            .catch(console.error);
                    }
                    if (data.buktiMuat && data.buktiMuat.id) {
                        getImageMuat(data.id)
                            .then(blob => {
                                setBuktiMuat(URL.createObjectURL(blob));
                            })
                            .catch(console.error);
                    }
                })
                .catch(error => {
                    console.error('Fetching error:', error);
                });
        }
    }, [idOrderItem]);

    if (!orderItemData) return <div>Loading...</div>;

    const getStatusDescription = (statusCode) => {
        switch (statusCode) {
            case -1:
                return 'Ditolak';
            case 0:
                return 'Menunggu Konfirmasi';
            case 1:
                return 'Dikonfirmasi';
            case 2:
                return 'Menunggu DP';
            case 3:
                return 'Dalam Perjalanan';
            case 4:
                return 'Sampai (Menunggu Pelunasan)';
            case 5:
                return 'Selesai';
            default:
                return 'Unknown Status';
        }
    };

    const formatPrice = (price: number): string => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('id-ID', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
      };

    return (
        <main className="flex flex-col min-h-screen bg-white">
            <Drawer userRole={userRole}>
                {alert}
                <div className="container mx-auto px-4 py-8">
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Order Item {idOrderItem}</h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">Detail Order Item Anda</p>
                        </div>
                        <div className="border-t border-gray-200">
                            <dl>
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">ID</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{orderItemData['content']['id']}</dd>
                                </div>
                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Lokasi</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {formatPrice(orderItemData['content']['price'])}
                                    </dd>
                                </div>
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {getStatusDescription(orderItemData['content']['statusOrder'])}
                                    </dd>
                                </div>
                                {orderItemData['content']['statusOrder'] === -1 && (
                                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Alasan Penolakan</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{orderItemData['content']['alasanPenolakan']}</dd>
                                    </div>
                                )}
                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Pecah Belah?</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {orderItemData['content']['isPecahBelah'] ? 'Ya' : 'Bukan'}
                                    </dd>
                                </div>
                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Tipe Barang</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{orderItemData['content']['tipeBarang']}</dd>
                                </div>
                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Tipe Truk</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{orderItemData['content']['tipeTruk']}</dd>
                                </div>
                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Keterangan</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {orderItemData['content']['keterangan'] ? orderItemData['content']['keterangan'] : 'Tidak ada keterangan'}
                                    </dd>
                                </div>
                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Kota Asal</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{orderItemData['content']['rute'][0]['source']}</dd>
                                </div>
                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Alamat Asal</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{orderItemData['content']['rute'][0]['alamatPenjemputan']}</dd>
                                </div>
                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Kota Tujuan</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{orderItemData['content']['rute'][0]['destination']}</dd>
                                </div>
                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Alamat Tujuan</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{orderItemData['content']['rute'][0]['alamatPengiriman']}</dd>
                                </div>
                                {orderItemData['content']['buktiMuat'] ? (
                                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Bukti Muat</dt>
                                        <dd className="mt-1 sm:mt-0 sm:col-span-2">
                                            <img
                                                src={imageMuatUrl}
                                                width={300}
                                                alt="Bukti Muat"
                                                style={{ maxWidth: '100%', height: 'auto' }}
                                            />
                                        </dd>
                                    </div>
                                ) : (
                                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Bukti Muat</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">Belum ada bukti muat</dd>
                                    </div>
                                )}

                                {orderItemData['content']['buktiBongkar'] ? (
                                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Bukti Bongkar</dt>
                                        <dd className="mt-1 sm:mt-0 sm:col-span-2">
                                            <img
                                                src={imageBongkarUrl}
                                                width={300}
                                                alt="Bukti Bongkar"
                                                style={{ maxWidth: '100%', height: 'auto' }}
                                            />
                                        </dd>
                                    </div>
                                ) : (
                                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Bukti Bongkar</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">Belum ada bukti bongkar</dd>
                                    </div>
                                )}

                            </dl>
                        </div>
                        {/* Riwayat Purchase Order section */}
                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Riwayat</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <ul className="timeline timeline-vertical timeline-compact">
                                    {orderItemData['content']['orderItemHistories'].map((history) => (
                                        <li key={history.id}>
                                            <div className="timeline-start">{formatDate(history.createdDate)}</div>
                                            <div className="timeline-middle">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                    className="w-5 h-5"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </div>
                                            <div className="timeline-end timeline-box mb-5">
                                            <span className="font-bold">{history.createdBy}</span>: {history.description}
                                            </div>
                                            {history.id !== orderItemData['content']['orderItemHistories'][orderItemData['content']['orderItemHistories'].length - 1].id && (
                                                <hr className="bg-success" />
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </dd>
                        </div>
                        <div className="px-4 py-5 sm:px-6 flex justify-between">
                            <button
                                onClick={() => router.push(`/order/klien/${idOrder}`)}
                                className="btn btn-secondary"
                            >
                                Kembali
                            </button>
                        </div>

                    </div>
                </div>
            </Drawer>
            <Footer />
        </main>
    );
};

export default OrderItemDetailPage;
