import Layout from "@/app/components/common/layout"
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const IndexPage = () => (
    <main className={`flex min-h-screen flex-col ${inter.className}`} data-theme="cmyk">
        <Layout title="Home | Next.js + TypeScript Example">
            <Visi />
            <Services />
            <Featured />
            <Customer />
            <FAQ />
            {/* <Contact /> */}
        </Layout>
    </main>
)

export default IndexPage

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
        {/* <div className="flex flex-wrap items-center mt-32">
            <div className="w-full md:w-5/12 px-4 mr-auto ml-auto">
                <div className="text-gray-600 p-3 text-center inline-flex items-center justify-center w-16 h-16 mb-6 shadow-lg rounded-full bg-gray-100">
                    <i className="fas fa-user-friends text-xl"></i>
                </div>
                <h3 className="text-3xl mb-2 font-semibold leading-normal">
                    Working with us is a pleasure
                </h3>
                <p className="text-lg font-light leading-relaxed mt-4 mb-4 text-gray-700">
                    Don't let your uses guess by attaching tooltips and popoves
                    to any element. Just make sure you enable them first via
                    JavaScript.
                </p>
                <p className="text-lg font-light leading-relaxed mt-0 mb-4 text-gray-700">
                    The kit comes with three pre-built pages to help you get
                    started faster. You can change the text and images and
                    you're good to go. Just make sure you enable them first via
                    JavaScript.
                </p>
                <a
                    href="https://www.creative-tim.com/learning-lab/tailwind-starter-kit#/presentation"
                    className="font-bold text-gray-800 mt-8"
                >
                    Check Tailwind Starter Kit!
                </a>
            </div>

            <div className="w-full md:w-4/12 px-4 mr-auto ml-auto">
                <div className="relative flex flex-col min-w-0 break-words  w-full mb-6 shadow-lg rounded-lg bg-pink-600">
                    <img
            alt="..."
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1051&q=80"
            className="w-full align-middle rounded-t-lg"
          />
                    <blockquote className="relative p-8 mb-4">
                        <svg
                            preserveAspectRatio="none"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 583 95"
                            className="absolute left-0 w-full block"
                            style={{
                                height: "95px",
                                top: "-94px"
                            }}
                        >
                            <polygon
                                points="-30,95 583,95 583,65"
                                className="text-pink-600 fill-current"
                            ></polygon>
                        </svg>
                        <h4 className="text-xl font-bold text-white">
                            Top Notch Services
                        </h4>
                        <p className="text-md font-light mt-2 text-white">
                            The Arctic Ocean freezes every winter and much of the
                            sea-ice then thaws every summer, and that process will
                            continue whatever happens.
                        </p>
                    </blockquote>
                </div>
            </div>

        </div> */}
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
                                        CDD (L: 4.4 m, W: 2.0 m, H: 1.9 m)
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
                                        CDD Long (L: 5.4 m, W: 3.0 m, H: 2.9 m)
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
                                        Wingbox (L: 5.9 m, W: 3.5 m, H: 3.4 m)
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
                                        Fuso (L: 6.2 m, W: 3.9 m, H: 3.7 m)
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

const FAQ = () => <section className="pb-20 relative block bg-blue-900">
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
                    Frequently Asked Question
                </h2>
                <p className="text-lg leading-relaxed mt-4 mb-4 text-white">
                    Temukan jawaban dari pertanyaanmu terkait PT Dwi Harapan Agung di sini!
                </p>
            </div>
        </div>
        <div className="flex flex-wrap mt-12 justify-center">
            <div className="join join-vertical w-full bg-white">
                <div className="collapse collapse-arrow join-item">
                    <input type="radio" name="my-accordion-4" defaultChecked />
                    <div className="collapse-title text-lg font-medium">
                        Bagaimana cara saya masuk ke website?
                    </div>
                    <div className="collapse-content">
                        <p>Hubungi PT Dwi Harapan Agung melalui +62718371838</p>
                    </div>
                </div>
                <div className="collapse collapse-arrow join-item border border-base-300">
                    <input type="radio" name="my-accordion-4" />
                    <div className="collapse-title text-lg font-medium">
                        Bagaimana cara saya memesan layanan PT Dwi Harapan Agung?
                    </div>
                    <div className="collapse-content">
                        <p>Login atau masuk ke website melalui akun yang diberikan, pilih rute, dan order</p>
                    </div>
                </div>
                <div className="collapse collapse-arrow join-item border border-base-300">
                    <input type="radio" name="my-accordion-4" />
                    <div className="collapse-title text-lg font-medium">
                        Apakah PT Dwi Harapan Agung melayani pengiriman ke seluruh kota di Indonesia?
                    </div>
                    <div className="collapse-content">
                        <p>Ya, kami melayani pengiriman ke seluruh kota di Indonesia</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

// const Contact = () => <section className="relative block py-24 lg:pt-0 bg-gray-900">
//     <div className="container mx-auto px-4">
//         <div className="flex flex-wrap justify-center lg:-mt-64 -mt-48">
//             <div className="w-full lg:w-6/12 px-4">
//                 <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-gray-300">
//                     <div className="flex-auto p-5 lg:p-10">
//                         <h4 className="text-2xl font-semibold">
//                             Want to work with us?
//                         </h4>
//                         <p className="leading-relaxed mt-1 mb-4 text-gray-600">
//                             Complete this form and we will get back to you in 24 hours.
//                         </p>
//                         <div className="relative w-full mb-3 mt-8">
//                             <label
//                                 className="block uppercase text-gray-700 text-xs font-bold mb-2"
//                                 htmlFor="full-name"
//                             >
//                                 Full Name
//                             </label>
//                             <input
//                                 type="text"
//                                 className="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
//                                 placeholder="Full Name"
//                                 style={{ transition: "all .15s ease" }}
//                             />
//                         </div>

//                         <div className="relative w-full mb-3">
//                             <label
//                                 className="block uppercase text-gray-700 text-xs font-bold mb-2"
//                                 htmlFor="email"
//                             >
//                                 Email
//                             </label>
//                             <input
//                                 type="email"
//                                 className="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
//                                 placeholder="Email"
//                                 style={{ transition: "all .15s ease" }}
//                             />
//                         </div>

//                         <div className="relative w-full mb-3">
//                             <label
//                                 className="block uppercase text-gray-700 text-xs font-bold mb-2"
//                                 htmlFor="message"
//                             >
//                                 Message
//                             </label>
//                             <textarea
//                                 rows={4}
//                                 cols={80}
//                                 className="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
//                                 placeholder="Type a message..."
//                             />
//                         </div>
//                         <div className="text-center mt-6">
//                             <button
//                                 className="bg-gray-900 text-white active:bg-gray-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
//                                 type="button"
//                                 style={{ transition: "all .15s ease" }}
//                             >
//                                 Send Message
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     </div>
// </section>