import { useState } from 'react';
import Cookies from 'js-cookie';
import { createInsiden } from '@/pages/api/insiden/createInsiden'
import Navbar from "@/app/components/common/navbar";
import Footer from "@/app/components/common/footer";
import SuccessAlert from "@/app/components/common/SuccessAlert";
import FailAlert from "@/app/components/common/FailAlert";
import { useRouter } from 'next/router';
import Drawer from "@/app/components/common/drawer";

const CreateInsidenPage = () => {
    const sopirId = Cookies.get('idUser');
    const [kategori, setKategori] = useState('');
    const [lokasi, setLokasi] = useState('');
    const [keterangan, setKeterangan] = useState('');
    const [buktiFoto, setBuktiFoto] = useState(null);
    const [error, setError] = useState('');
    const [alert, setAlert] = useState<React.ReactNode>(null);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!sopirId) {
            setError('Invalid User');
            return;
        }
        try {
            const response = await createInsiden(sopirId, kategori, lokasi, keterangan, buktiFoto);
            console.log('Insiden created', response);

            setAlert(<SuccessAlert message="Insiden is created successfully" />);
            router.push(`/insiden/sopir/detail/${response.id}`);
            // Redirect or show success message
        } catch (error) {
            setError(error.message);
        }
    };

    const handleFileChange = (e) => {
        setBuktiFoto(e.target.files[0]);
    };

    return (
        <>
            <Drawer userRole='userRole'>
            <main className="container mx-auto p-4">
                <h2 className="text-2xl font-bold text-center my-6">Lapor Insiden</h2>
                {alert}
                <form onSubmit={handleSubmit}>
                <div className="mb-4">
                        <label htmlFor="kategori" className="text-lg font-medium">Kategori:</label>
                        <select 
                            id="kategori"
                            value={kategori}
                            onChange={(e) => setKategori(e.target.value)}
                            required
                            className="w-full mt-1 p-2 border-2 rounded-md"
                        >
                            <option value="">Pilih Kategori</option>
                            <option value="Bencana Alam">Bencana Alam</option>
                            <option value="Kecelakaan">Kecelakaan</option>
                            <option value="Kendaraan Rusak">Kendaraan Rusak</option>
                            <option value="Pencurian Barang">Pencurian Barang</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="lokasi" className="text-lg font-medium">Lokasi:</label>
                        <input 
                            id="lokasi"
                            type="text"
                            placeholder="Nama jalan, landmark, detail lokasi"
                            value={lokasi}
                            onChange={(e) => setLokasi(e.target.value)}
                            required
                            className="w-full mt-1 p-2 border-2 rounded-md"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="keterangan" className="text-lg font-medium">Keterangan:</label>
                        <textarea 
                            id="keterangan"
                            placeholder="Jelaskan insiden yang terjadi"
                            value={keterangan}
                            onChange={(e) => setKeterangan(e.target.value)}
                            required
                            className="w-full mt-1 p-2 border-2 rounded-md"
                            rows="4"
                        ></textarea>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="buktiFoto" className="text-lg font-medium">Bukti Foto:</label>
                        <input 
                            id="buktiFoto"
                            type="file"
                            onChange={handleFileChange}
                            required
                            className="w-full mt-1 p-2 border-2 rounded-md file:bg-blue-500 file:text-white file:border-none file:px-4 file:py-2 file:rounded-md file:cursor-pointer"
                        />
                    </div>
                    <button 
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
                    >
                        Submit
                    </button>
                    {error && <p className="text-red-500 text-xs italic mt-4">{error}</p>}
                </form>
            </main>
            </Drawer>
            <Footer />
        </>
    );
};

export default CreateInsidenPage;
