import React, { FormEvent, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '@/app/components/common/navbar';
import Footer from '@/app/components/common/footer';

const CreatePenawaranHarga = () => {
    const [klienId, setKlienId] = useState('');
    const [source, setSource] = useState('');
    const [destination, setDestination] = useState('');
    const [cddPrice, setCddPrice] = useState('');
    const [cddLongPrice, setCddLongPrice] = useState('');
    const [wingboxPrice, setWingboxPrice] = useState('');
    const [fusoPrice, setFusoPrice] = useState('');

    const router = useRouter();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/createpenawaranharga', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    klienId,
                    routes: [
                        {
                            source,
                            destination,
                            cddPrice,
                            cddLongPrice,
                            wingboxPrice,
                            fusoPrice,
                        },
                    ],
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create Penawaran Harga');
            }

            router.push('/penawaranharga');
        } catch (error) {
            alert(error instanceof Error ? error.message : 'An unexpected error occurred');
        }
    };

    return (
        <div>
            <Navbar />
            <main className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-5">Tambah Harga Penawaran</h1>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Nama Perusahaan Klien</label>
                        <select
                            className="form-select block w-full"
                            value={klienId}
                            onChange={(e) => setKlienId(e.target.value)}
                            required
                        >
                            <option value="">Select a client</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="mb-4">
                            <label htmlFor="source" className="block text-sm font-medium mb-1">Pilih Kota Asal</label>
                            <input
                                id="source"
                                type="text"
                                className="form-input block w-full"
                                value={source}
                                onChange={(e) => setSource(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="destination" className="block text-sm font-medium mb-1">Pilih Kota Tujuan</label>
                            <input
                                id="destination"
                                type="text"
                                className="form-input block w-full"
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="cddPrice" className="block text-sm font-medium mb-1">Harga CDD</label>
                            <input
                                id="cddPrice"
                                type="text"
                                className="form-input block w-full"
                                value={cddPrice}
                                onChange={(e) => setCddPrice(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="cddLongPrice" className="block text-sm font-medium mb-1">Harga CDD Long</label>
                            <input
                                id="cddLongPrice"
                                type="text"
                                className="form-input block w-full"
                                value={cddLongPrice}
                                onChange={(e) => setCddLongPrice(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="wingboxPrice" className="block text-sm font-medium mb-1">Harga Wingbox</label>
                            <input
                                id="wingboxPrice"
                                type="text"
                                className="form-input block w-full"
                                value={wingboxPrice}
                                onChange={(e) => setWingboxPrice(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="fusoPrice" className="block text-sm font-medium mb-1">Harga Fuso</label>
                            <input
                                id="fusoPrice"
                                type="text"
                                className="form-input block w-full"
                                value={fusoPrice}
                                onChange={(e) => setFusoPrice(e.target.value)}
                                required
                            />
                        </div>

                    </div>
                    <div className="flex justify-end mt-6">
                        <button
                            type="button"
                            className="btn mr-2"
                            onClick={() => router.back()}
                        >
                            Kembali
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                        >
                            Tambah Penawaran
                        </button>
                    </div>
                </form>
            </main>
            <Footer />
        </div>
    );
};

export default CreatePenawaranHarga;
