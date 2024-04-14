import Footer from "@/app/components/common/footer";
import Navbar from "@/app/components/common/navbar";
import SuccessAlert from "@/app/components/common/SuccessAlert";
import FailAlert from "@/app/components/common/FailAlert";
import { viewBuktiImage } from "../../api/pembayaran/viewBuktiImage";
import { konfirmasiBuktiPembayaran } from "../../api/pembayaran/konfirmasiBuktiPembayaran";
import { viewInvoice } from "../../api/invoice/viewInvoice";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

const KonfirmasiPembayaranPage = () => {
    const queryParameters = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const idInvoice = queryParameters?.get("id");
    const isPelunasan = queryParameters?.get("isPelunasan") === "true";
    const router = useRouter();
    const [error, setError] = useState('');
    const [alert, setAlert] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [invoiceData, setInvoiceData] = useState(null);
    const [buktiData, setBuktiData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const imageDataResponse = await viewBuktiImage(idInvoice, isPelunasan);
                const objectUrl = URL.createObjectURL(imageDataResponse);
                setImageUrl(objectUrl);

                const invoiceDataResponse = await viewInvoice(idInvoice);
                setInvoiceData(invoiceDataResponse['content']);
                if (isPelunasan) {
                    setBuktiData(invoiceDataResponse['content']['buktiPelunasan']);
                } else {
                    setBuktiData(invoiceDataResponse['content']['buktiDp']);
                }
            } catch (error: any) {
                setError(error.message);
            }
        };

        fetchData();
    }, []);

    const handleKonfirmasi = async (isConfirmed: boolean) => {
        try {
            // Create POST request body
            const requestBody = {
                idInvoice,
                isPelunasan,
                isConfirmed,
            };

            // Add alasan penolakan if it is being rejected
            if (!isConfirmed) {
                const alasanPenolakan = document.getElementById('alasanPenolakan').value;
                if (alasanPenolakan.trim()) {
                    requestBody.alasanPenolakan = alasanPenolakan;
                }
            }

            const konfirmasiResponse = await konfirmasiBuktiPembayaran(requestBody);
            setAlert(<SuccessAlert message="Bukti pembayaran berhasil dikonfirmasi" />);
            setTimeout(() => {
                window.location.reload();
            }, 3000);
        } catch (error) {
            setAlert(<FailAlert message={error.message || "Gagal mengonfirmasi bukti pembayaran"} />);
            setTimeout(() => {
                window.location.reload();
            }, 3000);
        }
    };


    return (
        <main className="flex min-h-screen flex-col items-center justify-between" data-theme="cmyk">
            <Navbar />

            <div className="flex flex-row">
                {alert}
            </div>
            <style jsx>{`
                .image-container {
                    padding-top:10px;
                    max-width: 200px;
                    max-height: 300px;
                    overflow: auto;
                    margin: 0 auto;
                }

                .image-container img {
                    width: auto;
                    height: 100%;
                }
            `}</style>
            {error ? (
                <div>Error: {error}</div>
            ) : invoiceData && (
                <div className="flex flex-row gap-y-12 gap-x-12">
                    <dialog id="my_modal_tolak" className="modal modal-bottom sm:modal-middle">
                        <div className="modal-box">
                            <h3 className="font-bold text-lg mb-5">Tolak</h3>
                            <label className="input input-bordered flex items-center gap-2">
                                <input required id="alasanPenolakan" type="text" className="grow" placeholder="Masukkan alasan penolakan" />
                            </label>
                            <div className="modal-action">
                                <button className="btn mr-2" onClick={() => document.getElementById('my_modal_tolak').close()}>Cancel</button>
                                <button className="btn btn-error" onClick={() => { handleKonfirmasi(false); document.getElementById('my_modal_tolak').close(); }}>Tolak</button>
                            </div>

                        </div>
                    </dialog>

                    <dialog id="my_modal_terima" className="modal modal-bottom sm:modal-middle">
                        <div className="modal-box">
                            <h3 className="font-bold text-lg">Terima</h3>
                            <p className="py-4">Apakah Anda yakin ingin menerima bukti pembayaran ini?</p>
                            <div className="modal-action">
                                <button className="btn mr-2" onClick={() => document.getElementById('my_modal_terima').close()}>Batal</button>
                                <button className="btn btn-success" onClick={() => { handleKonfirmasi(true); document.getElementById('my_modal_terima').close(); }}>Terima</button>
                            </div>

                        </div>
                    </dialog>

                    <div className="flex flex-col informasi-pembayaran justify-center items-center">
                        <div className="card w-1600 bg-base-100 shadow-md">

                            <div className="card-body ">
                                <h3 className="text-xl font-semibold mb-2 text-center">Jumlah yang harus dibayar</h3>
                                {isPelunasan ? (
                                    <h3 className="text-2xl font-bold mb-4 text-center text-primary">
                                        Rp{invoiceData['totalPelunasan'].toLocaleString('id-ID')}
                                    </h3>) : (
                                    <h3 className="text-2xl font-bold mb-4 text-center text-primary">
                                        Rp{invoiceData['totalDp'].toLocaleString('id-ID')}
                                    </h3>)}
                                <table className="table text-left" >

                                    <tbody>
                                        <tr>
                                            <td className="font-semibold">Nama rekening</td>
                                            <td>BCA a.n. Eni Yulianti</td>
                                        </tr>
                                        <tr>
                                            <td className="font-semibold">Nomor rekening</td>
                                            <td>1234567890</td>
                                        </tr>
                                        <tr>
                                            <td className="font-semibold">Status pembayaran</td>
                                            <td>
                                                {buktiData ? (
                                                    buktiData['status'] === 0 ? (
                                                        <div className="badge badge-warning">
                                                            Menunggu konfirmasi
                                                        </div>
                                                    ) : buktiData['status'] === 1 ? (
                                                        <div className="badge badge-success">
                                                            Disetujui
                                                        </div>
                                                    ) : buktiData['status'] === -1 ? (
                                                        <div className="badge badge-error">
                                                            Ditolak
                                                        </div>
                                                    ) : null
                                                ) : (
                                                    <div className="badge badge-info">
                                                        Belum dibayar
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                        {buktiData && buktiData['status'] === -1 && (
                                            <tr>
                                                <td className="font-semibold">Alasan penolakan</td>
                                                <td>{buktiData['alasanPenolakan']}</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col grow justify-center items-center bukti-pembayaran mb-4">
                        <div className="card w-96 bg-base-100 shadow-md">
                            <div className="card-body items-center text-center">
                                <h3 className="text-xl font-semibold mb-4">Konfirmasi bukti pembayaran</h3>
                                {imageUrl && (
                                    <div className="mt-4 mb-5">
                                        <div className="image-container">
                                            <img src={imageUrl} alt="Bukti Pembayaran" />
                                        </div>
                                    </div>
                                )}
                                {buktiData === null ? (
                                    <div className="flex flex-row w-full max-w-xs justify-center align-middle">
                                        <button
                                            className="btn btn-error btn-xs sm:btn-sm md:btn-md lg:btn-lg flex flex-grow mr-5"
                                            disabled
                                        >
                                            Tolak
                                        </button>
                                        <button
                                            className="btn btn-success btn-xs sm:btn-sm md:btn-md lg:btn-lg flex flex-grow"
                                            disabled
                                        >
                                            Terima
                                        </button>
                                    </div>
                                ) : buktiData['status'] !== 1 ? (
                                    <div className="flex flex-row w-full max-w-xs justify-center align-middle">
                                        <button
                                            className="btn btn-error btn-xs sm:btn-sm md:btn-md lg:btn-lg flex flex-grow mr-5"
                                            onClick={() => document.getElementById('my_modal_tolak').showModal()}
                                        >
                                            Tolak
                                        </button>
                                        <button
                                            className="btn btn-success btn-xs sm:btn-sm md:btn-md lg:btn-lg flex flex-grow"
                                            onClick={() => document.getElementById('my_modal_terima').showModal()}
                                        >
                                            Terima
                                        </button>
                                    </div>
                                ) : null}
                            </div>

                        </div>
                    </div>

                </div>
            )}
            <Footer />
        </main>
    );
}

export default KonfirmasiPembayaranPage;
