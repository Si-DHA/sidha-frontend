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
                alert('Penawaran Harga created successfully');
                router.push('/penawaranharga');
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
                    <button type="submit" className="btn btn-primary mt-4">
                        Submit Penawaran Harga
                    </button>
                </form>
            </main>
            <Footer />
        </div>
    );
};

export default CreatePenawaranHarga;
