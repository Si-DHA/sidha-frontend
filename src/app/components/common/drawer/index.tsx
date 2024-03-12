import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Navbar from "../navbar";

const Drawer = ({ userRole }: { userRole: string }) => {
    // buat drawer berdasarkan role
    const [drawer, setDrawer] = useState(<></>);
    useEffect(() => {
        if (userRole === 'ADMIN') {
            setDrawer(
                <div className="drawer lg:drawer-open">
                    <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
                    <div className="drawer-content flex flex-col">
                        <Navbar />
                        ADMIN
                    </div>
                    <div className="drawer-side">
                        <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label>
                        <ul className="menu p-4 w-80 min-h-full bg-base-200">
                            <li><a>Sidebar Item 1</a></li>
                            <li><a>Sidebar Item 2</a></li>
                        </ul>
                    </div>
                </div>
            )
        } else {
            setDrawer(
                <div className="drawer lg:drawer-open">
                    <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
                    <div className="drawer-content flex flex-col">
                        <Navbar />
                        SELAIN ADMIN
                    </div>
                    <div className="drawer-side">
                        <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label>
                        <ul className="menu p-4 w-80 min-h-full bg-base-200">
                            <li><a>Sidebar Item 1</a></li>
                            <li><a>Sidebar Item 2</a></li>
                        </ul>
                    </div>
                </div>
            )
        }
    }, [userRole]);
    return drawer;
}

export default Drawer;