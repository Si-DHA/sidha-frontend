import Drawer from "@/app/components/common/drawer";
import Footer from "@/app/components/common/footer";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Cookies from 'js-cookie';

const PurchaseOrderDetailPage = () => {

    const queryParameters = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const id = queryParameters?.get("id");

    var isLoggedIn = Cookies.get('isLoggedIn');
    const [userRole, setUserRole] = useState('');
    const router = useRouter();
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/login');
        }
        const role = Cookies.get('role');
        setUserRole(role || '');
    },)

    // const confirmOrder = () => {
    //     try {
    //         // const response = confirmOrderById(id);
    //         if (response.ok) {
    //             router.push('/order');
    //         } else {
    //             throw new Error(response.message);
    //         }
    //     } catch (error: any) {
    //         setError(error.message);
    //     }
    // }

    return (
        <main className="flex min-h-screen flex-col items-center justify-between" data-theme="winter">
            <Drawer userRole={userRole}>
                <div className="flex flex-col justify-center items-center mih-h-screen p-8">
                    <h1 className="text-3xl font-bold text-center ">Konfirmasi Purchase Order</h1>
                </div>
                <div className="flex flex-col gap-6 mx-4 my-4 ">
                    <div className="flex flex-col gap-4 justify-center items-center mih-h-screen p-8 border rounded-lg shadow-md">

                    </div>
                </div>
            </Drawer>
            <Footer />
        </main>
    );
}

export default PurchaseOrderDetailPage;