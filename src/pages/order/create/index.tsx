import Drawer from "@/app/components/common/drawer";
import Footer from "@/app/components/common/footer"
import Cookies from 'js-cookie';
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Order, OrderItem, Rute } from "../model";
import { daftarRute, tipeBarang, tipeTruk } from "../data";

const CreatePurchaseOrderPage = () => {

    var userId = Cookies.get('userId');
    var isLoggedIn = Cookies.get('isLoggedIn');
    const [userRole, setUserRole] = useState('');
    const router = useRouter();

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/login');
        }
        const role = Cookies.get('role');
        setUserRole(role || '');
    },)

    const [order, setOrder] = useState<Order>({
        klienId: userId || '',
        tanggalPengiriman: '',
        orderItems: []
    } as Order
    );

    const [formData, setFormData] = useState([
        {
            isPecahBelah: false,
            tipeBarang: '',
            tipeTruk: '',
            keterangan: '',
            rute: [
                {
                    source: '',
                    destination: '',
                    alamatPengiriman: '',
                    alamatPenjemputan: ''
                } as Rute
            ]
        } as OrderItem
    ]);

    const handleAddOrderItem = () => {
        setFormData([...formData, {
            isPecahBelah: false,
            tipeBarang: '',
            tipeTruk: '',
            keterangan: '',
            rute: [
                {
                    source: '',
                    destination: '',
                    alamatPengiriman: '',
                    alamatPenjemputan: ''
                } as Rute
            ]
        } as OrderItem
        ]);
    };

    const handleRemoveOrderItem = (index: any) => {
        if (formData.length > 1) {
            setFormData(formData.filter((_, i) => i !== index));
        }
    }

    const handleAddRute = (orderItemIndex: any) => {
        const newFormData = [...formData];
        newFormData[orderItemIndex].rute.push({
            source: '',
            destination: '',
            alamatPengiriman: '',
            alamatPenjemputan: ''
        } as Rute);
        setFormData(newFormData);
    }

    const handleRemoveRute = (ruteIndex: any, orderItemIndex: any) => {
        const newFormData = [...formData];
        newFormData[orderItemIndex].rute = newFormData[orderItemIndex].rute.filter((_, i) => i !== ruteIndex);
        setFormData(newFormData);
    }

    const [errorDate, setErrorDate] = useState('');
    const handleDateChange = (e: any) => {
        const today = new Date();
        const selectedDate = new Date(e.target.value);
        if (selectedDate < today) {
            setErrorDate('Tanggal pengiriman tidak boleh kurang dari tanggal hari ini');
        }
    }

    const handleDetailOrder = () => {
        router.push('/order/checkout');
    }

    const RuteOrderForm = ({ ruteIndex, orderItemIndex }: any) => {
        return (
            <div className="flex flex-col gap-4 w-full">

                <div key={ruteIndex} className="flex gap-4">
                    <label className="form-control flex-grow gap-2">
                        <div className='flex flex-col'>
                            {ruteIndex === 0 ? <div className="label">
                                <span className="label-text">Rute Pengiriman</span>

                            </div> : null}
                            <select className="select select-bordered grow">
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
                    {ruteIndex > 0 && ( // Tombol hapus hanya ditampilkan untuk rute kedua dan seterusnya
                        <div className="flex btn btn-error" onClick={() => handleRemoveRute(ruteIndex, orderItemIndex)}>Hapus Rute</div>
                    )}
                </div>

                <div className="btn" onClick={() => handleAddRute(orderItemIndex)}>Tambah Rute</div>
            </div>
        );
    };

    const OrderItemForm = ({ index }: any) => {
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
                {formData[index].rute.map((_, ruteIndex) => (
                    <RuteOrderForm key={ruteIndex} ruteIndex={ruteIndex} orderItemIndex={index} />
                ))}
                {index > 0 && (
                    <div className="btn btn-error w-full" onClick={() => handleRemoveOrderItem(index)}>Hapus Order Item</div>
                )}
            </div>
        );
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-between" data-theme="winter">
            <Drawer userRole={userRole}>
                <div className="flex flex-col justify-center items-center mih-h-screen p-8">
                    <h1 className="text-3xl font-bold text-center ">Buat Purchase Order</h1>
                </div>
                <div className="flex flex-col gap-6 mx-4 my-4 " onSubmit={() => handleDetailOrder()}>
                    <form className="form-control flex flex-col gap-6">

                        <div className="flex flex-col w-full">
                            <label className="label">
                                <span className="label-text">Tanggal Pengiriman</span>
                            </label>
                            <input type="date" required className="input input-bordered" onChange={handleDateChange} />
                            {errorDate && <div className="text-sm text-red-500">{errorDate}</div>}
                        </div>
                        {formData.map((_, index) => (
                            <OrderItemForm key={index} index={index} />
                        ))}
                        <div className="btn" onClick={handleAddOrderItem}>Tambah Order Item</div>
                        <button className="btn btn-primary" type="submit">Lihat Rincian Order</button>
                    </form>
                </div>
            </Drawer>
            <Footer />
        </main>
    );

}

export default CreatePurchaseOrderPage