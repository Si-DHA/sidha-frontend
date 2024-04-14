import Footer from "@/app/components/common/footer";
import Navbar from "@/app/components/common/navbar";
import DataTable from "@/app/components/common/datatable/DataTable";
import { viewAllTruk } from "../api/truk/viewAllTruk";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Drawer from "@/app/components/common/drawer";

const TrukPage: React.FC = () => {
    const router = useRouter();
    const [error, setError] = useState('');
    const [trukData, setTrukData] = useState([]); // State to hold truck data

    useEffect(() => {
        const fetchData = async () => {
            try {
                const trukDataResponse = await viewAllTruk();
                console.log(trukDataResponse);
                if (trukDataResponse) {
                    setTrukData(trukDataResponse['content']);
                }
            } catch (error: any) {
                setError(error.message);
            }
        };

        fetchData(); // Call fetchData function when component mounts
    }, []);

    const columns = [
        {
            Header: 'Nomor Polisi',
            accessor: 'licensePlate',
        },
        {
            Header: 'Merk',
            accessor: 'merk',
        },
        {
            Header: 'Tipe',
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
    ];

    const createTruk = () => {
        router.push('/truk/create'); // Replace '/your-next-page' with the path to your next page
    };


    return (
        <main className="flex  flex-col items-center justify-between" data-theme="winter">
            <Navbar />
            <h1 className="card-title">List Truk DHA</h1>
            {error ? (
                <div>{error}</div>
            ) : (
                <>
                    {trukData ? ( // Check if trukData is empty
                        <DataTable columns={columns} data={trukData} btnText="Tambah truk" onClick={createTruk} type="truk" />
                    ) : (
                        <DataTable columns={columns} data={[]} btnText="Tambah truk" onClick={createTruk} type="truk" />
                    )}
                </>)}
            <Footer />

        </main>
    );
}
export default TrukPage;