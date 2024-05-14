import Cookies from "js-cookie";
import SuccessAlert from "@/app/components/common/SuccessAlert";
import FailAlert from "@/app/components/common/FailAlert";
import { BASE_URL } from '@/app/constant/constant';
import { getImageBongkar } from '@/pages/api/order/getImageBongkar';
import { deleteImageBongkar } from '@/pages/api/order/deleteImageBongkar';
import { viewOrderItemById } from '@/pages/api/order/viewOrderItemById';
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Drawer from "@/app/components/common/drawer";

const BuktiBongkarPage = () => {
    const router = useRouter();
    const { id: idOrderItem } = router.query;
    const [error, setError] = useState('');
    const [alert, setAlert] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [orderItemData, setOrderItemData] = useState(null);
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
        if (role !== 'SOPIR') {
            setError('Anda tidak diperbolehkan mengakses halaman ini');
        }

    }, [isLoggedIn, router])

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!idOrderItem) {
                    throw new Error('Order item ID is missing');
                }
                const imageDataResponse = await getImageBongkar(idOrderItem);
                const objectUrl = URL.createObjectURL(imageDataResponse);
                setImageUrl(objectUrl);
                const orderItemDataResponse = await viewOrderItemById(idOrderItem);
                setOrderItemData(orderItemDataResponse['content']);
                setBuktiData(orderItemDataResponse['content']['buktiBongkar']);
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
            await deleteImageBongkar(idOrderItem);
            setAlert(<SuccessAlert message="Bukti bongkar berhasil dihapus" />);
            setTimeout(() => {
                window.location.reload();
            }, 3000);
        } catch (error) {
            setAlert(<FailAlert message={error.message || "Gagal menghapus bukti bongkar"} />);
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

            const response = await fetch(BASE_URL + '/order/upload-bukti-bongkar', {
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
            <Drawer userRole={userRole}>
                <div className="flex flex-row px-12 text-[12px]  sm:text-[16px]">
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
            `}</style>
                {error ? (
                    <div className="mx-auto my-auto">Error: {error}</div>
                ) : orderItemData && (
                    <div className="flex flex-col lg:flex-row  justify-center items-center gap-x-16  gap-y-16 mx-auto my-auto px-12 py-12">
                        <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
                            <div className="modal-box">
                                <h3 className="font-bold text-lg">Unggah</h3>
                                <p className="py-4">Apakah Anda yakin akan mengunggah ini?</p>
                                <div className="modal-action">
                                    <button className="btn mr-2" onClick={() => document.getElementById('my_modal_5').close()}>Batal</button>
                                    <button className="btn btn-success" onClick={() => { uploadBuktiImage(); document.getElementById('my_modal_5').close(); }}>Unggah</button>
                                </div>
                            </div>
                        </dialog>
                        <dialog id="my_modal_6" className="modal modal-bottom sm:modal-middle">
                            <div className="modal-box">
                                <h3 className="font-bold text-lg">Hapus</h3>
                                <p className="py-4">Apakah Anda yaking akan menghapus ini?</p>
                                <div className="modal-action">
                                    <button className="btn mr-2" onClick={() => document.getElementById('my_modal_6').close()}>Batal</button>
                                    <button className="btn btn-success" onClick={() => { handleDelete(); document.getElementById('my_modal_6').close(); }}>Hapus</button>
                                </div>
                            </div>
                        </dialog>
                        <div className="card w-96 bg-base-100 shadow-md">
                            <div className="card-body items-center text-center">
                                <h3 className="text-xl font-semibold mb-4">Unggah Bukti Bongkar</h3>

                                <label className="form-control w-full max-w-xs">
                                    <input
                                        disabled={orderItemData.statusOrder < 3 || orderItemData.statusOrder > 4}
                                        id="buktiImage" type="file" accept="image/*" className="file-input file-input-bordered w-full max-w-xs" onChange={handleFileChange} />
                                    <div className="label">
                                        <span className="label-text-alt">max. size: 10Mb</span>
                                        <span className="label-text-alt">.jpg/.jpeg/.png</span>
                                    </div>
                                </label>
                                {imageUrl && (
                                    <div className="mt-4 mb-5">
                                        <div className="image-container">
                                            <img src={imageUrl} alt="Bukti Bongkar" />
                                        </div>
                                    </div>
                                )}
                                <div className="flex flex-row w-full max-w-xs justify-center align-middle">
                                    <button
                                        disabled={orderItemData.statusOrder < 3 || orderItemData.statusOrder > 4}
                                        className="btn btn-xs btn-primary sm:btn-sm md:btn-md lg:btn-lg flex flex-grow" onClick={() => document.getElementById('my_modal_5').showModal()}>Unggah </button>
                                </div>
                                <div className="flex flex-row w-full max-w-xs justify-center align-middle">
                                    <button
                                        disabled={orderItemData.statusOrder < 3 || orderItemData.statusOrder > 4}
                                        className="btn btn-xs btn-error sm:btn-sm md:btn-md lg:btn-lg flex flex-grow" onClick={() => document.getElementById('my_modal_6').showModal()}>Hapus </button>
                                </div>
                                <div className="flex flex-row w-full max-w-xs justify-center align-middle">
                                    <button
                                        onClick={() => router.push(`/order/sopir`)}
                                        className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg flex flex-grow"
                                    >
                                        Kembali
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Drawer>
        </main>
    );
}

export default BuktiBongkarPage;