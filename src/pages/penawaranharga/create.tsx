import React, { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '@/app/components/common/navbar';
import Footer from '@/app/components/common/footer';
import createPenawaranHarga from '../api/createPenawaranHarga';

interface Klien {
    id: string;
    name: string;
}

const CreatePenawaranHarga = () => {
    const [kliens, setKliens] = useState<Klien[]>([]);
    const [formData, setFormData] = useState({
        klienId: '',
        source: '',
        destination: '',
        cddPrice: '',
        cddLongPrice: '',
        wingboxPrice: '',
        fusoPrice: '',
    });
    const router = useRouter();

    useEffect(() => {
        fetch('/api/proxyKlien')
            .then((response) => response.json())
            .then((data) => {
                setKliens(data.content);
            })
            .catch((error) => console.error('Error fetching clients:', error));
    }, []);
    

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    // const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    //     e.preventDefault();

    //     const payload = {
    //         penawaranHarga: {
    //             idKlien: formData.klienId,
    //         },
    //         items: [{
    //             source: formData.source,
    //             destination: formData.destination,
    //             cddPrice: parseFloat(formData.cddPrice),
    //             cddLongPrice: parseFloat(formData.cddLongPrice),
    //             wingboxPrice: parseFloat(formData.wingboxPrice),
    //             fusoPrice: parseFloat(formData.fusoPrice),
    //         }]
    //     };

    //     try {
    //         const response = await fetch('/api/createPenawaranHarga', {
    //             method: 'POST',
    //             headers: {
    //               'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify(payload),
    //         });

    //         if (!response.ok) throw new Error('Failed to create Penawaran Harga');

    //         const newItem = await response.json();
    //         console.log('Penawaran Harga and Items created:', newItem);
    //         router.push('/penawaranharga');
    //     } catch (error) {
    //         alert(error instanceof Error ? error.message : 'An unexpected error occurred');
    //     }
    // };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const payload = {
                   penawaranHarga: {
                        idKlien: formData.klienId,
                    },
                    items: [{
                        source: formData.source,
                        destination: formData.destination,
                        cddPrice: parseFloat(formData.cddPrice),
                        cddLongPrice: parseFloat(formData.cddLongPrice),
                        wingboxPrice: parseFloat(formData.wingboxPrice),
                        fusoPrice: parseFloat(formData.fusoPrice),
                    }]
                };

        try {
            // Membuat Penawaran Harga
            // console.log(payload);
            const penawaranHargaResponse = await createPenawaranHarga(payload);

            if (!penawaranHargaResponse.ok) throw new Error('Failed to create Penawaran Harga');

            const { id: penawaranHargaId } = await penawaranHargaResponse.json();

            // Membuat Penawaran Harga Item dengan ID Penawaran Harga
            const penawaranHargaItemResponse = await fetch('/api/createPenawaranHargaItem', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idPenawaranHarga: penawaranHargaId,
                    // Data Penawaran Harga Item
                }),
            });

            if (!penawaranHargaItemResponse.ok) throw new Error('Failed to create Penawaran Harga Item');

            alert('Penawaran Harga and Items created successfully');
            router.push('/penawaranharga'); // Asumsikan ini adalah path yang benar
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
                            value={formData.klienId}
                            onChange={handleChange}
                            name="klienId"
                            required
                        >
                            <option value="">Select a client</option>
                            {kliens.map((klien) => (
                                <option key={klien.id} value={klien.id}>
                                    {klien.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="source" className="block text-sm font-medium mb-1">Pilih Kota Asal</label>
                        <input
                            id="source"
                            name="source"
                            type="text"
                            className="form-input block w-full"
                            value={formData.source}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="destination" className="block text-sm font-medium mb-1">Pilih Kota Tujuan</label>
                        <input
                            id="destination"
                            name="destination"
                            type="text"
                            className="form-input block w-full"
                            value={formData.destination}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="mb-4 col-span-1">
                            <label htmlFor="cddPrice" className="block text-sm font-medium mb-1">Harga CDD</label>
                            <input
                                id="cddPrice"
                                name="cddPrice"
                                type="number"
                                className="form-input block w-full"
                                value={formData.cddPrice}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-4 col-span-1">
                            <label htmlFor="cddLongPrice" className="block text-sm font-medium mb-1">Harga CDD Long</label>
                            <input
                                id="cddLongPrice"
                                name="cddLongPrice"
                                type="number"
                                className="form-input block w-full"
                                value={formData.cddLongPrice}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-4 col-span-1">
                            <label htmlFor="wingboxPrice" className="block text-sm font-medium mb-1">Harga Wingbox</label>
                            <input
                                id="wingboxPrice"
                                name="wingboxPrice"
                                type="number"
                                className="form-input block w-full"
                                value={formData.wingboxPrice}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-4 col-span-1">
                            <label htmlFor="fusoPrice" className="block text-sm font-medium mb-1">Harga Fuso</label>
                            <input
                                id="fusoPrice"
                                name="fusoPrice"
                                type="number"
                                className="form-input block w-full"
                                value={formData.fusoPrice}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    
                    <div className="flex justify-end mt-6">
                        <button type="button" className="btn mr-2" onClick={() => router.back()}>
                            Kembali
                        </button>
                        <button type="submit" className="btn btn-primary">
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
