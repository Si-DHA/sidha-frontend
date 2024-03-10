import Footer from "@/app/components/common/footer";
import Navbar from "@/app/components/common/navbar";
import { viewTrukById } from "../../api/truk/viewTrukById";
import { useState, useEffect } from "react";

const TrukDetailPage = () => {
    const queryParameters = new URLSearchParams(window.location.search)
    const id = queryParameters.get("id")
    const [error, setError] = useState('');
    const [trukData, setTrukData] = useState(null); // State to hold truck data

    useEffect(() => {

        const fetchData = async () => {
            try {
                const trukDataResponse = await viewTrukById(id);
                setTrukData(trukDataResponse['content']);
            } catch (error: any) {
                setError(error.message);
            }
        };

        fetchData(); // Call fetchData function when component mounts
    }, []);

    return (
        <main className="flex min-h-screen flex-col items-center justify-between" data-theme="winter">
            <Navbar />
                      
            <Footer/>
        </main>
    )
}

export default TrukDetailPage