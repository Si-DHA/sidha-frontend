import Footer from "@/app/components/common/footer";
import Navbar from "@/app/components/common/navbar";
import DataTable from "@/app/components/common/datatable/DataTable";
import { viewAllTruk } from "../api/truk/viewAllTruk";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

const TrukPage: React.FC = () => {
    const router = useRouter();
    const [error, setError] = useState('');
    const [trukData, setTrukData] = useState([]); // State to hold truck data

    useEffect(() => {
        const fetchData = async () => {
            try {
                const trukDataResponse = await viewAllTruk();
                setTrukData(trukDataResponse['content']);
            } catch (error: any) {
                setError(error.message);
            }
        };

        fetchData(); // Call fetchData function when component mounts
    }, []);

    const columns = [
        {
            Header: 'License Plate',
            accessor: 'licensePlate',
        },
        {
            Header: 'Merk',
            accessor: 'merk',
        },
        {
            Header: 'Type',
            accessor: 'type',
        },
        {
            Header: 'Kubikasi',
            accessor: 'kubikasiBox',
        },
        {
            Header: 'Expired KIR',
            accessor: 'expiredKir',
        },
        // Add more columns as needed
    ];

    const createTruk = () => {
        router.push('/truk/create'); // Replace '/your-next-page' with the path to your next page
    };


    return (
        <main className="flex min-h-screen flex-col items-center justify-between" data-theme="winter">
            <Navbar />
            <h1 className="card-title">List Truk DHA</h1>
            {error ? (
                <div>{error}</div>
            ) : (
                <DataTable columns={columns} data={trukData} btnText="Create truck" onClick={createTruk} />
            )}
            <Footer />
        </main>
    );
}
export default TrukPage;