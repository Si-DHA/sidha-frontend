import React, { useState, useEffect } from 'react';
import router from 'next/router';
import Cookies from 'js-cookie';
import Drawer from "@/app/components/common/drawer";
import Footer from "@/app/components/common/footer";
import DataTable from "@/app/components/common/datatable/DataTable";
import { getTawaranKerjaAccepted } from '@/pages/api/tawaran-kerja/getTawaranKerjaAccepted';

const AcceptedOrderItemsIndexPage = () => {
    const [tawaranKerja, setTawaranKerja] = useState([]);
    const [loading, setLoading] = useState(true);
    const sopirId = Cookies.get('idUser');

    useEffect(() => {
        setLoading(true);
        getTawaranKerjaAccepted().then(data => {
            if (data && Array.isArray(data)) {
                setTawaranKerja(data.map(tawaran => ({
                    ...tawaran.orderItem,
                    source: tawaran.orderItem.rute?.[0]?.source ?? 'N/A',
                    destination: tawaran.orderItem.rute?.[0]?.destination ?? 'N/A',
                    isPecahBelah: tawaran.orderItem.isPecahBelah ?? false,
                    isDikonfirmasiKaryawan: tawaran.isDikonfirmasiKaryawan ?? false,
                    price: tawaran.orderItem.price ?? 'N/A',
                    createdDate: tawaran.orderItem.orderItemHistories?.[0]?.createdDate
                        ? new Date(tawaran.orderItem.orderItemHistories[0].createdDate).toLocaleString('id-ID')
                        : 'N/A'
                })));
            } else {
                console.error('Invalid format for order items:', data);
            }
        }).catch(error => {
            console.error('Fetching error:', error);
        }).finally(() => {
            setLoading(false);
        });
    }, []);

    const columns = [
        { Header: 'Asal', accessor: 'source' },
        { Header: 'Tujuan', accessor: 'destination' },
        { Header: 'Mudah Pecah', accessor: 'isPecahBelah', Cell: ({ value }) => value ? 'Ya' : 'Tidak' },
        { Header: 'Harga', accessor: 'price', Cell: ({ value }) => value !== 'N/A' ? `Rp${parseInt(value).toLocaleString('id-ID')}` : 'N/A' },
        { Header: 'Sopir Confirmed', accessor: 'isDikonfirmasiKaryawan', Cell: ({ value }) => value ? 'Ya' : 'Tidak' },
        { Header: 'Tanggal Pembuatan', accessor: 'createdDate' },
        {
            Header: 'Details',
            accessor: 'id',
            Cell: ({ value }) => (
                <button
                    onClick={() => router.push(`/tawarankerja/karyawan/detail/${value}`)}
                    className="btn btn-primary"
                >
                    Detail
                </button>
            ),
        },
    ];

    return (
        <>
            <Drawer userRole='userRole'>
            <main className="flex flex-col items-center justify-between" data-theme="winter">
                    <h2 className="text-2xl font-bold mb-1">Tawaran Kerja</h2>
                    <h5 className="text-l mb-2">Segera konfirmasi sopir untuk pengantaran dibawah!</h5>
                    <DataTable
                        data={tawaranKerja}
                        columns={columns}
                        loading={loading}
                        NoDataComponent={() => <div>No accepted job offers</div>}
                    />
                </main>
                <Footer />
            </Drawer>
        </>
    );
};

export default AcceptedOrderItemsIndexPage;


// import React, { useState, useEffect } from 'react';
// import router, { useRouter } from 'next/router';
// import Cookies from 'js-cookie';
// import Drawer from "@/app/components/common/drawer";
// import Footer from "@/app/components/common/footer";
// import DataTable from "@/app/components/common/datatable/DataTable";
// import { getTawaranKerja } from '@/pages/api/tawaran-kerja/getTawaranKerja';

// const OrderItemsIndexPage = () => {
//     const [orderItems, setOrderItems] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [location, setLocation] = useState('');
//     const [selectedOfferId, setSelectedOfferId] = useState('');

//     useEffect(() => {
//         setLoading(true);
//         getTawaranKerja().then(data => {
//             if (data && Array.isArray(data)) { // Ensure data is an array
//                 setOrderItems(data.map(item => ({
//                     ...item,
//                     source: item.rute.length > 0 ? item.rute[0].source : 'N/A',
//                     destination: item.rute.length > 0 ? item.rute[0].destination : 'N/A',
//                     isPecahBelah: item.isPecahBelah,
//                     price: item.price || 'N/A',
//                     createdDate: item.orderItemHistories.length > 0 ? new Date(item.orderItemHistories[0].createdDate).toLocaleString('id-ID') : 'N/A'
//                 })));
//             } else {
//                 console.error('Invalid format for order items:', data);
//             }
//         }).catch(error => {
//             console.error('Fetching error:', error);
//         }).finally(() => {
//             setLoading(false);
//         });
//     }, []);

//     const columns = [
//         { Header: 'Source', accessor: 'source' },
//         { Header: 'Destination', accessor: 'destination' },
//         { Header: 'Is Fragile', accessor: 'isPecahBelah', Cell: ({ value }) => value ? 'Yes' : 'No' },
//         { Header: 'Price', accessor: 'price', Cell: ({ value }) => value !== 'N/A' ? `Rp${parseInt(value).toLocaleString('id-ID')}` : 'N/A' },
//         { Header: 'Created Date', accessor: 'createdDate' },
//         {
//             Header: 'Details',
//             accessor: 'id',
//             Cell: ({ value }) => (
//                 <button
//                     onClick={() => router.push(`/tawarankerja/karyawan/detail/${value}`)}
//                     className="btn btn-primary"
//                 >
//                     Detail
//                 </button>
//             ),
//         },
//     ];

//     return (
//         <>
//             <Drawer userRole='userRole'>
//                 <main className="container mx-auto p-4">
//                     <h2 className="text-2xl font-bold mb-2">Available Job Offers</h2>
//                     <DataTable
//                         data={orderItems}
//                         columns={columns}
//                         loading={loading}
//                         NoDataComponent={() => <div>No available order items</div>}
//                     />
//                 </main>
//                 <Footer />
//             </Drawer>
//         </>
//     );
// };

// export default OrderItemsIndexPage;
