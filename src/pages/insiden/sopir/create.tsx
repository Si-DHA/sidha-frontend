import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { createInsiden } from '@/pages/api/insiden/createInsiden'
import Navbar from "@/app/components/common/navbar";
import Footer from "@/app/components/common/footer";
import SuccessAlert from "@/app/components/common/SuccessAlert";
import FailAlert from "@/app/components/common/FailAlert";
import { useRouter } from 'next/router';
import Drawer from "@/app/components/common/drawer";
import { getAcceptedOffersBySopir } from '@/pages/api/tawaran-kerja/getAcceptedOffersBySopir';

const CreateInsidenPage = () => {
    const sopirId = Cookies.get('idUser');
    const [kategori, setKategori] = useState('');
    const [lokasi, setLokasi] = useState('');
    const [keterangan, setKeterangan] = useState('');
    const [buktiFoto, setBuktiFoto] = useState(null);
    const [error, setError] = useState('');
    const [alert, setAlert] = useState<React.ReactNode>(null);
    const router = useRouter();
    const [orderItems, setOrderItems] = useState([]);
    const [selectedOrderItem, setSelectedOrderItem] = useState('');

    useEffect(() => {
        if (sopirId) {
            getAcceptedOffersBySopir(sopirId)
                .then(data => {
                    setOrderItems(data.content);
                })
                .catch(error => {
                    console.error('Fetching error:', error);
                    setError('Error fetching order items');
                });
        }
    }, [sopirId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Make sure all the required fields are filled out
        if (!sopirId || !selectedOrderItem) {
            setError('Please make sure all fields are filled out correctly.');
            return;
        }
    
        // Create a new FormData object
        const formData = new FormData();
        formData.append('sopirId', sopirId);
        formData.append('kategori', kategori);
        formData.append('lokasi', lokasi);
        formData.append('keterangan', keterangan);
        formData.append('orderItemId', selectedOrderItem); 
        if (buktiFoto) {
            formData.append('buktiFoto', buktiFoto);
        }
        try {
            const response = await createInsiden(formData);
            setAlert(<SuccessAlert message="Insiden created successfully." />);
            router.push(`/insiden/sopir/detail/${response.id}`);
        } catch (error) {
            setError(error.message); // Make sure error.message is not undefined
            setAlert(<FailAlert message={error.message || 'Unknown error occurred'} />);
        }
        
    };
    

    const handleFileChange = (e) => {
        setBuktiFoto(e.target.files[0]);
    };

    return (
        <>
            <Drawer userRole='userRole'>
                <main className="flex flex-col items-left justify-between px-4" data-theme="winter">
                    <h2 className="text-2xl font-bold text-center my-6">Lapor Insiden</h2>
                    {alert}
                    <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                            <label htmlFor="orderItem" className="block text-sm font-medium text-gray-700">Order Item:</label>
                            <select
                                id="orderItem"
                                value={selectedOrderItem}
                                onChange={(e) => setSelectedOrderItem(e.target.value)}
                                required
                                className="w-full mt-1 p-2 border-2 rounded-md"
                            >
                                <option value="">Select an Order Item</option>
                                {orderItems.map((item) => (
                                    <option key={item.orderItem.id} value={item.orderItem.id}>
                                        {item.orderItem.rute[0].source} - {item.orderItem.rute[0].destination}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="kategori" className="block text-sm font-medium text-gray-700">Kategori:</label>
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
                            <label htmlFor="lokasi" className="block text-sm font-medium text-gray-700">Lokasi:</label>
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
                            <label htmlFor="keterangan" className="block text-sm font-medium text-gray-700">Keterangan:</label>
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
                            <label htmlFor="buktiFoto" className="block text-sm font-medium text-gray-700">Bukti Foto:</label>
                            <input
                                id="buktiFoto"
                                type="file"
                                onChange={handleFileChange}
                                required
                                accept="image/jpeg, image/png, image/gif, image/bmp, image/tiff, image/webp, image/heif, image/heic"
                                className="w-full mt-1 p-2 border-2 rounded-md file:bg-blue-500 file:text-white file:border-none file:px-4 file:py-2 file:rounded-md file:cursor-pointer"
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md mb-4"
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
