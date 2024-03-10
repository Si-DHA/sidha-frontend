
import React, { ChangeEvent, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Modal from '@/app/components/common/modal';


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

    useEffect(() => {
        // Ensure idPenawaranHarga is not an array or undefined before making the fetch call
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
                    // Handle any errors that occur during the fetch call
                    console.error('Error fetching clients:', error);
                });
        }
    }, [idPenawaranHarga]); // This will re-run when idPenawaranHarga changes      

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
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
        } catch (error) {
            console.error('Error creating Penawaran Harga Item:', error);
            // Implement appropriate error handling here
        }
    };

    const handleClose = () => {
        router.back();
    };

    return (
        <Modal onClose={handleClose}>
            <div className="flex flex-col justify-center items-center p-4">
    <div className="card max-w-md bg-base-50 shadow-xl">
            
                    <form onSubmit={handleSubmit} className="card-body">
                        <input type="hidden" name="idKlien" value={formData.idKlien} />
                        <div className="form-control">
                            <label htmlFor="source" className="label">
                                <span className="label-text">Source:</span>
                            </label>
                            <input id="source" name="source" value={formData.source} onChange={handleChange} required className="input input-bordered" />
                        </div>
                        <div className="form-control">
                            <label htmlFor="destination" className="label">
                                <span className="label-text">Destination:</span>
                            </label>
                            <input id="destination" name="destination" value={formData.destination} onChange={handleChange} required className="input input-bordered" />
                        </div>

                        <div className="form-control">
                            <label htmlFor="cddPrice" className="label">
                                <span className="label-text">Harga CDD:</span>
                            </label>
                            <input id="cddPrice" name="cddPrice" value={formData.cddPrice} onChange={handleChange} required className="input input-bordered" />
                        </div>

                        <div className="form-control">
                            <label htmlFor="cddLongPrice" className="label">
                                <span className="label-text">Harga CDD Long:</span>
                            </label>
                            <input id="cddLongPrice" name="cddLongPrice" value={formData.cddLongPrice} onChange={handleChange} required className="input input-bordered" />
                        </div>

                        <div className="form-control">
                            <label htmlFor="wingboxPrice" className="label">
                                <span className="label-text">Harga Wingbox:</span>
                            </label>
                            <input id="wingboxPrice" name="wingboxPrice" value={formData.wingboxPrice} onChange={handleChange} required className="input input-bordered" />
                        </div>

                        <div className="form-control">
                            <label htmlFor="fusoPrice" className="label">
                                <span className="label-text">Harga Fuso:</span>
                            </label>
                            <input id="fusoPrice" name="fusoPrice" value={formData.fusoPrice} onChange={handleChange} required className="input input-bordered" />
                        </div>


                        {/* Submit and Close buttons */}
                        <div className="form-control mt-4">
                            <button type="submit" className="btn btn-primary">Simpan</button>
                            <button type="button" onClick={handleClose} className="btn btn-ghost ml-2">Close</button>
                        </div>
                    </form>
                </div>
            </div>
        </Modal>
    );
};

export default CreatePenawaranHargaItemPage;