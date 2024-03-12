import Drawer from "@/app/components/common/drawer";
import FixedDrawer from "@/app/components/common/drawer";
import Footer from "@/app/components/common/footer"
import Navbar from "@/app/components/common/navbar"
import Cookies from 'js-cookie';
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const DashboardPage = () => {

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


    return (
        <main className="flex min-h-screen flex-col items-center justify-between" data-theme="winter">
            <Drawer userRole={userRole} />
            {/* <div className="drawer lg:drawer-open">
                <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content flex flex-col">

                    <Navbar />

                    Content
                </div>
                <div className="drawer-side">
                    <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label>
                    <ul className="menu p-4 w-80 min-h-full bg-base-200">

                        <li><a>Sidebar Item 1</a></li>
                        <li><a>Sidebar Item 2</a></li>
                    </ul>
                </div>
            </div> */}
            
            <Footer />
        </main>
    );
}

export default DashboardPage