import React, { useState, useEffect } from 'react';
import createPenawaranHarga from '../api/createPenawaranHarga';
import Navbar from '@/app/components/common/navbar';
import Footer from '@/app/components/common/footer';
import { useRouter } from 'next/router';
import SuccessAlert from "@/app/components/common/SuccessAlert";
import FailAlert from "@/app/components/common/FailAlert";

interface Klien {
    id: string;
    companyName: string;
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
    const [alert, setAlert] = useState<React.ReactNode>(null);

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

    const handleBack = () => {
        router.push(`/penawaranharga/`)
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
                setAlert(<SuccessAlert message="Penawaran Harga berhasil dibuat." />);
                router.push(`/penawaranharga/${idPenawaranHarga}/create`);
            } else {
                const error = await response.json();
                setAlert(<FailAlert message="Anda sudah memiliki penawaran untuk klien ini." />);

            }
        } catch (error) {
            setAlert(<FailAlert message="An error occurred while submitting the form." />);
            console.error('Submit error:', error);
        }
    };

    return (
        <div className="min-h-screen flex flex-col" data-theme="cmyk">
            <Navbar />
            <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8">
            {alert} {/* Render alert message */}
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
                                    <option key={klien.id} value={klien.id}>{klien.companyName}</option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary mt-4" style={{ backgroundColor: "#f0f0f0", color: "#000" }}>
                            Simpan Perusahaan
                        </button>
                        <button type="button" className="btn btn-danger mt-4 mx-2" onClick={handleBack}>
                        Kembali
                    </button>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default CreatePenawaranHarga;
