import Footer from "@/app/components/common/footer";
import Navbar from "@/app/components/common/navbar";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const LihatPenawaranHargaPage = () => {
    return (
        <main className={`flex min-h-screen flex-col ${inter.className}`} data-theme="cmyk">
            <Navbar />
            <div className="flex-1 py-6 px-4">
                <div className="container mx-auto">
                    <div className="text-center lg:text-left">
                        <h1 className="text-3xl font-bold">Daftar Penawaran Harga</h1>
                        <p className="py-6">Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.</p>
                    </div>
                    <div className="flex justify-between">
                        <div className="join">
                            <select className="select select-bordered join-item">
                                <option disabled selected>Asal Muat</option>
                                <option>Jakarta</option>
                                <option>Balikpapan</option>
                                <option>Bogor</option>
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
                                <th>Asal Muat</th>
                                <th>Tujuan</th>
                                <th>CDD</th>
                                <th>CDD Long</th>
                                <th>Wingbox</th>
                                <th>Fuso</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th>1</th>
                                <td>Jakarta</td>
                                <td>Bogor</td>
                                <td>1000000</td>
                                <td>2000000</td>
                                <td>4000000</td>
                                <td>8000000</td>
                            </tr>
                            <tr>
                                <th>2</th>
                                <td>Balikpapan</td>
                                <td>Padang</td>
                                <td>1000000</td>
                                <td>2000000</td>
                                <td>4000000</td>
                                <td>8000000</td>
                            </tr>
                            <tr>
                                <th>3</th>
                                <td>Jakarta</td>
                                <td>Jember</td>
                                <td>1000000</td>
                                <td>2000000</td>
                                <td>4000000</td>
                                <td>8000000</td>
                            </tr>
                            <tr>
                                <th>4</th>
                                <td>Bekasi</td>
                                <td>Bogor</td>
                                <td>1000000</td>
                                <td>2000000</td>
                                <td>4000000</td>
                                <td>8000000</td>
                            </tr>
                            <tr>
                                <th>5</th>
                                <td>Bekasi</td>
                                <td>Balikpapan</td>
                                <td>1000000</td>
                                <td>2000000</td>
                                <td>4000000</td>
                                <td>8000000</td>
                            </tr>
                            {/* Other rows */}
                        </tbody>
                    </table>
                </div>
            </div>
            <Footer />
        </main>
    );
}

export default LihatPenawaranHargaPage;
