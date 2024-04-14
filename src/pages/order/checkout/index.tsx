import Drawer from "@/app/components/common/drawer";
import Footer from "@/app/components/common/footer";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Cookies from 'js-cookie';

const PurchaseOrderDetail = () => {

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

    const [modal, setModal]:any = useState(null);
    const handleModal = () => {
        modal.showModal()
    }
    
    useEffect(() => {
        setModal(document.getElementById('modal_confirm'));
        
    }, [])

    const handleBack = () => {
        router.push('/order/create');
    }

    const handleCheckout = () => {
        router.push('/order');
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-between" data-theme="winter">
            <dialog id="modal_confirm" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Checkout</h3>
                    <p className="py-4">Apakah Anda yakin ingin checkout Purchase Order ini?</p>
                    <div className="modal-action">
                        <form method="dialog" className='space-x-4'>
                            <button className="btn px-8">Batal</button>
                            <button className="btn btn-error px-6" onClick={handleCheckout}>Checkout Sekarang</button>
                        </form>
                    </div>
                </div>
            </dialog>
            <Drawer userRole={userRole}>
                <div className="flex flex-col gap-2 justify-center items-center mih-h-screen p-8">
                    <h1 className="text-3xl font-bold text-center ">Detail Purchase Order</h1>
                    <h2 className="text-l text-center ">Tanggal Pengiriman: 12/12/2021</h2>
                </div>
                <div className="flex flex-col gap-6 mx-4 my-4 ">
                    <div className="flex flex-col gap-4 justify-center items-center mih-h-screen p-8 border rounded-lg shadow-md">
                        <div className="overflow-x-auto w-full">
                            <table className="table table-zebra">
                                {/* head */}
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Tipe Barang</th>
                                        <th>Fragile</th>
                                        <th>Tipe Truk</th>
                                        <th>Rute Pegiriman</th>
                                        <th>Biaya Pengiriman</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* row 1 */}
                                    <tr>
                                        <th>1</th>
                                        <td>Cy Ganderton</td>
                                        <td>Quality Control Specialist</td>
                                        <td>Blue</td>
                                        <td>Blue</td>
                                        <td>Blue</td>
                                    </tr>
                                    {/* row 2 */}
                                    <tr>
                                        <th>2</th>
                                        <td>Hart Hagerty</td>
                                        <td>Desktop Support Technician</td>
                                        <td>Purple</td>
                                        <td>Purple</td>
                                        <td>Purple</td>
                                    </tr>
                                    {/* row 3 */}
                                    <tr>
                                        <th>3</th>
                                        <td>Brice Swyre</td>
                                        <td>Tax Accountant</td>
                                        <td>Red</td>
                                        <td>Red</td>
                                        <td>Red</td>
                                    </tr>

                                </tbody>
                                <tfoot>
                                    <tr>
                                        <th colSpan={5}>Total Biaya Pengiriman</th>
                                        <th>Rp5.000.000</th>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                    <div className="flex flex-row gap-4 ">
                        <button className="btn" onClick={handleBack}>Kembali</button>
                        <button className="btn btn-primary grow" onClick={handleModal}>Checkout Purchase Order</button>
                    </div>
                </div>
            </Drawer>
            <Footer />
        </main>
    );
}

export default PurchaseOrderDetail