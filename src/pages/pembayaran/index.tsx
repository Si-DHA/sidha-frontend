import Footer from "@/app/components/common/footer";
import Navbar from "@/app/components/common/navbar";
import { viewBukti } from "../api/pembayaran/viewBukti";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Inter, Lato } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
const lato = Lato({
    subsets: ["latin"],
    weight: "100"
});

const PembayaranPage = () => {
    const router = useRouter();
    const [error, setError] = useState('');
    const [imageUrl, setImageUrl] = useState(null);
    const [alert, setAlert] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const blobData = await viewBukti("d53bf196-272d-473e-9a2a-b38031ba253a", false);
                const objectUrl = URL.createObjectURL(blobData);
                setImageUrl(objectUrl);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchData();
    }, []);

    return (
        <main className="flex min-h-screen flex-col items-center justify-between" data-theme="cmyk">
            <Navbar />

            <div className="flex flex-row">
                {alert}
            </div>
            <style jsx>{`
                .image-preview {
                    text-align: center;
                }

                .image-container {
                    padding-top:10px;
                    max-width: 200px; /* Adjust the maximum width as needed */
                    max-height: 300px; /* Adjust the maximum height as needed */
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
            ) : imageUrl && (
                <div className="flex flex-row gap-y-12 gap-x-12">
                    <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
                        <div className="modal-box">
                            <h3 className="font-bold text-lg">Delete</h3>
                            <p className="py-4">Are you sure you want to delete this?</p>
                            <div className="modal-action">
                                <button className="btn mr-2" onClick={() => document.getElementById('my_modal_5').close()}>Cancel</button>
                                <button className="btn btn-error">Delete</button>
                            </div>

                        </div>
                    </dialog>

                    <div className="flex flex-col informasi-pembayaran justify-center items-center">
                        <div className="card w-1600 bg-base-100 shadow-md">

                            <div className="card-body ">
                                <h3 className="text-xl font-semibold mb-2 text-center">Jumlah yang harus dibayar</h3>
                                <h3 className="text-2xl font-bold mb-4 text-center text-primary">Rp400.000</h3>
                                <table className="table text-left" >

                                    <tbody>
                                        <tr>
                                            <td className="font-semibold">Nomor rekening</td>
                                            <td>808080808080808080808</td>
                                        </tr>
                                        <tr>
                                            <td className="font-semibold">Status Pembayaran</td>
                                            <td>Belum dibayar</td>
                                        </tr>
                                        <tr>
                                            <td className="font-semibold">Bayar sebelum</td>
                                            <td>21-02-2024</td>
                                        </tr>
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
                                    <input type="file" accept="image/*" className="file-input file-input-bordered w-full max-w-xs" />
                                    <div className="label">
                                        <span className="label-text-alt">max. size: 10Mb</span>
                                        <span className="label-text-alt">.jpg/.jpeg/.png</span>
                                    </div>
                                </label>
                                {imageUrl && (
                                    <div className="image-preview mt-4 mb-5">
                                        <div className="image-container">
                                            <img src={imageUrl} alt="Preview" />
                                        </div>
                                    </div>
                                )}
                                <div className="flex flex-row w-full max-w-xs justify-center align-middle">
                                    <button className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg flex flex-grow" onClick={() => document.getElementById('my_modal_5').showModal()}>Upload </button>
                                </div>


                            </div>

                        </div>
                    </div>

                </div>
            )}
            <Footer />
        </main>
    );
}

export default PembayaranPage;
