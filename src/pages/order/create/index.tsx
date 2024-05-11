import Drawer from "@/app/components/common/drawer";
import Footer from "@/app/components/common/footer"
import Cookies from 'js-cookie';
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Order, OrderItem, Rute } from "../../../app/components/model";
import { tipeBarang, tipeTruk } from "../../../app/components/data";
import { getPossibleRute } from "@/pages/api/order/getPossibleRute";

const CreatePurchaseOrderPage = () => {

    var userId = Cookies.get('idUser');
    var isLoggedIn = Cookies.get('isLoggedIn');
    const [userRole, setUserRole] = useState('');
    const [possibleRute, setPossibleRute] = useState([] as string[]);
    const [error, setError] = useState('' as string);
    const router = useRouter();

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/login');
        }
        const role = Cookies.get('role');
        setUserRole(role || '');

        const fetchData = async () => {
            try {
                if (!userId) {
                    throw new Error('User ID not found');
                }
                const response = await getPossibleRute(userId);
                setPossibleRute(response);
            } catch (error: any) {
                setError(error.message);
            }
        }
        if (possibleRute.length === 0) {
            fetchData();
        }
    },)

    const [order, setOrder] = useState<Order>({
        klienId: userId || '',
        tanggalPengiriman: '',
        orderItems: []
    } as Order
    );




    const [orderItem, setOrderItem] = useState([
        {
            isPecahBelah: false,
            tipeBarang: '',
            tipeTruk: '',
            keterangan: '',
            rute: [
                {
                    source: '',
                    destination: '',
                    alamatPengiriman: '',
                    alamatPenjemputan: ''
                } as Rute
            ]
        } as OrderItem
    ]);

    // useEffect(() => {
    //     if (router.query.order !== undefined) {
    //         setOrder(JSON.parse(router.query.order as string));
    //         setOrderItem(JSON.parse(router.query.order as string).orderItems);
    //     }
    // });

    const handleAddOrderItem = () => {
        setOrderItem([...orderItem, {
            isPecahBelah: false,
            tipeBarang: '',
            tipeTruk: '',
            keterangan: '',
            rute: [
                {
                    source: '',
                    destination: '',
                    alamatPengiriman: '',
                    alamatPenjemputan: ''
                } as Rute
            ]
        } as OrderItem
        ]);
    };

    const handleRemoveOrderItem = (index: any) => {
        if (orderItem.length > 1) {
            setOrderItem(orderItem.filter((_, i) => i !== index));
        }
    }

    const handleAddRute = (orderItemIndex: any) => {
        const newOrderItem = [...orderItem];
        newOrderItem[orderItemIndex].rute.push({
            source: '',
            destination: '',
            alamatPengiriman: '',
            alamatPenjemputan: ''
        } as Rute);
        setOrderItem(newOrderItem);
    }

    const handleRemoveRute = (ruteIndex: any, orderItemIndex: any) => {
        const newOrderItem = [...orderItem];
        newOrderItem[orderItemIndex].rute = newOrderItem[orderItemIndex].rute.filter((_, i) => i !== ruteIndex);
        setOrderItem(newOrderItem);
    }

    const [errorDate, setErrorDate] = useState('');
    const handleDateChange = (e: any) => {
        const today = new Date();
        const selectedDate = new Date(e.target.value);

        if (selectedDate < today) {
            setErrorDate('Tanggal pengiriman minimal H-1 dari hari ini');
        } else {
            setErrorDate('');
            order.tanggalPengiriman = e.target.value;
        }
    }

    const handleOnChangeTipeBarang = (e: any, index: any) => {
        orderItem[index].tipeBarang = e.target.value;
    }

    const handleOnChangeTipeTruk = (e: any, index: any) => {
        orderItem[index].tipeTruk = e.target.value;
    }

    const handleOnChangeKeterangan = (e: any, index: any) => {
        orderItem[index].keterangan = e.target.value;
    }

    const handleOnChangeIsPecahBelah = (e: any, index: any) => {
        orderItem[index].isPecahBelah = e.target.checked;
    }

    const handleOnChangeSourceAndDestination = (e: any, orderItemIndex: any, ruteIndex: any) => {
        const sourceAndDestination = e.target.value.split(' - ');
        orderItem[orderItemIndex].rute[ruteIndex].source = sourceAndDestination[0];
        orderItem[orderItemIndex].rute[ruteIndex].destination = sourceAndDestination[1];
    }

    const handleOnChangeAlamatPengiriman = (e: any, orderItemIndex: any, ruteIndex: any) => {
        orderItem[orderItemIndex].rute[ruteIndex].alamatPengiriman = e.target.value;
    }

    const handleOnChangeAlamatPenjemputan = (e: any, orderItemIndex: any, ruteIndex: any) => {
        orderItem[orderItemIndex].rute[ruteIndex].alamatPenjemputan = e.target.value;
    }

    const [alert, setAlert] = useState('' as string);
    const handleDetailOrder = () => {
        order.orderItems = orderItem;
        const validationResult = validateOrder();
        if (validationResult === true) {
            router.push({
                pathname: '/order/create/detail',
                query: { order: JSON.stringify(order) }
            });
        } else {
            setAlert(validationResult);
        }
    }

    useEffect(() => {
        if (alert) {
            setTimeout(() => {
                setAlert('');
            }, 3000);
        }
    }, [alert]);

    const validateOrder = () => {
        if (order.tanggalPengiriman === '') {
            return 'Tanggal pengiriman harus diisi';
        }
        for (let i = 0; i < orderItem.length; i++) {
            if (orderItem[i].tipeBarang === '') {
                return `Tipe barang order ke-${i + 1} harus diisi`;
            }
            if (orderItem[i].tipeTruk === '') {
                return `Tipe truk order ke-${i + 1} harus diisi`;
            }
            for (let j = 0; j < orderItem[i].rute.length; j++) {
                if (orderItem[i].rute[j].source === '' || orderItem[i].rute[j].destination === '') {
                    return `Rute order ke-${i + 1} harus diisi`;
                }
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
                            <select className="select select-bordered grow" onChange={(e) => handleOnChangeSourceAndDestination(e, orderItemIndex, ruteIndex)} defaultValue={orderItem[orderItemIndex].rute[ruteIndex].source !== '' ? `${orderItem[orderItemIndex].rute[ruteIndex].source} - ${orderItem[orderItemIndex].rute[ruteIndex].destination}` : undefined}>
                                <option disabled selected>Pilih satu</option>
                                {possibleRute.map((rute, index) => (
                                    <option key={index}>
                                        {rute}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-row gap-4 ">
                            <input type="text" className="input input-bordered grow" placeholder="Alamat Penjemputan" onChange={(e) => handleOnChangeAlamatPenjemputan(e, orderItemIndex, ruteIndex)} defaultValue={orderItem[orderItemIndex].rute[ruteIndex].alamatPenjemputan}></input>
                            <input type="text" className="input input-bordered grow" placeholder="Alamat Pengiriman" onChange={(e) => handleOnChangeAlamatPengiriman(e, orderItemIndex, ruteIndex)} defaultValue={orderItem[orderItemIndex].rute[ruteIndex].alamatPengiriman}></input>
                        </div>
                    </label>
                    {ruteIndex > 0 && (
                        <div className="flex btn btn-error" onClick={() => handleRemoveRute(ruteIndex, orderItemIndex)}>Hapus Rute</div>
                    )}
                </div>
            </div>
        );
    };

    const OrderItemForm = ({ index }: any) => {
        return (
            <div className="flex flex-col gap-2 justify-center items-center mih-h-screen p-8 border rounded-lg shadow-md">
                <div className="flex justify-between w-full">
                    <span className="label-text font-bold">Item Order ke-{index + 1}</span>
                </div>
                <label className="form-control w-full">
                    <div className="label">
                        <span className="label-text">Tipe Barang<span className="text-s text-red-500">*</span></span>

                    </div>
                    <select required className="select select-bordered" onChange={(e) => handleOnChangeTipeBarang(e, index)} defaultValue={orderItem[index].tipeBarang !== '' ? orderItem[index].tipeBarang : undefined}>
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
                        <input type="checkbox" className="checkbox checkbox-primary" onChange={(e) => handleOnChangeIsPecahBelah(e, index)} defaultChecked={orderItem[index].isPecahBelah} />
                    </label>
                </div>
                <label className="form-control w-full">
                    <div className="label">
                        <span className="label-text">Tipe Truk<span className="text-s text-red-500">*</span></span>

                    </div>
                    <select className="select select-bordered" required onChange={(e) => handleOnChangeTipeTruk(e, index)} defaultValue={orderItem[index].tipeTruk !== '' ? orderItem[index].tipeTruk : undefined}>
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
                    <textarea className="textarea textarea-bordered h-24" placeholder="Keterangan" onChange={(e) => handleOnChangeKeterangan(e, index)} defaultValue={orderItem[index].keterangan}></textarea>
                </label>
                {orderItem[index].rute.map((_, ruteIndex) => (
                    <RuteOrderForm key={ruteIndex} ruteIndex={ruteIndex} orderItemIndex={index} />
                ))}
                {index > 0 && (
                    <div className="btn btn-error w-full" onClick={() => handleRemoveOrderItem(index)}>Hapus Order Item</div>
                )}
            </div>
        );
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-between" data-theme="winter">
            <Drawer userRole={userRole}>
                <div className="flex flex-col justify-center items-center mih-h-screen p-8">
                    <h1 className="text-3xl font-bold text-center ">Buat Purchase Order</h1>
                </div>
                <div className="flex flex-col gap-6 mx-4 my-4 " >
                    <form className="form-control flex flex-col gap-6">
                        <div className="flex flex-col w-full">
                            <label className="label">
                                <span className="label-text">Tanggal Pengiriman<span className="text-s text-red-500">*</span></span>
                            </label>
                            <input type="date" required className="input input-bordered" onChange={handleDateChange} />
                            {errorDate && <div className="text-sm text-red-500">{errorDate}</div>}
                        </div>
                        {orderItem.map((_, index) => (
                            <OrderItemForm key={index} index={index} />
                        ))}
                        <div className="btn" onClick={handleAddOrderItem}>Tambah Order Item</div>
                        <button className="btn btn-primary" onClick={handleDetailOrder} type="button">Lihat Rincian Order</button>
                    </form>
                </div>
            </Drawer>
            {alert && <div role="alert" className="alert alert-warning" style={
                {
                    position: 'fixed',
                    bottom: '4%',
                    right: '2%', // Menempatkan alert di pojok kanan bawah
                    // transform: 'translate(-50%, -50%)', // Menggeser alert sejajar dengan titik tengahnya
                    zIndex: 9999,
                    width: 'auto'
                }
            }>
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                <span>{alert}</span>
                {/* tombol close */}
                <button className="btn btn-sm btn-ghost" onClick={() => setAlert('')}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current h-6 w-6" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>}
            <Footer />
        </main>
    );

}

export default CreatePurchaseOrderPage