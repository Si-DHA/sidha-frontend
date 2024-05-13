import Drawer from "@/app/components/common/drawer";
import Footer from "@/app/components/common/footer";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import { getOrderDetailBeforeCheckout } from "@/pages/api/order/getOrderDetailBeforeCheckout";
import { Order } from "../../../../app/components/model";
import DataTable from "@/app/components/common/datatable/DataTable";
import { createOrder } from "@/pages/api/order/createOrder";
import SuccessAlert from "@/app/components/common/SuccessAlert";
import FailAlert from "@/app/components/common/FailAlert";

const PurchaseOrderDetail = () => {

    var isLoggedIn = Cookies.get('isLoggedIn');
    var token = Cookies.get('token');
    const [userRole, setUserRole] = useState('');
    const [error, setError] = useState('');
    const [order, setOrder] = useState<Order | null>(null);
    const [orderItems, setOrderItems] = useState<any[]>([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null);

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/login');
        }

        const role = Cookies.get('role');
        setUserRole(role || '');

        if (role !== 'KLIEN') {
            setError('Anda tidak diperbolehkan mengakses halaman ini')
        }

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
                    throw new Error('Token tidak ditemukan');
                }
                const response = await getOrderDetailBeforeCheckout(order, token);
                setOrderItems(response.data);
                setTotalPrice(response.totalPrice);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }
        if (order !== null && orderItems.length === 0) {
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

    const handleCheckout = async () => {
        try {
            if (!token) {
                throw new Error('Token not found');
            }

            if (order === null) {
                throw new Error('Order not found');
            }

            const response = await createOrder(order, token);
            if (response !== null) {
                setAlert(<SuccessAlert message="Order berhasil dibuat" />);
                setTimeout(() => {
                    router.push('/order/klien');
                }, 3000);
            }

        } catch (error: any) {
            setAlert(<FailAlert message={error.message || "Gagal checkout order"} />);
            setTimeout(() => {
                setAlert(null);
            }, 3000);
            setError(error.message);
        }
    }

    const formatPrice = (price: number): string => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price);
    };

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
            Cell: ({ value }) => formatPrice(value),
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
                            <button className="btn btn-success px-6" onClick={handleCheckout}>Checkout Sekarang</button>
                        </form>
                    </div>
                </div>
            </dialog>
            <Drawer userRole={userRole}>
                <div className="flex flex-row px-12 text-[12px]  sm:text-[16px]">
                    {alert}
                </div>
                <div className="flex flex-col gap-2 justify-center items-center mih-h-screen p-8">
                    <h1 className="text-3xl font-bold text-center ">Detail Purchase Order</h1>
                    {order?.tanggalPengiriman &&
                        <h2 className="text-l text-center ">Tanggal Pengiriman: {(order?.tanggalPengiriman).split(' ')[0]}</h2>
                    }
                </div>
                <div className="flex flex-col gap-6 mx-4 my-4 ">
                    <div className="flex flex-col gap-4 justify-center items-center mih-h-screen p-8 border rounded-lg shadow-md">
                        <div className="overflow-x-auto w-full">
                            {error ? (
                                <div>{error}</div>
                            ) : (
                                <DataTable columns={columns} data={orderItems} btnText="Buat Order Baru" type="checkout" loading={loading} biayaPengiriman={formatPrice(totalPrice)} />
                            )}
                        </div>
                    </div>
                    <div>
                        <div className="flex flex-row gap-4 ">
                            <button className="btn" onClick={handleBack}>Kembali</button>
                            <button className="btn btn-primary grow" onClick={handleModal}>Checkout Purchase Order</button>
                        </div>
                    </div>
                </div>
            </Drawer>
            <Footer />
        </main>
    );
}

export default PurchaseOrderDetail