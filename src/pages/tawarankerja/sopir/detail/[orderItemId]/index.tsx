
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getTawaranKerja } from '@/pages/api/tawaran-kerja/getTawaranKerja';
import { acceptTawaranKerja } from '@/pages/api/tawaran-kerja/acceptTawaranKerja';
import { getAcceptedOffersBySopir } from '@/pages/api/tawaran-kerja/getAcceptedOffersBySopir';
import Footer from '@/app/components/common/footer';
import Drawer from '@/app/components/common/drawer';
import Cookies from 'js-cookie';
import SuccessAlert from "@/app/components/common/SuccessAlert";
import FailAlert from "@/app/components/common/FailAlert";

const SopirDetailPage = () => {
    const [orderItem, setOrderItem] = useState(null);
    const [lokasi, setLokasi] = useState('');
    const [hasAccepted, setHasAccepted] = useState(false);
    const router = useRouter();
    const { orderItemId } = router.query;
    const sopirId = Cookies.get('idUser');
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });

    useEffect(() => {
        if (orderItemId) {
            getTawaranKerja(orderItemId as string)
                .then(data => {
                    // `data` is an array of items
                    const matchingItem = data.find(item => item.id === orderItemId);
                    if (matchingItem) {
                        console.log("Matching data:", matchingItem);
                        setOrderItem({
                            ...matchingItem,
                            source: matchingItem.rute[0]?.source ?? 'N/A',
                            destination: matchingItem.rute[0]?.destination ?? 'N/A',
                            isPecahBelah: matchingItem.isPecahBelah ? 'Yes' : 'No',
                            price: matchingItem.price ?? 'N/A',
                            tipeBarang: matchingItem.tipeBarang ?? 'N/A',
                            tipeTruk: matchingItem.tipeTruk ?? 'N/A',
                            alamatPengiriman: matchingItem.rute?.[0]?.alamatPengiriman ?? 'N/A',
                            alamatPenjemputan: matchingItem.rute?.[0]?.alamatPenjemputan ?? 'N/A',
                            createdDate: matchingItem.orderItemHistories?.[0]?.createdDate
                                ? new Date(matchingItem.orderItemHistories[0].createdDate).toLocaleString('id-ID')
                                : 'N/A',
                            createdBy: matchingItem.orderItemHistories?.[0]?.createdBy ?? 'N/A',
                        });
                        setIsConfirmed(matchingItem.isDikonfirmasiKaryawan);
                    } else {
                        console.log(`No item found with id: ${orderItemId}`);
                    }
                })
                .catch(console.error);
            if (sopirId) {
                getAcceptedOffersBySopir(sopirId)
                    .then(acceptedOffers => {
                        const hasAcceptedOffer = acceptedOffers.content.some(offer => offer.orderItem.id === orderItemId);
                        setHasAccepted(hasAcceptedOffer);
                    })
                    .catch(console.error);
            }
            if (hasAccepted) {
                router.replace(`accept`);
            }
        }
    }, [hasAccepted, router, orderItemId, sopirId]);


    const handleAccept = async () => {
        if (!orderItemId) {
            setAlert({ show: true, message: 'ID item tawaran tidak ditemukan', type: 'fail' });
            return;
        }
        try {
            const sopirId = Cookies.get('idUser');
            await acceptTawaranKerja(orderItemId.toString(), sopirId, lokasi);
            setAlert({ show: true, message: 'Tawaran kerja berhasil diterima', type: 'success' });
            router.replace(`/tawarankerja/sopir/detail/${orderItemId}/accept`);
        } catch (error) {
            console.error('Error accepting job offer:', error);
            setAlert({ show: true, message: 'Gagal menerima tawaran kerja', type: 'fail' });
        }
    };

    // Inside your component's return statement
    return (
        <Drawer userRole='userRole'>
            <main className="flex flex-col items-center justify-between" data-theme="winter">
                {alert.show && (alert.type === 'success' ? <SuccessAlert message={alert.message} /> : <FailAlert message={alert.message} />)}
                {orderItem ? (
                    <div className="w-full max-w-4xl p-4 bg-white shadow-md rounded-lg">
                        <h2 className="text-2xl font-bold mb-4">Detail Penawaran Kerja</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <p><strong>Asal:</strong> {orderItem.source}</p>
                            <p><strong>Tujuan:</strong> {orderItem.destination}</p>
                            <p><strong>Mudah Pecah:</strong> {orderItem.isPecahBelah}</p>
                            <p><strong>Harga:</strong> {orderItem.price}</p>
                            <p><strong>Tipe Barang:</strong> {orderItem.tipeBarang}</p>
                            <p><strong>Tipe Truk:</strong> {orderItem.tipeTruk}</p>
                            <p><strong>Alamat Pengiriman:</strong> {orderItem.alamatPengiriman}</p>
                            <p><strong>Alamat Penjemputan:</strong> {orderItem.alamatPenjemputan}</p>
                            {/* <p><strong>Tanggal Dibuat:</strong> {orderItem.createdDate}</p>
                            <p><strong>Username Klien:</strong> {orderItem.createdBy}</p> */}
                        </div>
                        {!hasAccepted && (
                            <div className="mt-4">
                                <input
                                    type="text"
                                    placeholder="Dimana lokasi Anda sekarang?"
                                    value={lokasi}
                                    onChange={e => setLokasi(e.target.value)}
                                    className="input input-bordered input-primary w-full mb-2"
                                />
                                <button
                                    onClick={() => handleAccept()}
                                    className="btn btn-primary w-full"
                                >
                                    Terima Tawaran Kerja
                                </button>
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
    );

};

export default SopirDetailPage;


