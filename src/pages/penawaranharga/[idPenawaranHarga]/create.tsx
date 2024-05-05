import Footer from "@/app/components/common/footer";
import Navbar from "@/app/components/common/navbar";
import React, { ChangeEvent, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import SuccessAlert from "@/app/components/common/SuccessAlert";
import FailAlert from "@/app/components/common/FailAlert";
import indonesianCities from "@/app/components/common/data/indonesianCities.js";
import Cookies from "js-cookie";
import Drawer from "@/app/components/common/drawer";
import Select from 'react-select';

interface Client {
    id: string;
    penawaranHarga?: {
        idPenawaranHarga: string;
    };
}

interface FormData {
    idKlien: string;
    source: string;
    destination: string;
    cddPrice: string;
    cddLongPrice: string;
    wingboxPrice: string;
    fusoPrice: string;
}

const cityOptions = indonesianCities.map(city => ({ label: city, value: city }));

const CreatePenawaranHargaItemPage = () => {
    const router = useRouter();
    const { idPenawaranHarga } = router.query;
    const [formData, setFormData] = useState<FormData>({
        idKlien: '',
        source: '',
        destination: '',
        cddPrice: '',
        cddLongPrice: '',
        wingboxPrice: '',
        fusoPrice: '',
    });
    const [alert, setAlert] = useState<React.ReactNode>(null);

    var isLoggedIn = Cookies.get('isLoggedIn');
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/login');
        }
        const role = Cookies.get('role');
        setUserRole(role || '');
    },)


    useEffect(() => {
        if (typeof idPenawaranHarga === 'string') {
            fetch('/api/proxyKlien')
                .then(response => {
                    if (!response.ok) {
                        // If the response is not ok, throw an error to jump to the catch block
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.isSuccess && Array.isArray(data.content) && data.content.length > 0) {
                        // Find the client whose penawaranHarga id matches idPenawaranHarga from the URL
                        const matchingClient = data.content.find((client: Client) =>
                            client.penawaranHarga?.idPenawaranHarga === idPenawaranHarga
                        );

                        if (matchingClient) {
                            // Update the form state with the matching client's id
                            setFormData(prevState => ({
                                ...prevState,
                                idKlien: matchingClient.id,
                            }));
                        } else {
                            // Handle case where no matching client is found
                            console.error('No matching client found for the given idPenawaranHarga');
                        }
                    } else {
                        // Handle case where the response does not indicate success or contains no clients
                        console.error('Response unsuccessful or contains no clients');
                    }
                })
                .catch(error => {
                    console.error('Error fetching clients:', error);
                });
        }
    }, [idPenawaranHarga]);  

    const handleCityChange = (selectedOption, actionMeta) => {
        setFormData({ ...formData, [actionMeta.name]: selectedOption.value });
      };
      
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleBack = () => {
        router.push(`/penawaranharga/${idPenawaranHarga}`)
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const bodyData = JSON.stringify({
            ...formData,
            idPenawaranHarga: idPenawaranHarga, // Assure this value is correctly set
        });

        try {
            const response = await fetch('/api/createPenawaranHargaItem', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: bodyData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create Penawaran Harga Item');
            }

            // Redirect to the Penawaran Harga details page
            router.push(`/penawaranharga/${idPenawaranHarga}`);
            setAlert(<SuccessAlert message="Penawaran Harga Item is created successfully" />);

        } catch (error: any) {
            console.error('Error creating Penawaran Harga Item:', error);
            setAlert(<FailAlert message={error.message || 'Failed to create Penawaran Harga Item'} />);
        }
    };

    const handleClose = () => {
        router.back();
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Drawer userRole={userRole}>
                <main className="flex-grow container mx-auto p-4">
                    {alert}

                    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                        <h1 className="block text-gray-700 font-bold mb-2 text-xl mb-4">Tambah Rute</h1>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-semibold mb-2">
                                    Pilih Kota Asal
                                </label>
                                <Select
                                    name="source"
                                    options={cityOptions}
                                    onChange={handleCityChange}                                    className="basic-single"
                                    classNamePrefix="select"
                                    placeholder="Select Source City"
                                />

                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-semibold mb-2">
                                    Pilih Kota Tujuan
                                </label>
                                <Select
                                    name="destination"
                                    options={cityOptions}
                                    onChange={handleCityChange}
                                    className="basic-single"
                                    classNamePrefix="select"
                                    placeholder="Select Destination City"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label htmlFor="cddPrice" className="block text-gray-700 text-sm font-semibold mb-2">
                                        Harga CDD
                                    </label>
                                    <input
                                        id="cddPrice"
                                        name="cddPrice"
                                        type="number"
                                        min="0"
                                        value={formData.cddPrice}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-2 border border-gray-300 rounded"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="cddLongPrice" className="block text-gray-700 text-sm font-semibold mb-2">
                                        Harga CDD Long
                                    </label>
                                    <input
                                        id="cddLongPrice"
                                        name="cddLongPrice"
                                        type="number"
                                        min="0"
                                        value={formData.cddLongPrice}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-2 border border-gray-300 rounded"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div>
                                    <label htmlFor="wingboxPrice" className="block text-gray-700 text-sm font-semibold mb-2">
                                        Harga Wingbox
                                    </label>
                                    <input
                                        id="wingboxPrice"
                                        name="wingboxPrice"
                                        type="number"
                                        min="0"
                                        value={formData.wingboxPrice}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-2 border border-gray-300 rounded"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="fusoPrice" className="block text-gray-700 text-sm font-semibold mb-2">
                                        Harga Fuso
                                    </label>
                                    <input
                                        id="fusoPrice"
                                        name="fusoPrice"
                                        type="number"
                                        min="0"
                                        value={formData.fusoPrice}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-2 border border-gray-300 rounded"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-between items-center mt-6">
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    Kembali
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    Tambah Rute
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </Drawer>

            <Footer />
        </div>
    );
};

export default CreatePenawaranHargaItemPage;