import Drawer from "@/app/components/common/drawer";
import Footer from "@/app/components/common/footer"
import Cookies from 'js-cookie';
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const DaftarPurchaseOrderPage = () => {

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

    const Table = () => {
        if (userRole === 'KLIEN') {
            return (
                <table className="table table-zebra">
                    {/* head */}
                    <thead>
                        <tr>
                            <th></th>
                            <th>Id Order</th>
                            <th>Tanggal Pemesanan</th>
                            <th>Tanggal Pengiriman</th>
                            <th>Jumlah Order Item</th>
                            <th>Total Biaya Pengiriman</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* row 1 */}
                        <tr>
                            <th>1</th>
                            <td>Cy Ganderton</td>
                            <td>Cy Ganderton</td>
                            <td>Quality Control Specialist</td>
                            <td>Blue</td>
                            <td>Blue</td>
                            <td>
                                <button className="btn btn-primary btn-sm">Detail</button>
                            </td>
                        </tr>
                        {/* row 2 */}
                        <tr>
                            <th>2</th>
                            <td>Hart Hagerty</td>
                            <td>Hart Hagerty</td>
                            <td>Desktop Support Technician</td>
                            <td>Purple</td>
                            <td>Purple</td>
                            <td>
                                <button className="btn btn-primary btn-sm">Detail</button>
                            </td>
                        </tr>
                        {/* row 3 */}
                        <tr>
                            <th>3</th>
                            <td>Brice Swyre</td>
                            <td>Brice Swyre</td>
                            <td>Tax Accountant</td>
                            <td>Red</td>
                            <td>Red</td>
                            <td>
                                <button className="btn btn-primary btn-sm">Detail</button>
                            </td>
                        </tr>

                    </tbody>
                </table>
            );
        } else if (userRole === 'KARYAWAN') {
            return (
                <table className="table table-zebra">
                    {/* head */}
                    <thead>
                        <tr>
                            <th></th>
                            <th>Id Order</th>
                            <th>Customer</th>
                            <th>Tanggal Pemesanan</th>
                            <th>Tanggal Pengiriman</th>
                            <th>Jumlah Order Item</th>
                            <th>Total Biaya Pengiriman</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* row 1 */}
                        <tr>
                            <th>1</th>
                            <td>Cy Ganderton</td>
                            <td>Cy Ganderton</td>
                            <td>Cy Ganderton</td>
                            <td>Quality Control Specialist</td>
                            <td>Blue</td>
                            <td>Blue</td>
                            <td>
                                <button className="btn btn-primary btn-sm">Detail</button>
                            </td>
                        </tr>
                        {/* row 2 */}
                        <tr>
                            <th>2</th>
                            <td>Hart Hagerty</td>
                            <td>Hart Hagerty</td>
                            <td>Hart Hagerty</td>
                            <td>Desktop Support Technician</td>
                            <td>Purple</td>
                            <td>Purple</td>
                            <td>
                                <button className="btn btn-primary btn-sm">Detail</button>
                            </td>
                        </tr>
                        {/* row 3 */}
                        <tr>
                            <th>3</th>
                            <td>Brice Swyre</td>
                            <td>Brice Swyre</td>
                            <td>Brice Swyre</td>
                            <td>Tax Accountant</td>
                            <td>Red</td>
                            <td>Red</td>
                            <td>
                                <button className="btn btn-primary btn-sm">Detail</button>
                            </td>
                        </tr>

                    </tbody>
                </table>
            );
        }
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-between" data-theme="winter">
            <Drawer userRole={userRole}>
                <div className="flex flex-col justify-center items-center mih-h-screen p-8">
                    <h1 className="text-3xl font-bold text-center ">Daftar Purchase Order</h1>
                </div>
                <div className="flex flex-col gap-6 mx-4 my-4 ">
                    <div className="flex flex-col gap-4 justify-center items-center mih-h-screen p-8 border rounded-lg shadow-md">
                        <div className="overflow-x-auto w-full">
                            <Table />
                        </div>
                    </div>
                </div>
            </Drawer>
            <Footer />
        </main>
    );
}

export default DaftarPurchaseOrderPage