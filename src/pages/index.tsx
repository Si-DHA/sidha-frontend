import Layout from "@/app/components/common/layout";
import { Inter } from "next/font/google";
import React, { useState, useEffect } from 'react';
import { getAllFAQ } from '@/pages/api/faq/getAllFAQ';

const inter = Inter({ subsets: ["latin"] });

const IndexPage = () => {
    const [faqs, setFaqs] = useState([]);

    useEffect(() => {
        async function fetchFAQs() {
            try {
                const data = await getAllFAQ();
                setFaqs(data);
            } catch (error) {
                console.error('Failed to fetch FAQs', error);
            }
        }

        fetchFAQs();
    }, []);

    return (
        <main className={`flex min-h-screen flex-col ${inter.className}`} data-theme="cmyk">
            <Layout title="Home | Next.js + TypeScript Example">
                <Visi />
                <Services />
                <Featured />
                <Customer />
                <FAQ data={faqs} />
            </Layout>
        </main>
    );
}

export default IndexPage;


/// Page Sections
const Visi = () => (<div className="relative pt-16 pb-32 flex content-center items-center justify-center"
    style={{
        minHeight: "75vh"
    }}>
    <div className="absolute top-0 w-full h-full bg-center bg-cover"
        style={{
            backgroundImage: "url('https://www.3pe.co.id/wp-content/uploads/2019/06/About-1-Logistic-company-in-Malaysia-Sea-Freight-Air-Freight-Transportation.png')"
        }}>
        <span id="blackOverlay" className="w-full h-full absolute opacity-75 bg-black"></span>
    </div>
    <div className="container relative mx-auto">
        <div className="items-center flex flex-wrap">
            <div className="w-full lg:w-6/12 px-4 ml-auto mr-auto text-center">
                <div className="pr-12">
                    <h1 className="text-white font-semibold text-5xl">
                        PT Dwi Harapan Agung
                    </h1>
                    <p className="mt-4 text-lg text-gray-300">
                        Kirim Mudah dan Aman dengan SiDHA:
                    </p>
                    <p className="text-lg text-gray-300">
                        Layanan Pengiriman Terbaik di Indonesia!
                    </p>
                    <p className="text-lg text-gray-300">
                        Jaminan Barang Sampai 100%
                    </p>
                </div>
            </div>

        </div>
    </div>
    <div
        className="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden"
        style={{ height: "70px" }}
    >
        <svg
            className="absolute bottom-0 overflow-hidden"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            version="1.1"
            viewBox="0 0 2560 100"
            x="0"
            y="0"
        >
            <polygon
                className="text-blue-900 fill-current"
                points="2560 0 2560 100 0 100"
            ></polygon>
        </svg>
    </div>
</div>)

const Services = () => <section className="pb-20 bg-blue-900 -mt-24">
    <div className="container mx-auto px-4">
        <div className="flex flex-wrap">
            <div className="lg:pt-12 pt-6 w-full md:w-4/12 px-4 text-center">
                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                    <div className="px-4 py-5 flex-auto">
                        <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-orange-600">
                            <i className="fas fa-award"></i>
                        </div>
                        <h6 className="text-xl font-semibold">Cepat</h6>
                        <p className="mt-2 mb-4 text-blue-900">
                            Menyediakan pengiriman barang dengan kecepatan luar biasa melalui jaringan distribusi yang efisien.
                        </p>
                    </div>
                </div>
            </div>

            <div className="w-full md:w-4/12 px-4 text-center">
                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                    <div className="px-4 py-5 flex-auto">
                        <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-orange-600">
                            <i className="fas fa-retweet"></i>
                        </div>
                        <h6 className="text-xl font-semibold">
                            Mudah
                        </h6>
                        <p className="mt-2 mb-4 text-blue-900">
                            Membuat pengiriman barang menjadi sederhana dengan platform yang ramah pengguna.
                        </p>
                    </div>
                </div>
            </div>

            <div className="pt-6 w-full md:w-4/12 px-4 text-center">
                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                    <div className="px-4 py-5 flex-auto">
                        <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-orange-600">
                            <i className="fas fa-fingerprint"></i>
                        </div>
                        <h6 className="text-xl font-semibold">
                            Terjangkau
                        </h6>
                        <p className="mt-2 mb-4 text-blue-900">
                            Menawarkan layanan logistik berkualitas dengan harga yang kompetitif, menjembatani kesenjangan antara kebutuhan dan anggaran.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

const Featured = () => <section className="relative py-20">
    <div
        className="bottom-auto top-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden -mt-20"
        style={{ height: "80px" }}
    >
        <svg
            className="absolute bottom-0 overflow-hidden"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            version="1.1"
            viewBox="0 0 2560 100"
            x="0"
            y="0"
        >
            <polygon
                className="text-blue-900 fill-current"
                points="2560 0 2560 100 0 100"
            ></polygon>
        </svg>
    </div>

    <div className="container mx-auto px-4">
        <div className="items-center flex flex-wrap">
            <div className="w-full md:w-4/12 ml-auto mr-auto px-4">
                <img
                    alt="..."
                    className="max-w-full rounded-lg shadow-lg"
                    src="https://hamada-logistic.com/wp-content/uploads/2023/11/sampul-Pengertian-Trucking-Jenis-jenis-dan-Keuntungan-Layanan-Trucking-.png"
                />
            </div>
            <div className="w-full md:w-5/12 ml-auto mr-auto px-4">
                <div className="md:pr-12">
                    <div className="text-pink-600 p-3 text-center inline-flex items-center justify-center w-16 h-16 mb-6 shadow-lg rounded-full bg-orange-600">
                        <i className="fas fa-rocket text-xl"></i>
                    </div>
                    <h3 className="text-4xl font-bold">
                        Layanan B2B
                    </h3>
                    <p className="mt-4 leading-relaxed text-blue-900">
                        PT Dwi Harapan Agung menyediakan berbagai jenis armada sesuai kebutuhan perusahaan Anda.
                    </p>
                    <ul className="list-none mt-6">
                        <li className="py-2">
                            <div className="flex items-center">
                                <div>
                                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-pink-600 bg-orange-600 mr-3">
                                        <i className="fas fa-fingerprint"></i>
                                    </span>
                                </div>
                                <div>
                                    <h4 className="text-blue-900">
                                        CDD (14 - 20 kubik)
                                    </h4>
                                </div>
                            </div>
                        </li>
                        <li className="py-2">
                            <div className="flex items-center">
                                <div>
                                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-pink-600 bg-orange-600 mr-3">
                                        <i className="fas fa-fingerprint"></i>
                                    </span>
                                </div>
                                <div>
                                    <h4 className="text-blue-900">
                                        CDD Long (22 - 28 kubik)
                                    </h4>
                                </div>
                            </div>
                        </li>
                        <li className="py-2">
                            <div className="flex items-center">
                                <div>
                                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-pink-600 bg-orange-600 mr-3">
                                        <i className="fas fa-fingerprint"></i>
                                    </span>
                                </div>
                                <div>
                                    <h4 className="text-blue-900">
                                    Fuso (28 - 36 kubik)
                                    </h4>
                                </div>
                            </div>
                        </li>
                        <li className="py-2">
                            <div className="flex items-center">
                                <div>
                                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-pink-600 bg-orange-600 mr-3">
                                        <i className="fas fa-fingerprint"></i>
                                    </span>
                                </div>
                                <div>
                                    <h4 className="text-blue-900">
                                        Wingbox (60 - 80 kubik)
                                    </h4>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</section>

const Customer = () => <section className="pt-20 pb-48">
    <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center text-center mb-16">
            <div className="w-full lg:w-6/12 px-4">
                <h2 className="text-4xl font-bold">
                    Apa Kata Mereka?
                </h2>
            </div>
        </div>
        <div className="flex flex-wrap">
            <div className="w-full md:w-6/12 lg:w-3/12 lg:mb-0 mb-12 px-4">
                <div className="px-6">
                    <img
                        alt="..."
                        src="https://imageio.forbes.com/specials-images/imageserve/603e8af3c4ddcfbbdfa14153/0x0.jpg?format=jpg&crop=918,919,x236,y19,safe&height=416&width=416&fit=bounds"
                        className="shadow-lg rounded-full max-w-full mx-auto"
                        style={{ maxWidth: "120px" }}
                    />
                    <div className="pt-6 text-center">
                        <h5 className="text-xl font-bold">
                            Ye Guofu
                        </h5>
                        <p className="mt-1 text-sm text-blue-900">
                            PT DHA sudah menjadi kepercayaan perusahaan saya sejak tahun 2017. Kualitas dan harga selalu terdepan.
                        </p>
                    </div>
                    <div className="pt-2">
                        <div className="flex justify-center">
                            <div className="rating">
                                <input type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" />
                                <input type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" />
                                <input type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" />
                                <input type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" />
                                <input type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" checked />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full md:w-6/12 lg:w-3/12 lg:mb-0 mb-12 px-4">
                <div className="px-6">
                    <img
                        alt="..."
                        src="https://imageio.forbes.com/specials-images/imageserve/603e8af3c4ddcfbbdfa14153/0x0.jpg?format=jpg&crop=918,919,x236,y19,safe&height=416&width=416&fit=bounds"
                        className="shadow-lg rounded-full max-w-full mx-auto"
                        style={{ maxWidth: "120px" }}
                    />
                    <div className="pt-6 text-center">
                        <h5 className="text-xl font-bold">
                            Ye Guofu
                        </h5>
                        <p className="mt-1 text-sm text-blue-900">
                            PT DHA sudah menjadi kepercayaan perusahaan saya sejak tahun 2017. Kualitas dan harga selalu terdepan.
                        </p>
                    </div>
                    <div className="pt-2">
                        <div className="flex justify-center">
                            <div className="rating">
                                <input type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" />
                                <input type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" />
                                <input type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" />
                                <input type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" />
                                <input type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" checked />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full md:w-6/12 lg:w-3/12 lg:mb-0 mb-12 px-4">
                <div className="px-6">
                    <img
                        alt="..."
                        src="https://imageio.forbes.com/specials-images/imageserve/603e8af3c4ddcfbbdfa14153/0x0.jpg?format=jpg&crop=918,919,x236,y19,safe&height=416&width=416&fit=bounds"
                        className="shadow-lg rounded-full max-w-full mx-auto"
                        style={{ maxWidth: "120px" }}
                    />
                    <div className="pt-6 text-center">
                        <h5 className="text-xl font-bold">
                            Ye Guofu
                        </h5>
                        <p className="mt-1 text-sm text-blue-900">
                            PT DHA sudah menjadi kepercayaan perusahaan saya sejak tahun 2017. Kualitas dan harga selalu terdepan.
                        </p>
                        <div className="pt-2">
                            <div className="flex justify-center">
                                <div className="rating">
                                    <input type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" />
                                    <input type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" />
                                    <input type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" />
                                    <input type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" />
                                    <input type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" checked />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full md:w-6/12 lg:w-3/12 lg:mb-0 mb-12 px-4">
                <div className="px-6">
                    <img
                        alt="..."
                        src="https://imageio.forbes.com/specials-images/imageserve/603e8af3c4ddcfbbdfa14153/0x0.jpg?format=jpg&crop=918,919,x236,y19,safe&height=416&width=416&fit=bounds"
                        className="shadow-lg rounded-full max-w-full mx-auto"
                        style={{ maxWidth: "120px" }}
                    />
                    <div className="pt-6 text-center">
                        <h5 className="text-xl font-bold">
                            Ye Guofu
                        </h5>
                        <p className="mt-1 text-sm text-blue-900">
                            PT DHA sudah menjadi kepercayaan perusahaan saya sejak tahun 2017. Kualitas dan harga selalu terdepan.
                        </p>
                        <div className="pt-2">
                            <div className="flex justify-center">
                                <div className="rating">
                                    <input type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" />
                                    <input type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" />
                                    <input type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" />
                                    <input type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" />
                                    <input type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" checked />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

const FAQ = ({ data }) => {
    if (!Array.isArray(data)) {
        console.error('Expected data to be an array but received:', typeof data);
        return null;
    }

    return (
        <section className="pb-20 relative block bg-blue-900">
            <div
                className="bottom-auto top-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden -mt-20"
                style={{ height: "80px" }}
            >
                <svg
                    className="absolute bottom-0 overflow-hidden"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="none"
                    version="1.1"
                    viewBox="0 0 2560 100"
                    x="0"
                    y="0"
                >
                    <polygon
                        className="text-blue-900 fill-current"
                        points="2560 0 2560 100 0 100"
                    ></polygon>
                </svg>
            </div>
            <div className="container mx-auto px-4 lg:pt-24 lg:pb-24">
                <div className="flex flex-wrap text-center justify-center">
                    <div className="w-full lg:w-6/12 px-4">
                        <h2 className="text-4xl font-bold text-white">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-lg leading-relaxed mt-4 mb-4 text-white">
                            Temukan jawaban dari pertanyaanmu terkait PT Dwi Harapan Agung di sini!
                        </p>
                    </div>
                </div>
                <div className="flex flex-wrap mt-12 justify-center">
                    <div className="join join-vertical w-full bg-white">
                        {data.map(faq => (
                            <div key={faq.id} className="collapse collapse-arrow join-item">
                                <input type="radio" name="faq-accordion" />
                                <div className="collapse-title text-lg font-medium">
                                    {faq.question}
                                </div>
                                <div className="collapse-content">
                                    <p>{faq.answer}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};