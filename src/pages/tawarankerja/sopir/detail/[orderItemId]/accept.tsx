
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getTawaranKerjaByOrderItemId } from '@/pages/api/tawaran-kerja/getTawaranKerjaByOrderItem';
import { acceptTawaranKerja } from '@/pages/api/tawaran-kerja/acceptTawaranKerja';
import Footer from '@/app/components/common/footer';
import Drawer from '@/app/components/common/drawer';
import Cookies from 'js-cookie';

const DetailPage = () => {
    const [orderItem, setOrderItem] = useState(null);
    const [lokasi, setLokasi] = useState('');
    const [hasAccepted, setHasAccepted] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [otherConfirmed, setOtherConfirmed] = useState(false);
    const router = useRouter();
    const { orderItemId } = router.query;
    const sopirId = Cookies.get('idUser');

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
            alert('Order item ID is missing');
            return;
        }
        try {
            await acceptTawaranKerja(orderItemId.toString(), sopirId, lokasi);
            alert('Job offer accepted successfully');
            setHasAccepted(true);
            // Reload or re-fetch the data to reflect the new state
            router.reload();
        } catch (error) {
            console.error('Error accepting job offer:', error);
            alert('Failed to accept job offer');
        }
    };

    return (
        <Drawer userRole='userRole'>
            <main className="container mx-auto p-4 flex flex-wrap justify-between">
                {orderItem ? (
                    <>
                        <div className="flex-1 pr-4 max-w-lg">
                            <h2 className="text-2xl font-bold mb-4">Detail Penawaran Kerja</h2>
                            <p><strong>Source:</strong> {orderItem.rute[0]?.source ?? 'N/A'}</p>
                            <p><strong>Destination:</strong> {orderItem.rute[0]?.destination ?? 'N/A'}</p>
                            <p><strong>Mudah Pecah:</strong> {orderItem.isPecahBelah ? 'Yes' : 'No'}</p>
                            <p><strong>Price:</strong> {orderItem.price}</p>
                            <p><strong>Tipe Barang:</strong> {orderItem.tipeBarang}</p>
                            <p><strong>Tipe Truk:</strong> {orderItem.tipeTruk}</p>
                            <p><strong>Alamat Pengiriman:</strong> {orderItem.rute[0]?.alamatPengiriman ?? 'N/A'}</p>
                            <p><strong>Alamat Penjemputan:</strong> {orderItem.rute[0]?.alamatPenjemputan ?? 'N/A'}</p>
                            <p><strong>Created Date:</strong> {new Date(orderItem.createdDate).toLocaleString('id-ID')}</p>
                            <p><strong>Created By:</strong> {orderItem.createdBy}</p>
                        </div>
                        {!hasAccepted && (
                            <div className="flex-1 max-w-md">
                                <input
                                    type="text"
                                    placeholder="Enter your current location"
                                    value={lokasi}
                                    onChange={e => setLokasi(e.target.value)}
                                    className="input input-bordered input-primary w-full mb-2"
                                />
                                <button
                                    onClick={handleAccept}
                                    className="btn btn-primary w-full"
                                >
                                    Accept Job Offer
                                </button>
                            </div>
                        )}
                        {hasAccepted && (
                            <div className="text-center mt-4">
                                <p>You have already accepted this job offer. {isConfirmed ? "You have been confirmed for this job." : otherConfirmed ? "Another sopir has been confirmed for this job." : "Waiting for confirmation."}</p>
                            </div>
                        )}
                    </>
                ) : (
                    <p>Loading job offer details...</p>
                )}
            </main>
            <Footer />
        </Drawer>
    );
};

export default DetailPage;