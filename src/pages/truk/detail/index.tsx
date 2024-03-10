import Footer from "@/app/components/common/footer";
import Navbar from "@/app/components/common/navbar";
import SuccessAlert from "@/app/components/common/SuccessAlert";
import FailAlert from "@/app/components/common/FailAlert";
import { viewTrukById } from "../../api/truk/viewTruk";
import { deleteTrukById } from "../../api/truk/deleteTruk";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

const TrukDetailPage = () => {
    const queryParameters = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const router = useRouter();
    const id = queryParameters?.get("id");
    const [error, setError] = useState('');
    const [trukData, setTrukData] = useState(null); // State to hold truck data
    const [alert, setAlert] = useState(null);

    useEffect(() => {

        const fetchData = async () => {
            try {
                const trukDataResponse = await viewTrukById(id);
                setTrukData(trukDataResponse['content']);
            } catch (error: any) {
                setError(error.message);
            }
        };

        fetchData(); // Call fetchData function when component mounts
    }, []);

    const handleDelete = async (id: any) => {
        try {
            const trukDataResponse = await deleteTrukById(id+'1');
            console.log("truk deleted");
            setAlert(<SuccessAlert message="Truck is deleted successfully"/>);
            setTimeout(() => {
                router.push(`/truk`); // Redirect to /truk after 3000ms
            }, 3000);
        } catch (error: any) {
            setAlert(<FailAlert message="Error deleting the truck data" />);
            setTimeout(() => {
                setAlert(null);
            }, 3000);
        }
    };
    const handleUpdate = (id: any) => {
        console.log("update " + id)
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-between" data-theme="winter">
            <Navbar />
            <div className="flex flex-row">
                {alert}
            </div>
            {error ? (
                <div>Error: {error}</div>
            ) : trukData === null ? (
                <p>Loading..</p>
            ) : (
                <div className="flex flex-row gap-y-12 gap-x-12">
                    {/* <button className="btn" onClick={() => document.getElementById('my_modal_5').showModal()}>open modal</button> */}
                    <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
                        <div className="modal-box">
                            <h3 className="font-bold text-lg">Delete</h3>
                            <p className="py-4">Are you sure you want to delete this truck data?</p>
                            <div className="modal-action">
                                <button className="btn mr-2" onClick={() => document.getElementById('my_modal_5').close()}>Close</button>
                                <button className="btn btn-error" onClick={() => handleDelete(id)}>Delete</button>
                            </div>

                        </div>
                    </dialog>

                    <div className="flex flex-col grow justify-center align-center ">
                        <div className="card w-96 bg-base-100 shadow-md">
                            <div className="card-body items-center text-center">
                                <h2 style={{ marginBottom: '15px' }} className="card-title">{trukData['licensePlate']} </h2>
                                <div className="flex flex-col justify-center gap-y-4">
                                    <div className="flex justify-center gap-x-4">
                                        <div className="card-actions" text-xs>
                                            <button className="btn btn-sm text-xs" onClick={() => handleUpdate(trukData['idTruk'])}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                                </svg>
                                                Edit Truck
                                            </button>
                                        </div>
                                        <div className="card-actions" text-xs>
                                            <button className="btn btn-sm text-xs"
                                                onClick={() => document.getElementById('my_modal_5').showModal()}>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                                    <path fillRule="evenodd" d="M15 5a2 2 0 00-2-2h-4a2 2 0 00-2 2V7H5a1 1 0 100 2h1v8a2 2 0 002 2h6a2 2 0 002-2V9h1a1 1 0 100-2h-2V5zm-5 0a1 1 0 011-1h2a1 1 0 011 1v1h-4V5zm4 3H6v8h8V8z" clipRule="evenodd" />
                                                </svg>
                                                Delete Truck
                                            </button>
                                        </div>
                                    </div>
                                </div>


                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <div className="card w-1600 bg-base-100 shadow-md">

                            <div className="card-body ">
                                <h1 className="font-bold">Data Truk</h1>
                                <table className="table text-left" >

                                    <tbody>
                                        <tr>
                                            <td>ID</td>
                                            <td>{trukData['idTruk']}</td>
                                        </tr>
                                        <tr>
                                            <td>Tipe</td>
                                            <td>{trukData['type']}</td>
                                        </tr>
                                        <tr>
                                            <td>Merk</td>
                                            <td>{trukData['merk']}</td>
                                        </tr>
                                        <tr>
                                            <td>Kubikasi Box</td>
                                            <td>{trukData['kubikasiBox']}</td>
                                        </tr>
                                        <tr>
                                            <td>Ukuran Box</td>
                                            <td>{trukData['panjangBox']} x {trukData['lebarBox']} x {trukData['tinggiBox']}</td>
                                        </tr>
                                    </tbody>
                                </table>

                                <h1 className="font-bold">Data Surat</h1>

                                <table className="table text-left">

                                    <tbody>
                                        <tr>
                                            <td>Masa Berlaku KIR</td>
                                            <td>{trukData['expiredKir']}</td>
                                        </tr>
                                        <tr>
                                            <td>Nama di STNK</td>
                                            <td>{trukData['stnkName']}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>


            )}

            <Footer />
        </main>
    )
}

export default TrukDetailPage