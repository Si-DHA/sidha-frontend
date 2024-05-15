import Drawer from "@/app/components/common/drawer";
import Footer from "@/app/components/common/footer"
import Cookies from 'js-cookie';
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { OrderUpdate } from "../../../../../app/components/model";
import { tipeBarang, tipeTruk } from "../../../../../app/components/data";
import { viewOrderItemById } from "@/pages/api/order/viewOrderItemById";
import { editOrder } from "@/pages/api/order/editOrder";
import { getOrderById } from "@/pages/api/order/getOrderById";
import SuccessAlert from "@/app/components/common/SuccessAlert";
import FailAlert from "@/app/components/common/FailAlert";
import { getPossibleRute } from "@/pages/api/order/getPossibleRute";

const EditOrderItemPage = () => {
    var userId = Cookies.get('idUser');
    var isLoggedIn = Cookies.get('isLoggedIn');
    var token = Cookies.get('token');
    const [userRole, setUserRole] = useState('');
    const [possibleRute, setPossibleRute] = useState([] as string[]);
    const [error, setError] = useState('' as string);
    const router = useRouter();
    const { idOrder, id } = router.query;
    const [orderItem, setOrderItem] = useState([])
    const [tanggalPengiriman, setTanggalPengiriman] = useState('');
    

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/login');
        }
        const role = Cookies.get('role');
        setUserRole(role || '');
        if (role !== 'KLIEN') {
            setError('Anda tidak diperbolehkan mengakses halaman ini');
        }

        const fetchData = async () => {
            try {
                const response = await getPossibleRute(userId);
                setPossibleRute(response);
            } catch (error: any) {
                setError(error.message);
            }
        }
        if (possibleRute.length === 0) {
            fetchData();
        }

    }, [userId, isLoggedIn])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getOrderById(idOrder, token); // Fetch order item by id
                setTanggalPengiriman(response?.tanggalPengiriman);
            } catch (error) {
                setError('Gagal memuat order item');
            }
        };
        if (idOrder && token) {
            fetchData(); // Fetch data only if id is available
        }
    }, [idOrder, token]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await viewOrderItemById(id); // Fetch order item by id
                if (response.isSuccess) {
                    setOrderItem([response.content]);
                } else {
                    // Handle error if order item is not found
                    setError(response.message);
                }
            } catch (error) {
                // Handle fetch error
                setError('Gagal memuat order item');
            }
        };
        if (id) {
            fetchData(); // Fetch data only if id is available
        }
    }, [id]);

    const [order, setOrder] = useState<OrderUpdate>({
        id: '',
        klienId: userId || '',
        orderItems: [],
        tanggalPengiriman: ''
    } as OrderUpdate
    );

    const handleOnChangeTipeBarang = (e: any) => {
        setOrderItem(currentItems =>
            currentItems.map(item =>
                item.id === id ? { ...item, tipeBarang: e.target.value } : item
            )
        );
    };


    const handleOnChangeKeterangan = (e: any, index:any) => {
        setOrderItem(currentItems =>
            currentItems.map(item =>
                item.id === id ? { ...item, keterangan: e.target.value } : item
            )
        );
    }

    const handleOnChangeIsPecahBelah = (e: any) => {
        setOrderItem(currentItems =>
            currentItems.map(item =>
                item.id === id ? { ...item, isPecahBelah: e.target.checked } : item
            )
        );
    }

    const handleOnChangeAlamatPengiriman = (e: any) => {
        setOrderItem(currentItems =>
            currentItems.map(item =>
                item.id === id ? {
                    ...item,
                    rute: item.rute.map((route: any, index: number) =>
                        index === 0 ? { ...route, alamatPengiriman: e.target.value } : route
                    )
                } : item
            )
        );
    };

    const handleOnChangeAlamatPenjemputan = (e: any) => {
        setOrderItem(currentItems =>
            currentItems.map(item =>
                item.id === id ? {
                    ...item,
                    rute: item.rute.map((route: any, index: number) =>
                        index === 0 ? { ...route, alamatPenjemputan: e.target.value } : route
                    )
                } : item
            )
        );
    };

    const [alert, setAlert] = useState('');
    const handleEdit = async () => {
        event.preventDefault();
        const updatedOrderItems = orderItem.map(item => ({
            ...item,
            orderItemId: id,
            rute: item.rute.map((route: { id: any; }) => ({
                ...route,
                ruteId: route.id
            }))
        }));
        order.id = idOrder;
        order.orderItems = updatedOrderItems;
        order.tanggalPengiriman = tanggalPengiriman;
        const validationResult = validateOrder();
        if (validationResult === true) {
            try {
                const response = await editOrder(order, token);
                setAlert(<SuccessAlert message="Berhasil memperbarui order item" />);
                setTimeout(() => {
                    router.push(`/order/klien/${idOrder}/${id}`)
                }, 3000);
            } catch (error: any) {
                setAlert(<FailAlert message="Gagal memperbarui order item" />);
                setTimeout(() => {
                    setAlert('');
                }, 3000);
            }
        } else {
            setAlert(<FailAlert message="Cek kembali input Anda!" />);
            setTimeout(() => {
                setAlert('');
            }, 3000);
        }
    }

    const validateOrder = () => {
        for (let i = 0; i < orderItem.length; i++) {
            if (orderItem[i].tipeBarang === '') {
                return `Tipe barang order ke-${i + 1} harus diisi`;
            }
            if (orderItem[i].tipeTruk === '') {
                return `Tipe truk order ke-${i + 1} harus diisi`;
            }
            for (let j = 0; j < orderItem[i].rute.length; j++) {
                if (orderItem[i].rute[j].alamatPenjemputan === '' || orderItem[i].rute[j].alamatPengiriman === '') {
                    return `Alamat penjemputan dan pengiriman order ke-${i + 1} harus diisi`;
                }
            }
        }
        return true;
    }

    const RuteOrderForm = ({ ruteIndex, orderItemIndex }: any) => {
        return (
            <div className="flex flex-col gap-4 w-full">

                <div key={ruteIndex} className="flex overflow-x-auto  gap-4">
                    <label className="form-control flex-grow gap-2">
                        <div className='flex flex-col'>
                            {ruteIndex === 0 ? <div className="label">
                                <span className="label-text">Rute Pengiriman<span className="text-s text-red-500">*</span></span>
                            </div> : null}
                            <select
                                disabled className="select select-bordered grow"
                                value={`${orderItem[orderItemIndex].rute[ruteIndex].source} - ${orderItem[orderItemIndex].rute[ruteIndex].destination}`}>
                                <option disabled>Pilih satu</option>
                                {possibleRute.map((rute, index) => (
                                    <option key={index}>
                                        {rute}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-row gap-4 ">
                            <input
                                value={orderItem.reduceRight.alamatPenjemputan}
                                type="text" className="input input-bordered grow" placeholder="Alamat Penjemputan" onBlur={(e) => handleOnChangeAlamatPenjemputan(e, orderItemIndex, ruteIndex)} defaultValue={orderItem[orderItemIndex].rute[ruteIndex].alamatPenjemputan}></input>
                            <input
                                value={orderItem.reduceRight.alamatPengiriman} type="text" className="input input-bordered grow" placeholder="Alamat Pengiriman" onBlur={(e) => handleOnChangeAlamatPengiriman(e, orderItemIndex, ruteIndex)} defaultValue={orderItem[orderItemIndex].rute[ruteIndex].alamatPengiriman}></input>
                        </div>
                    </label>
                </div>
            </div>
        );
    };

    const OrderItemForm = ({ index }: any) => {
        return (
            <div className="flex flex-col gap-2 justify-center items-center mih-h-screen p-8 border rounded-lg shadow-md">
                <label className="form-control w-full">
                    <div className="label">
                        <span className="label-text">Tipe Barang<span className="text-s text-red-500">*</span></span>

                    </div>
                    <select
                        value={orderItem[index].tipeBarang}
                        required className="select select-bordered" onChange={(e) => handleOnChangeTipeBarang(e, index)} defaultValue={orderItem[index].tipeBarang !== '' ? orderItem[index].tipeBarang : undefined}>
                        <option disabled selected>Pilih satu</option>
                        {tipeBarang.map((tipe, idx) => (
                            <option key={idx}>
                                {tipe}
                            </option>
                        ))}
                    </select>
                </label>
                <div className="form-control w-full">
                    <label className="label cursor-pointer">
                        <span className="label-text">Barang rentan pecah belah (fragile)?<span className="text-s text-red-500">*</span></span>
                        <input value={orderItem[index].isPecahBelah} type="checkbox" className="checkbox checkbox-primary" onChange={(e) => handleOnChangeIsPecahBelah(e, index)} defaultChecked={orderItem[index].isPecahBelah} />
                    </label>
                </div>
                <label className="form-control w-full">
                    <div className="label">
                        <span className="label-text">Tipe Truk<span className="text-s text-red-500">*</span></span>
                    </div>
                    <select
                        disabled
                        value={orderItem[index].tipeTruk}
                        className="select select-bordered" required onChange={(e) => handleOnChangeTipeTruk(e, index)} defaultValue={orderItem[index].tipeTruk !== '' ? orderItem[index].tipeTruk : undefined}>
                        <option disabled selected>Pilih satu</option>
                        {tipeTruk.map((tipe, index) => (
                            <option key={index} >
                                {tipe}
                            </option>
                        ))}
                    </select>
                </label>
                <label className="form-control w-full">
                    <div className="label">
                        <span className="label-text">Keterangan</span>
                    </div>
                    <textarea
                        value={orderItem[index].keterangan}
                        className="textarea textarea-bordered h-24" placeholder="Keterangan" 
                        onChange={(e) => handleOnChangeKeterangan(e, index)} 
                        defaultValue={orderItem[index].keterangan}></textarea>
                </label>
                {orderItem[index].rute.map((_: any, ruteIndex: any) => (
                    <RuteOrderForm key={ruteIndex} ruteIndex={ruteIndex} orderItemIndex={index} />
                ))}
            </div>
        );
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-between" data-theme="winter">
            <Drawer userRole={userRole}>
                <div className="flex flex-row px-12 text-[12px]  sm:text-[16px]">
                    {alert}
                </div>
                <div className="flex flex-col justify-center items-center mih-h-screen p-8">
                    <h1 className="text-3xl font-bold text-center ">Ubah Order Item</h1>
                    <h5 className="text-center text-l mb-2 mt-3">ID {id}</h5>
                </div>
                <div className="flex flex-col gap-6 mx-4 my-4 " >
                    <form className="form-control flex flex-col gap-6">
                        <div className="flex flex-col w-full">
                            <label className="label">
                                <span className="label-text">Tanggal Pengiriman<span className="text-s text-red-500">*</span></span>
                            </label>
                            <input disabled value={tanggalPengiriman.split(' ')[0]} className="input input-bordered" />
                        </div>
                        {orderItem.map((_, index) => (
                            <OrderItemForm key={index} index={index} />
                        ))}
                        <button className="btn btn-primary" onClick={handleEdit}>Perbarui Order Item</button>
                    </form>
                </div>
            </Drawer>
            <Footer />
        </main>
    );

}

export default EditOrderItemPage;