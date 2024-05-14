import Footer from "@/app/components/common/footer";
import Drawer from "@/app/components/common/drawer";
import Cookies from "js-cookie";
import SuccessAlert from "@/app/components/common/SuccessAlert";
import FailAlert from "@/app/components/common/FailAlert";
import { BASE_URL } from '@/app/constant/constant';
import { viewBuktiImage } from "../api/pembayaran/viewBuktiImage";
import { viewInvoiceById } from "../api/invoice/viewInvoiceById";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

const PembayaranPage = () => {
    const queryParameters = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const idInvoice = queryParameters?.get("id");
    const isPelunasan = queryParameters?.get("isPelunasan") === "true";
    const router = useRouter();
    const [error, setError] = useState('');
    const [alert, setAlert] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [invoiceData, setInvoiceData] = useState(null);
    const [buktiData, setBuktiData] = useState(null);
    const [imageUploaded, setImageUploaded] = useState(null);

    var isLoggedIn = Cookies.get('isLoggedIn');
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/login');
        }
        const role = Cookies.get('role');
        setUserRole(role || '');
        if (role !== 'KLIEN') {
            setError('You are not allowed to access this page');
        }

    }, [isLoggedIn, router])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const imageDataResponse = await viewBuktiImage(idInvoice, isPelunasan);
                const objectUrl = URL.createObjectURL(imageDataResponse);
                setImageUrl(objectUrl);

                const invoiceDataResponse = await viewInvoiceById(idInvoice);
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

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageUrl(reader.result);
            };
            reader.readAsDataURL(file);
            setImageUploaded(file);
        }
    };

    const uploadBuktiImage = async () => {
        try {
            if (!imageUploaded) {
                throw new Error("Tidak ada file yang dipilih");
            }

            const formData = new FormData();
            formData.append('idInvoice', idInvoice);
            formData.append('isPelunasan', isPelunasan);
            formData.append('imageFile', imageUploaded);

            const response = await fetch(BASE_URL + '/invoice/upload-bukti', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                setAlert(<SuccessAlert message="Bukti pembayaran berhasil diunggah" />);
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            setAlert(<FailAlert message={error.message || "Gagal mengunggah bukti pembayaran"} />);
            setTimeout(() => {
                setAlert(null);
            }, 3000);
        }
    };


    return (
        <main className="flex min-h-screen flex-col items-center justify-between" data-theme="cmyk">
            <Drawer userRole={userRole}>
                <div className="flex flex-row px-12 text-[12px]  sm:text-[16px]">
                    {alert}
                </div>
                {error ? (
                    <div className="mx-auto my-auto">Error: {error}</div>
                ) : invoiceData === null ? (
                    <div className="mx-auto my-auto">Loading..</div>
                ) : invoiceData && (
                    <div className="flex flex-col lg:flex-row  justify-center items-center gap-x-16  gap-y-16 mx-auto my-auto px-12 py-12">
                        <style jsx>{`
                            .image-container {
                                padding-top:10px;
                                width: 100%;
                                max-width: 200px;
                                max-height: 300px; /* Set a fixed height */
                                overflow: auto; /* Enable scrolling if the image exceeds container height */
                                margin: 0 auto;
                            }
                        
                            .image-container img {
                                max-width: 100%; /* Ensure the image doesn't exceed container width */
                                max-height: 100%; /* Ensure the image doesn't exceed container height */
                                display: block; /* Ensure the image stays within its container */
                                margin: auto; /* Center the image horizontally */
                            }
                        `}</style>

                        <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
                            <div className="modal-box">
                                <h3 className="font-bold text-lg">Unggah</h3>
                                <p className="py-4">Apakah Anda yakin ingin mengunggah ini?</p>
                                <div className="modal-action">
                                    <button className="btn mr-2" onClick={() => document.getElementById('my_modal_5').close()}>Batal</button>
                                    <button className="btn btn-success" onClick={() => { uploadBuktiImage(); document.getElementById('my_modal_5').close(); }}>Unggah</button>
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
                                    <h3 className="text-xl font-semibold mb-4">Unggah bukti pembayaran</h3>

                                    <label className="form-control w-full max-w-xs">
                                        <input id="buktiImage" type="file" accept="image/*" className="file-input file-input-bordered w-full max-w-xs" onChange={handleFileChange}
                                            disabled={buktiData && buktiData['status'] === 1}
                                        />
                                        <div className="label">
                                            <span className="label-text-alt">max. size: 10Mb</span>
                                            <span className="label-text-alt">.jpg/.jpeg/.png</span>
                                        </div>
                                    </label>
                                    {imageUrl && (
                                        <div className="mt-4 mb-5">
                                            <div className="image-container">
                                                <img src={imageUrl} alt="Bukti Pembayaran" />
                                            </div>
                                        </div>
                                    )}
                                    {(!buktiData || buktiData['status'] !== 1) && (
                                        <div className="flex flex-row w-full max-w-xs justify-center align-middle">
                                            <button className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg flex flex-grow" onClick={() => document.getElementById('my_modal_5').showModal()}>Unggah </button>
                                        </div>
                                    )}
                                </div>

                            </div>
                        </div>
                    </div>
                )}
            </Drawer>

            <Footer />
        </main>
    );
}

export default PembayaranPage;
