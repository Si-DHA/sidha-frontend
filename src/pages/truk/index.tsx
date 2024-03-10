import Footer from "@/app/components/common/footer";
import Navbar from "@/app/components/common/navbar";
import DataTable from "@/app/components/common/datatable/DataTable";
import { viewAllTruk } from "../api/truk/viewAllTruk";
import React, { useState, useEffect } from "react";



const TrukPage : React.FC = () => {
    const [error, setError] = useState('');
    const [trukData, setTrukData] = useState([]); // State to hold truck data

    useEffect(() => {
        // Function to fetch truck data when component mounts
        const fetchData = async () => {
            try {
                const trukDataResponse = await viewAllTruk();
                setTrukData(trukDataResponse['content']);
                console.log(trukDataResponse);
                console.log(trukData);
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


    return (
        <main className="flex min-h-screen flex-col items-center justify-between" data-theme="winter">
            <Navbar />
            {error && <div>Error: {error}</div>}
            <h1>Truck Data</h1>
            <DataTable columns={columns} data={trukData} />
            <Footer />
        </main>
    );
}
export default TrukPage;