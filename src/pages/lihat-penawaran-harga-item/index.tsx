import Footer from "@/app/components/common/footer";
import Navbar from "@/app/components/common/navbar";
import { Inter } from "next/font/google";
import React, { useEffect, useState } from 'react';
import { viewAllPenawaranHargaItem } from "../api/penawaran-harga-item/viewAllPenawaranHargaItem";

const inter = Inter({ subsets: ["latin"] });

const LihatPenawaranHargaItemPage = () => {
    const [error, setError] = useState('');

    interface PenawaranHargaItem {
        idPenawaranHargaItem: string;
        source: string;
        destination: string;
        cddPrice: number;
        cddLongPrice: number;
        wingboxPrice: number;
        fusoPrice: number;
    }

    const [penawaranHargaItemData, setPenawaranHargaItemData] = useState<PenawaranHargaItem[]>([]);
    const dummyData = [
        { idPenawaranHargaItem: '1', source: 'Jakarta', destination: 'Bogor', cddPrice: 1000000, cddLongPrice: 2000000, wingboxPrice: 4000000, fusoPrice: 8000000 },
        // Add more dummy data as needed
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const penawaranHargaItemDataResponse = await viewAllPenawaranHargaItem();
                setPenawaranHargaItemData(penawaranHargaItemDataResponse); // Set the data without accessing the 'content' property
                console.log(penawaranHargaItemDataResponse);
                console.log(penawaranHargaItemData);
            } catch (error: any) {
                setError(error.message);
            }
        };
        fetchData(); // Call fetchData function when component mounts
    }, []);

    return (
        <main className={`flex min-h-screen flex-col ${inter.className}`} data-theme="cmyk">
            <Navbar />
            <div className="flex-1 py-6 px-4">
                <div className="container mx-auto">
                    <div className="text-center lg:text-left">
                        <h1 className="text-3xl font-bold">Daftar Penawaran Harga Item</h1>
                        <p className="py-6">Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.</p>
                    </div>
                    <div className="flex justify-between">
                        <div className="join">
                            <select className="select select-bordered join-item">
                                <option disabled selected>Asal Muat</option>
                                {penawaranHargaItemData.map((item, index) => (
                                    <option key={index}>{item.source}</option>
                                ))}
                            </select>
                            <div className="indicator">
                                <button className="btn join-item">Cari</button>
                            </div>
                        </div>

                        <button className="btn" onClick={() => (document.getElementById('baca_ketentuan') as HTMLDialogElement)?.showModal()}>Baca Ketentuan</button>
                        <dialog id="baca_ketentuan" className="modal">
                            <div className="modal-box">
                                <h3 className="font-bold text-lg">Ketentuan Penawaran</h3>
                                <p className="py-4">Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.</p>
                                <div className="modal-action">
                                    <form method="dialog">
                                        <button className="btn">Ya, Saya Mengerti</button>
                                    </form>
                                </div>
                            </div>
                        </dialog>
                    </div>
                    <table className="table table-zebra table-fixed">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>ID</th>
                                <th>Asal Muat</th>
                                <th>Tujuan</th>
                                <th>CDD</th>
                                <th>CDD Long</th>
                                <th>Wingbox</th>
                                <th>Fuso</th>
                            </tr>
                        </thead>
                        <tbody>
                            {penawaranHargaItemData && penawaranHargaItemData.map((item, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item.idPenawaranHargaItem}</td>
                                    <td>{item.source}</td>
                                    <td>{item.destination}</td>
                                    <td>{item.cddPrice}</td>
                                    <td>{item.cddLongPrice}</td>
                                    <td>{item.wingboxPrice}</td>
                                    <td>{item.fusoPrice}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <Footer />
        </main>
    );
}

export default LihatPenawaranHargaItemPage;