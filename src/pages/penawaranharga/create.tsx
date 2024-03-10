import React, { useState, useEffect } from 'react';
import createPenawaranHarga from '../api/createPenawaranHarga';
import Modal from '@/app/components/common/modal';
import Navbar from '@/app/components/common/navbar';
import Footer from '@/app/components/common/footer';
import { useRouter } from 'next/router';

interface Klien {
    id: string;
    name: string;
}

interface FormData {
    klienId: string;

}

const CreatePenawaranHarga = () => {
    const [kliens, setKliens] = useState<Klien[]>([]);
    const [formData, setFormData] = useState<FormData>({
        klienId: '',
    });

    const router = useRouter();

    useEffect(() => {
        fetch('/api/proxyKlien')
            .then((response) => response.json())
            .then((data) => setKliens(data.content))
            .catch((error) => console.error('Error fetching clients:', error));
    }, []);

    const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        setFormData({ ...formData, klienId: value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const payload = {
            idKlien: formData.klienId,
        };
  
        try {
            const response = await fetch('/api/createPenawaranHarga', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const responseData = await response.json();
                const idPenawaranHarga = responseData.idPenawaranHarga; 
                alert('Penawaran Harga created successfully');
                router.push(`/penawaranharga/${idPenawaranHarga}/create`); // Use the ID to redirect
            } else {
                const error = await response.json();
                alert(`Error: ${error.message}`);
            }
        } catch (error) {
            alert('An error occurred while submitting the form');
            console.error('Submit error:', error);
        }
    };

    return (
        <div className="min-h-screen flex flex-col" data-theme="cmyk">
            <Navbar />
            <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8">
                <div className="container mx-auto bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="py-4 px-5 lg:px-6 bg-gray-50 border-b border-gray-200">
                        <h1 className="text-3xl font-bold text-gray-900">Tambah Penawaran Harga</h1>
                    </div>
                    <form onSubmit={handleSubmit} className="p-5 lg:p-6">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Perusahaan Klien</label>
                            <select
                                className="form-select block w-full mt-1 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 rounded-md"
                                value={formData.klienId}
                                name="klienId"
                                onChange={handleClientChange}
                                required
                            >
                                <option value="">Select a client</option>
                                {kliens.map((klien) => (
                                    <option key={klien.id} value={klien.id}>{klien.name}</option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary mt-4" style={{ backgroundColor: "#f0f0f0", color: "#000" }}>
                            Tambahkan Rute
                        </button>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default CreatePenawaranHarga;
