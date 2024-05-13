import Footer from "@/app/components/common/footer";
import Drawer from "@/app/components/common/drawer";
import Cookies from "js-cookie";
import SuccessAlert from "@/app/components/common/SuccessAlert";
import FailAlert from "@/app/components/common/FailAlert";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { viewSopirNoTruk } from "../../api/truk/viewSopirNoTruk";
import { createTruk } from "../../api/truk/createTruk";

const CreateTrukPage = () => {
    const router = useRouter();
    const [error, setError] = useState('');
    const [sopirData, setSopirData] = useState([]); // State to hold truck data
    const [alert, setAlert] = useState(null);

    var isLoggedIn = Cookies.get('isLoggedIn');
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/login');
        }
        const role = Cookies.get('role');
        setUserRole(role || '');
        if (role !== 'ADMIN') {
            setError('Anda tidak diperbolehkan mengakses halaman ini');
        }

    }, [isLoggedIn, router])

    useEffect(() => {

        const fetchData = async () => {
            try {
                const sopirDataResponse = await viewSopirNoTruk();
                setSopirData(sopirDataResponse['content']);
            } catch (error: any) {
                setError(error.message);
            }
        };

        fetchData(); // Call fetchData function when component mounts
    }, []);

    // Function to handle the creation of a truck
    const handleCreate = async () => {
        try {
            // Capture values from inputs
            const licensePlate = document.getElementById('licensePlate').value;
            const merk = document.getElementById('merk').value;
            const type = document.getElementById('type').value;
            const stnkName = document.getElementById('stnkName').value;
            const expiredKir = document.getElementById('expiredKir').value;
            const panjangBox = document.getElementById('panjangBox').value;
            const lebarBox = document.getElementById('lebarBox').value;
            const tinggiBox = document.getElementById('tinggiBox').value;
            const kubikasiBox = document.getElementById('kubikasiBox').value;
            const idSopir = document.getElementById('idSopir').value;

            // Create POST request body
            const requestBody = {
                type,
                expiredKir,
                panjangBox: parseInt(panjangBox),
                lebarBox: parseInt(lebarBox),
                tinggiBox: parseInt(tinggiBox),
                kubikasiBox: parseInt(kubikasiBox),
            };

            // Add idSopir to requestBody if it's not null
            if (licensePlate !== '') {
                requestBody.licensePlate = licensePlate;
            }
            if (merk !== '') {
                requestBody.merk = merk;
            }
            if (stnkName !== '') {
                requestBody.stnkName = stnkName;
            }
            if (idSopir !== '0') {
                requestBody.idSopir = idSopir;
            }
            const trukDataResponse = await createTruk(requestBody);
            setAlert(<SuccessAlert message="Data truk berhasil ditambahkan" />);
            setTimeout(() => {
                router.push(`/truk`); // Redirect to /truk after 3000ms
            }, 3000);
        } catch (error) {
            setAlert(<FailAlert message={error.message || "Gagal menambah data truk"} />);
            setTimeout(() => {
                setAlert(null);
            }, 3000);
        }
    };

    return (
        <main
            className={`flex min-h-screen flex-col items-center justify-between`} data-theme="cmyk"
        >
            <Drawer userRole={userRole}>
                <div className="flex flex-row px-12 text-[12px]  sm:text-[16px]">
                    {alert}
                </div>
                {error ? (
                    <div className="mx-auto my-auto">Error: {error}</div>
                ) : (
                    <div className="flex flex-col lg:flex-row  justify-center items-center gap-x-16  gap-y-16 mx-auto my-auto px-12 py-12">
                        <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
                            <div className="modal-box">
                                <h3 className="font-bold text-lg">Tambah</h3>
                                <p className="py-4">Apakah Anda yakin data yang dimasukkan sudah benar?</p>
                                <div className="modal-action">
                                    <button className="btn mr-2" onClick={() => document.getElementById('my_modal_5').close()}>Batal</button>
                                    <button className="btn btn-success" onClick={() => { handleCreate(); document.getElementById('my_modal_5').close(); }}>Tambah</button>
                                </div>

                            </div>
                        </dialog>
                        <div className="flex flex-col grow justify-center align-center ">
                            <div className="card w-96 bg-base-100 shadow-md">
                                <div className="card-body">
                                    <h1 className="font-bold">Nomor Polisi</h1>
                                    <input required id="licensePlate" className="input input-bordered flex items-center gap-2 grow" type="text" placeholder="B 1234 ABC" />
                                    <h1 className="font-bold">Tipe Truk</h1>
                                    <select id="type" className="input input-bordered flex items-center gap-2 grow">
                                        <option value="CDD">CDD</option>
                                        <option value="CDL">CDL</option>
                                        <option value="Fuso">Fuso</option>
                                        <option value="Wingbox">Wingbox</option>
                                    </select>
                                    <h1 className="font-bold">Sopir</h1>
                                    <select id="idSopir" className="input input-bordered flex items-center gap-2 grow">
                                        <option value='0'>-</option>
                                        {sopirData.map((sopir) => (
                                            <option key={sopir['id']} value={sopir['id']}>{sopir['name']}</option>
                                        ))}
                                    </select>
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
                                                <td>Merk</td>
                                                <td><label className="input input-bordered flex items-center gap-2">
                                                    <input required id="merk" type="text" className="grow" placeholder="Mitsubishi Fe 75" />
                                                </label></td>
                                            </tr>
                                            <tr>
                                                <td>Kubikasi Box</td>
                                                <td><label className="input input-bordered flex items-center gap-2">
                                                    <input required id="kubikasiBox" type="number" className="grow" placeholder="20 (dalam meter kubik)" />
                                                </label></td>
                                            </tr>
                                            <tr>
                                                <td>Panjang Box</td>
                                                <td><label className="input input-bordered flex items-center gap-2">
                                                    <input required id="panjangBox" type="number" className="grow" placeholder="20 (dalam meter)" />
                                                </label></td>
                                            </tr>
                                            <tr>
                                                <td>Lebar Box</td>
                                                <td><label className="input input-bordered flex items-center gap-2">
                                                    <input required id="lebarBox" type="number" className="grow" placeholder="20 (dalam meter)" />
                                                </label></td>
                                            </tr>
                                            <tr>
                                                <td>Tinggi Box</td>
                                                <td><label className="input input-bordered flex items-center gap-2">
                                                    <input required id="tinggiBox" type="number" className="grow" placeholder="20 (dalam meter)" />
                                                </label></td>
                                            </tr>

                                        </tbody>
                                    </table>

                                    <h1 className="font-bold">Data Surat</h1>

                                    <table className="table text-left">

                                        <tbody>
                                            <tr>
                                                <td>Masa Berlaku KIR</td>
                                                <td><label className="input input-bordered flex items-center gap-2">
                                                    <input required id="expiredKir" type="date" className="grow" placeholder="" />
                                                </label></td>
                                            </tr>
                                            <tr>
                                                <td>Nama di STNK</td>
                                                <td><label className="input input-bordered flex items-center gap-2">
                                                    <input required id="stnkName" type="text" className="grow" placeholder="John Doe" />
                                                </label></td>
                                            </tr>

                                        </tbody>

                                    </table>
                                    <div className="flex flex-row justify-center align-middle">
                                        <button onClick={() => document.getElementById('my_modal_5').showModal()}
                                            className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg flex flex-grow" type="submit">Tambah</button>
                                    </div>


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

export default CreateTrukPage;