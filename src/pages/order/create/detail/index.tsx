import Drawer from "@/app/components/common/drawer";
import Footer from "@/app/components/common/footer";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import { getOrderDetailBeforeCheckout } from "@/pages/api/order/getOrderDetailBeforeCheckout";
import { Order } from "../../model";
import DataTable from "@/app/components/common/datatable/DataTable";

const PurchaseOrderDetail = () => {

    var isLoggedIn = Cookies.get('isLoggedIn');
    var token = Cookies.get('token');
    const [userRole, setUserRole] = useState('');
    const [error, setError] = useState('');
    const [order, setOrder] = useState<Order | null>(null);
    const [orderItems, setOrderItems] = useState<any[]>([]);
    const router = useRouter();

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/login');
        } 

        // const role = Cookies.get('role');
        // setUserRole(role || '');

        if (router.query.order === undefined) {
            router.push('/order/create');
        }

        if (order === null) {
            const order = JSON.parse(router.query.order as string) as Order;
            order.tanggalPengiriman = order.tanggalPengiriman.split('-').reverse().join('-') + ' 00:00:00';
            setOrder(order);
        }

        const fetchData = async () => {
            try {
                if (!token) {
                    throw new Error('Token not found');
                }
                const response = await getOrderDetailBeforeCheckout(order, token);
                setOrderItems(response);
            } catch (error: any) {
                setError(error.message);
            }
        }
        if (orderItems.length === 0) {
            fetchData();
        }
    },)

    const [modal, setModal]: any = useState(null);
    const handleModal = () => {
        modal.showModal()
    }

    useEffect(() => {
        setModal(document.getElementById('modal_confirm'));
    }, [])

    const handleBack = () => {
        router.push({
            pathname: '/order/create',
            query: { order: JSON.stringify(order) }
        })
    }

    const handleCheckout = () => {
        router.push('/order');
    }

    const columns = [
        {
            Header: 'Tipe Barang',
            accessor: 'tipeBarang',
        },
        {
            Header: 'Fragile',
            accessor: 'fragile',
        },
        {
            Header: 'Tipe Truk',
            accessor: 'tipeTruk',
        },
        {
            Header: 'Rute Pegiriman',
            accessor: 'rutePegiriman',
        },
        {
            Header: 'Biaya Pengiriman',
            accessor: 'biayaPengiriman',
        }   
    ]

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
                    <h2 className="text-l text-center ">Tanggal Pengiriman: {order?.tanggalPengiriman}</h2>
                </div>
                <div className="flex flex-col gap-6 mx-4 my-4 ">
                    <div className="flex flex-col gap-4 justify-center items-center mih-h-screen p-8 border rounded-lg shadow-md">
                        <div className="overflow-x-auto w-full">
                            {error ? (
                                <div>{error}</div>
                            ) : (
                                <DataTable columns={columns} data={orderItems} btnText="Buat Order Baru" type=""/>
                            )}
                        </div>
                    </div>
                </div>
                <div>
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