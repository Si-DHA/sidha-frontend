import Drawer from "@/app/components/common/drawer";
import Footer from "@/app/components/common/footer"
import Cookies from 'js-cookie';
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const DaftarPurchaseOrderPage = () => {

    var isLoggedIn = true
    const userRole = 'KARYAWAN'
    const router = useRouter();

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/login');
        }
    },)


    return (
        <main className="flex min-h-screen flex-col items-center justify-between" data-theme="winter">
            <Drawer userRole={userRole}>
                <div className="flex flex-col justify-center items-center mih-h-screen">
                    <div className="flex flex-row justify-center ">
                        
                    </div>
                </div>
            </Drawer>
            <Footer />
        </main>
    );
}

export default DaftarPurchaseOrderPage