import Footer from "@/app/components/common/footer";
import Navbar from "@/app/components/common/navbar";
import { viewBukti } from "../api/pembayaran/viewBukti";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Document, Page, pdfjs } from 'react-pdf';

// Set PDFjs worker source
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PembayaranPage = () => {
    const router = useRouter();
    const [error, setError] = useState('');
    const [data, setData] = useState(null);
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dataResponse = await viewBukti("8f8bc631-e0e6-4c2e-8c3f-b3639f9ba466");
                console.log(dataResponse);
                setData(dataResponse);
            } catch (error : any) {
                setError(error.message);
            }
        };

        fetchData();
    }, []);

    return (
        <main className="flex min-h-screen flex-col items-center justify-between" data-theme="cmyk">
            <Navbar />
            <h1>This is bukti</h1>
            {data && (
                <div className="pdf-container">
                    <Document
                        file={data}
                    >
                        <Page pageNumber={pageNumber} />
                    </Document>
                </div>
            )}
            
            <Footer />
        </main>
    )
}

export default PembayaranPage;
