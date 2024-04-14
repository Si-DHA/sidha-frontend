import { useState } from 'react';
import { daftarRute, tipeBarang, tipeTruk } from '../data';

const RuteOrderForm = () => {
    const [rutes, setRutes] = useState(['']); // Inisialisasi dengan minimal satu rute

    const handleAddRute = () => {
        setRutes([...rutes, '']);
    };

    const handleRemoveRute = (index: any) => {
        if (rutes.length > 1) { // Pastikan minimal satu rute tetap ada
            setRutes(rutes.filter((_, i) => i !== index));
        }
    };

    const handleChangeRute = (index: any, value: any) => {
        const updatedRutes = [...rutes];
        updatedRutes[index] = value;
        setRutes(updatedRutes);
    };

    return (
        <div className="flex flex-col gap-4 w-full">
            {rutes.map((rute, index) => (
                <div key={index} className="flex gap-4">
                    <label className="form-control flex-grow gap-2">
                        <div className='flex flex-col'>
                            {index === 0 ? <div className="label">
                                <span className="label-text">Rute Pengiriman</span>

                            </div> : null}
                            <select className="select select-bordered grow" value={rute} onChange={(e) => handleChangeRute(index, e.target.value)}>
                                <option disabled value="">Pilih satu</option>
                                {daftarRute.map((rute, index) => (
                                    <option key={index}>{rute[0]} - {rute[1]}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-row gap-4 ">
                            <input type="text" className="input input-bordered grow" placeholder="Alamat Penjemputan" />

                            <input type="text" className="input input-bordered grow" placeholder="Alamat Pengiriman" />

                        </div>
                    </label>
                    {index > 0 && ( // Tombol hapus hanya ditampilkan untuk rute kedua dan seterusnya
                        <div className="flex btn btn-error" onClick={() => handleRemoveRute(index)}>Hapus Rute</div>
                    )}
                </div>
            ))}
            <div className="btn" onClick={handleAddRute}>Tambah Rute</div>
        </div>
    );
};

const PurchaseOrderForm = ({ index }: any) => {

    const [isDeleted, setIsDeleted] = useState(false);

    const handleDelete = () => {
        setIsDeleted(true);
    };

    if (isDeleted) {
        return null; // Jika order item telah dihapus, tampilkan null untuk menghilangkan form dari tampilan
    }

    return (
        <div className="flex flex-col gap-2 justify-center items-center mih-h-screen p-8 border rounded-lg shadow-md">
            {/* judul: item order ke-x */}
            <div className="flex justify-between w-full">
                <span className="label-text font-bold">Item Order ke-{index + 1}</span>
            </div>
            <label className="form-control w-full">
                <div className="label">
                    <span className="label-text">Tipe Barang</span>

                </div>
                <select required className="select select-bordered">
                    <option disabled selected>Pilih satu</option>
                    {tipeBarang.map((tipe, index) => (
                        <option key={index}>{tipe}</option>
                    ))}
                </select>
            </label>
            <div className="form-control w-full">
                <label className="label cursor-pointer">
                    <span className="label-text">Barang rentan pecah belah (fragile)?</span>
                    <input type="checkbox" defaultChecked className="checkbox checkbox-primary" />
                </label>
            </div>
            <label className="form-control w-full">
                <div className="label">
                    <span className="label-text">Tipe Truk</span>

                </div>
                <select className="select select-bordered" required>
                    <option disabled selected>Pilih satu</option>
                    {tipeTruk.map((tipe, index) => (
                        <option key={index}>{tipe}</option>
                    ))}
                </select>
            </label>
            <label className="form-control w-full">
                <div className="label">
                    <span className="label-text">Keterangan</span>
                </div>
                <textarea className="textarea textarea-bordered h-24" placeholder="Keterangan"></textarea>
            </label>
            <RuteOrderForm />
            {index > 0 && (
                <div className="btn btn-error w-full" onClick={handleDelete}>Hapus Order Item</div>
            )}
        </div>
    );
};

export default PurchaseOrderForm;