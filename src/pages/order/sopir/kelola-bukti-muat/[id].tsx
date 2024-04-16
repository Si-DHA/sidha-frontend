import Footer from "@/app/components/common/footer";
import Navbar from "@/app/components/common/navbar";
import SuccessAlert from "@/app/components/common/SuccessAlert";
import FailAlert from "@/app/components/common/FailAlert";
import { BASE_URL } from '@/app/constant/constant';
import { getImageMuat } from '@/pages/api/order/getImageMuat';
import { deleteImageMuat } from '@/pages/api/order/deleteImageMuat';
import { viewOrderItemById } from '@/pages/api/order/viewOrderItemById';
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

const BuktiMuatPage = () => {
    const router = useRouter();
    const { id: idOrderItem } = router.query;
    const [error, setError] = useState('');
    const [alert, setAlert] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [orderItemData, setOrderItemData] = useState(null);
    const [buktiData, setBuktiData] = useState(null);
    const [imageUploaded, setImageUploaded] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!idOrderItem) {
                    throw new Error('Order item ID is missing');
                }
                const imageDataResponse = await getImageMuat(idOrderItem);
                const objectUrl = URL.createObjectURL(imageDataResponse);
                setImageUrl(objectUrl);
                const orderItemDataResponse = await viewOrderItemById(idOrderItem);
                setOrderItemData(orderItemDataResponse['content']);
                setBuktiData(orderItemDataResponse['content']['buktiMuat']);
            } catch (error: any) {
                setError(error.message || 'An error occurred');
            }
        };

        if (idOrderItem) {
            fetchData();
        }
    }, [idOrderItem]);

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

    const handleDelete = async () => {
        try {
            await deleteImageMuat(idOrderItem);
            setAlert(<SuccessAlert message="Bukti muat berhasil dihapus" />);
            setTimeout(() => {
                window.location.reload();
            }, 3000);
        } catch (error) {
            setAlert(<FailAlert message={error.message || "Gagal menghapus bukti muat"} />);
            setTimeout(() => {
                setAlert(null);
            }, 3000);
        }
    };

    const uploadBuktiImage = async () => {
        try {
            if (!imageUploaded) {
                throw new Error("Tidak ada file yang dipilih");
            }

            const formData = new FormData();
            formData.append('idOrderItem', idOrderItem);
            formData.append('imageFile', imageUploaded);

            const response = await fetch(BASE_URL + '/order/upload-bukti-muat', {
                method: 'POST',
                body: formData,
            });

            const responseData = await response.json(); // Assuming response is JSON

            if (response.ok) {
                setAlert(<SuccessAlert message="Bukti berhasil diunggah" />);
                setTimeout(() => {
                    window.location.reload();
                }, 3000);

            } else {
                throw new Error(responseData.message);
            }
        } catch (error) {
            setAlert(<FailAlert message={error.message || "Gagal mengunggah bukti"} />);
            setTimeout(() => {
                setAlert(null);
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

                .btn {
                    padding: 5px 10px;
                }

                .btn-danger {
                    background-color: red;
                    color: white;
                }
                .btn-primary {
                    color: white;
                }
            `}</style>
            {error ? (
                <div>Error: {error}</div>
            ) : orderItemData && (
                <div className="flex flex-row gap-y-12 gap-x-12">
                    <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
                        <div className="modal-box">
                            <h3 className="font-bold text-lg">Upload</h3>
                            <p className="py-4">Are you sure you want to upload this?</p>
                            <div className="modal-action">
                                <button className="btn mr-2" onClick={() => document.getElementById('my_modal_5').close()}>Cancel</button>
                                <button className="btn btn-success" onClick={() => { uploadBuktiImage(); document.getElementById('my_modal_5').close(); }}>Upload</button>
                            </div>

                        </div>
                    </dialog>
                    <dialog id="my_modal_6" className="modal modal-bottom sm:modal-middle">
                        <div className="modal-box">
                            <h3 className="font-bold text-lg">Delete</h3>
                            <p className="py-4">Are you sure you want to delete this?</p>
                            <div className="modal-action">
                                <button className="btn mr-2" onClick={() => document.getElementById('my_modal_6').close()}>Cancel</button>
                                <button className="btn btn-success" onClick={() => { handleDelete(); document.getElementById('my_modal_6').close(); }}>Delete</button>
                            </div>
                        </div>
                    </dialog>
                    <div className="card w-96 bg-base-100 shadow-md">
                        <div className="card-body items-center text-center">
                            <h3 className="text-xl font-semibold mb-4">Unggah Bukti Muat</h3>

                            <label className="form-control w-full max-w-xs">
                                <input id="buktiImage" type="file" accept="image/*" className="file-input file-input-bordered w-full max-w-xs" onChange={handleFileChange} />
                                <div className="label">
                                    <span className="label-text-alt">max. size: 10Mb</span>
                                    <span className="label-text-alt">.jpg/.jpeg/.png</span>
                                </div>
                            </label>
                            {imageUrl && (
                                <div className="mt-4 mb-5">
                                    <div className="image-container">
                                        <img src={imageUrl} alt="Bukti Muat" />
                                    </div>
                                </div>
                            )}
                            <div className="flex flex-row w-full max-w-xs justify-center align-middle">
                                <button className="btn btn-xs btn-primary sm:btn-sm md:btn-md lg:btn-lg flex flex-grow" onClick={() => document.getElementById('my_modal_5').showModal()}>Upload </button>
                            </div>
                            <div className="flex flex-row w-full max-w-xs justify-center align-middle">
                                <button className="btn btn-xs btn-danger sm:btn-sm md:btn-md lg:btn-lg flex flex-grow" onClick={() => document.getElementById('my_modal_6').showModal()}>Delete </button>
                            </div>
                            <div className="flex flex-row w-full max-w-xs justify-center align-middle">
                                <button
                                    onClick={() => router.push(`/order/sopir`)}
                                    className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg flex flex-grow"
                                >
                                    Back
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <Footer />
        </main>
    );
}

export default BuktiMuatPage;