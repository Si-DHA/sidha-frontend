
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getTawaranKerjaByOrderItemId } from '@/pages/api/tawaran-kerja/getTawaranKerjaByOrderItem';
import { acceptTawaranKerja } from '@/pages/api/tawaran-kerja/acceptTawaranKerja';
import Footer from '@/app/components/common/footer';
import Drawer from '@/app/components/common/drawer';
import Cookies from 'js-cookie';
import SuccessAlert from "@/app/components/common/SuccessAlert";
import FailAlert from "@/app/components/common/FailAlert";

const DetailPage = () => {
    const [orderItem, setOrderItem] = useState(null);
    const [lokasi, setLokasi] = useState('');
    const [hasAccepted, setHasAccepted] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [otherConfirmed, setOtherConfirmed] = useState(false);
    const router = useRouter();
    const { orderItemId } = router.query;
    const sopirId = Cookies.get('idUser');
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });

    useEffect(() => {
        if (orderItemId) {
            getTawaranKerjaByOrderItemId(orderItemId)
                .then(tawaranKerja => {
                    const offers = tawaranKerja.filter(offer => offer.sopir.id === sopirId);
                    const otherOffersConfirmed = tawaranKerja.some(offer => offer.isDikonfirmasiKaryawan && offer.sopir.id !== sopirId);

                    if (offers.length > 0) {
                        const firstOffer = offers[0];
                        setOrderItem(firstOffer.orderItem);
                        setHasAccepted(true);
                        setIsConfirmed(firstOffer.isDikonfirmasiKaryawan);
                    }
                    setOtherConfirmed(otherOffersConfirmed);
                })
                .catch(console.error);
        }
    }, [orderItemId, sopirId]);

    const handleAccept = async () => {
        if (!orderItemId) {
            setAlert({ show: true, message: 'ID item tawaran tidak ditemukan', type: 'fail' });
            return;
        }
        try {
            await acceptTawaranKerja(orderItemId.toString(), sopirId, lokasi);
            setAlert({ show: true, message: 'Tawaran kerja berhasil diterima', type: 'success' });
            setHasAccepted(true);
            // Reload or re-fetch the data to reflect the new state
            router.reload();
        } catch (error) {
            console.error('Error accepting job offer:', error);
            setAlert({ show: true, message: 'Gagal menerima tawaran kerja', type: 'fail' });
        }
    };

    return (
        <div className="flex flex-col h-screen justify-between" data-theme="winter">
            <Drawer userRole='userRole'>
                <main className="flex-grow overflow-auto p-4">
                    {alert.show && (
                        alert.type === 'success' ?
                            <SuccessAlert message={alert.message} /> :
                            <FailAlert message={alert.message} />
                    )}
                    {orderItem ? (
                        <div className="container mx-auto px-4 md:px-0">
                            <h2 className="text-2xl font-bold text-center mb-6">Detail Penawaran Kerja</h2>
                            <div className="max-w-2xl mx-auto">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <p><strong>Source:</strong> {orderItem.rute[0]?.source ?? 'N/A'}</p>
                                    <p><strong>Destination:</strong> {orderItem.rute[0]?.destination ?? 'N/A'}</p>
                                    <p><strong>Mudah Pecah:</strong> {orderItem.isPecahBelah ? 'Yes' : 'No'}</p>
                                    <p><strong>Price:</strong> {orderItem.price}</p>
                                    <p><strong>Tipe Barang:</strong> {orderItem.tipeBarang}</p>
                                    <p><strong>Tipe Truk:</strong> {orderItem.tipeTruk}</p>
                                    <p><strong>Alamat Pengiriman:</strong> {orderItem.rute[0]?.alamatPengiriman ?? 'N/A'}</p>
                                    <p><strong>Alamat Penjemputan:</strong> {orderItem.rute[0]?.alamatPenjemputan ?? 'N/A'}</p>
                                </div>
                            </div>
                            {hasAccepted && (
                                <div className="text-center mt-5 mb-4">
                                    {isConfirmed && (
                                        <p className="text-lg font-bold text-green-500">
                                            Anda mendapatkan pekerjaan ini. Selamat mengantar!
                                        </p>
                                    )}
                                    {otherConfirmed && (
                                        <p className="text-lg font-bold text-red-500">
                                            Sopir lain telah dikonfirmasi untuk pekerjaan ini. Silakan cari pengantaran lain!
                                        </p>
                                    )}
                                    {!isConfirmed && !otherConfirmed && (
                                        <p className="text-lg font-semibold">
                                            Tunggu konfirmasi dari kami ya!
                                        </p>
                                    )}
                                </div>
                            )}

                        </div>
                    ) : (
                        <div className="text-center">
                            <p>Loading job offer details...</p>
                        </div>
                    )}
                </main>
                <Footer />
            </Drawer>
        </div>
    );
};

export default DetailPage;