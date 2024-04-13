import Drawer from "@/app/components/common/drawer";
import Footer from "@/app/components/common/footer"
import Cookies from 'js-cookie';
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import PurchaseOrderForm from "./PurchaseOrderForm";

const CreatePurchaseOrderPage = () => {

    var isLoggedIn = true
    const userRole = 'KARYAWAN'
    const router = useRouter();

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/login');
        }
    },)

    const [numberOfForms, setNumberOfForms] = useState(1);

    const handleAddPurchaseOrder = () => {
        setNumberOfForms(prevCount => prevCount + 1);
    }

    const BtnAddPurchaseOrder = () => {
        return (
            <button className="btn" onClick={handleAddPurchaseOrder}>Tambah Order Item</button>
        );
    }


    return (
        <main className="flex min-h-screen flex-col items-center justify-between" data-theme="winter">
            <Drawer userRole={userRole}>
                <div className="flex flex-col justify-center items-center mih-h-screen p-8">
                    <h1 className="text-3xl font-bold text-center ">Buat Purchase Order</h1>
                </div>
                <div className="flex flex-col gap-6 mx-4 my-4 ">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Tanggal Pengiriman</span>
                        </label>
                        <input type="date" className="input input-bordered" />
                    </div>
                    {[...Array(numberOfForms)].map((_, index) => (
                        <PurchaseOrderForm key={index} index={index} />
                    ))}
                    <BtnAddPurchaseOrder />
                </div>
            </Drawer>
            <Footer />
        </main>
    );

}

export default CreatePurchaseOrderPage