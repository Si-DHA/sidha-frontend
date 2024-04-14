import Drawer from "@/app/components/common/drawer";
import Footer from "@/app/components/common/footer"
import Cookies from 'js-cookie';
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import PurchaseOrderForm from "./PurchaseOrderForm";
import { PurchaseOrder } from "@/pages/order/model";

const CreatePurchaseOrderPage = () => {

    var isLoggedIn = Cookies.get('isLoggedIn');
    const [userRole, setUserRole] = useState('');
    const router = useRouter();
    const [formData, setFormData] = useState([
        {
            id: '',
            createdAt: '',
            orderItems: [],
            totalPrice: 0,
            tanggalPengiriman: '',
            klien: ''
        } as PurchaseOrder
    ] as PurchaseOrder[]);

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/login');
        }
        const role = Cookies.get('role');
        setUserRole(role || '');
    },)


    const handleAddPurchaseOrder = () => {
        setFormData([...formData, {
            id: '',
            createdAt: '',
            orderItems: [],
            totalPrice: 0,
            tanggalPengiriman: '',
            klien: ''
        } as PurchaseOrder]);
    }

    const BtnAddPurchaseOrder = () => {
        return (
            <div className="btn" onClick={handleAddPurchaseOrder}>Tambah Order Item</div>
        );
    }

    const [errorDate, setErrorDate] = useState('');

    // validasi tanggal pengiriman
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

    return (
        <main className="flex min-h-screen flex-col items-center justify-between" data-theme="winter">
            <Drawer userRole={userRole}>
                <div className="flex flex-col justify-center items-center mih-h-screen p-8">
                    <h1 className="text-3xl font-bold text-center ">Buat Purchase Order</h1>
                </div>
                <div className="flex flex-col gap-6 mx-4 my-4 " onSubmit={handleDetailOrder}>
                    <form className="form-control flex flex-col gap-6">

                        <div className="flex flex-col w-full">
                            <label className="label">
                                <span className="label-text">Tanggal Pengiriman</span>
                            </label>
                            <input type="date" required className="input input-bordered" onChange={handleDateChange} />
                            {errorDate && <div className="text-sm text-red-500">{errorDate}</div>}
                        </div>

                        {[...Array(formData.length)].map((_, index) => (
                            <PurchaseOrderForm key={index} index={index} />
                        ))}
                        <BtnAddPurchaseOrder />
                        <button className="btn btn-primary" type="submit">Lihat Rincian Order</button>
                    </form>
                </div>
            </Drawer>
            <Footer />
        </main>
    );

}

export default CreatePurchaseOrderPage