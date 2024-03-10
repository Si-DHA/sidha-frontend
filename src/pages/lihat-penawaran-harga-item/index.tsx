import Footer from "@/app/components/common/footer";
import Navbar from "@/app/components/common/navbar";
import { Inter } from "next/font/google";
import React, { useEffect, useState } from 'react';
import { viewAllPenawaranHargaItem } from "../api/penawaran-harga-item/viewAllPenawaranHargaItem";
import { getPenawaranHargaItemBySource } from "../api/penawaran-harga-item/getPenawaranHargaItemBySource";

const inter = Inter({ subsets: ["latin"] });

interface PenawaranHargaItem {
    idPenawaranHargaItem: string;
    source: string;
    destination: string;
    cddPrice: number;
    cddLongPrice: number;
    wingboxPrice: number;
    fusoPrice: number;
}

const LihatPenawaranHargaItemPage = () => {
    const [error, setError] = useState('');
    const [penawaranHargaItemData, setPenawaranHargaItemData] = useState<PenawaranHargaItem[]>([]);
    const [selectedSource, setSelectedSource] = useState('');
    const [allSources, setAllSources] = useState<string[]>([]);

    useEffect(() => {
        fetchData(); // Call fetchData function when component mounts
    }, []);

    const fetchData = async () => {
        try {
            const penawaranHargaItemDataResponse: PenawaranHargaItem[] = await viewAllPenawaranHargaItem(); // Explicitly define type
            setPenawaranHargaItemData(penawaranHargaItemDataResponse);
            
            // Extract unique sources and update the state
            const uniqueSourcesSet = new Set(penawaranHargaItemDataResponse.map(item => item.source));
            const uniqueSourcesArray: string[] = Array.from(uniqueSourcesSet); // Explicitly define type
            setAllSources(uniqueSourcesArray);
        } catch (error: any) {
            setError(error.message);
        }
    };

    const handleSearch = async () => {
        try {
            if (selectedSource === 'All') {
                fetchData(); // Fetch all data if "All" is selected
            } else if (selectedSource) {
                const penawaranHargaItemDataResponse = await getPenawaranHargaItemBySource(selectedSource);
                setPenawaranHargaItemData(penawaranHargaItemDataResponse);
            } else {
                // Handle no source selected
                setError('Please select a source.');
            }
        } catch (error: any) {
            setError(error.message);
        }
    };

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
                            <select className="select select-bordered join-item" onChange={(e) => setSelectedSource(e.target.value)} value={selectedSource}>
                                <option disabled selected>Asal Muat</option>
                                <option value="All">All</option> {/* Add "All" option */}
                                {allSources.map((source, index) => (
                                    <option key={index} value={source}>{source}</option>
                                ))}
                            </select>
                            <div className="indicator">
                                <button className="btn join-item" onClick={handleSearch}>Cari</button>
                            </div>
                        </div>

                        <button className="btn" onClick={() => (document.getElementById('baca_ketentuan') as HTMLDialogElement)?.showModal()}>Baca Ketentuan</button>
                        <dialog id="baca_ketentuan" className="modal">
                            <div className="modal-box">
                                <h3 className="font-bold text-lg mb-4">Ketentuan Penawaran</h3>
                                <p>1. Tarif tidak termasuk PPN dan asuransi muatan</p>
                                <p>2. Tarif belum termasuk muat (bila ada)</p>
                                <p>3. Kehilangan atau kerusakan akibat force majeur seperti (kebakaran, bencana alam, dll) tidak ditanggung oleh transporter</p>
                                <p>4. Pembayaran DP uang jalan 60% dan sisa tagihan setelah invoice diterima </p>
                                <p>5. Multidrop Rp200.000,- per titik</p>
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
                            {penawaranHargaItemData.map((item, index) => (
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