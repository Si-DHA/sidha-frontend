import { useState } from 'react';

const RuteOrderForm = () => {
    const [rutes, setRutes] = useState(['']); // Inisialisasi dengan minimal satu rute

    const handleAddRute = () => {
        setRutes([...rutes, '']);
    };

    const handleRemoveRute = (index) => {
        if (rutes.length > 1) { // Pastikan minimal satu rute tetap ada
            setRutes(rutes.filter((_, i) => i !== index));
        }
    };

    const handleChangeRute = (index, value) => {
        const updatedRutes = [...rutes];
        updatedRutes[index] = value;
        setRutes(updatedRutes);
    };

    return (
        <div className="flex flex-col gap-4 w-full">
            {rutes.map((rute, index) => (
                <div key={index} className="flex gap-4">
                    <label className="form-control flex-grow ">
                        {index === 0 ? <div className="label">
                            <span className="label-text">Rute Pengiriman</span>

                        </div> : null}
                        <select className="select select-bordered" value={rute} onChange={(e) => handleChangeRute(index, e.target.value)}>
                            <option disabled value="">Pilih satu</option>
                            <option>Star Wars</option>
                            <option>Harry Potter</option>
                            <option>Lord of the Rings</option>
                            <option>Planet of the Apes</option>
                            <option>Star Trek</option>
                        </select>
                    </label>
                    {index > 0 && ( // Tombol hapus hanya ditampilkan untuk rute kedua dan seterusnya
                        <button className="flex btn btn-error" onClick={() => handleRemoveRute(index)}>Hapus Rute</button>
                    )}
                </div>
            ))}
            <button className="btn" onClick={handleAddRute}>Tambah Rute</button>
        </div>
    );
};

const PurchaseOrderForm = ({ index }) => {

    const [isDeleted, setIsDeleted] = useState(false);

    const handleDelete = () => {
        setIsDeleted(true);
    };

    if (isDeleted) {
        return null; // Jika order item telah dihapus, tampilkan null untuk menghilangkan form dari tampilan
    }

    return (
        <div className="flex flex-col gap-4 justify-center items-center mih-h-screen p-8 border rounded-lg shadow-md">
            {/* judul: item order ke-x */}
            <div className="flex justify-between w-full">
                <span className="label-text font-bold">Item Order ke-{index + 1}</span>
            </div>
            <label className="form-control w-full">
                <div className="label">
                    <span className="label-text">Tipe Barang</span>

                </div>
                <select className="select select-bordered">
                    <option disabled selected>Pilih satu</option>
                    <option>Star Wars</option>
                    <option>Harry Potter</option>
                    <option>Lord of the Rings</option>
                    <option>Planet of the Apes</option>
                    <option>Star Trek</option>
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
                <select className="select select-bordered">
                    <option disabled selected>Pilih satu</option>
                    <option>Star Wars</option>
                    <option>Harry Potter</option>
                    <option>Lord of the Rings</option>
                    <option>Planet of the Apes</option>
                    <option>Star Trek</option>
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
                <button className="btn btn-error w-full" onClick={handleDelete}>Hapus Order Item</button>
            )}
        </div>
    );
};

export default PurchaseOrderForm;