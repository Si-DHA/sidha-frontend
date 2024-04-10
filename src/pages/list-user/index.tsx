import Footer from "@/app/components/common/footer";
import Navbar from "@/app/components/common/navbar";
import DataTable from "@/app/components/common/datatable/DataTable";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {viewAllUser} from "@/pages/api/user/viewAllUser";

const ListUserPage: React.FC = () => {
    const router = useRouter();
    const [error, setError] = useState('');
    const [userData, setUserData] = useState([]); // State to hold truck data

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userDataResponse = await viewAllUser();
                if (userDataResponse) {
                    setUserData(userDataResponse['content']);
                }
            } catch (error: any) {
                setError(error.message);
            }
        };

        fetchData(); // Call fetchData function when component mounts
    }, []);

    const columns = [{
        Header: 'Name', accessor: 'name',
    }, {
        Header: 'Email', accessor: 'email',
    }, {
        Header: 'Role', accessor: 'role',
    }, {
        Header: 'Address', accessor: 'address',
    }, {
        Header: 'Phone', accessor: 'phone',
    }

    ];

    const createTruk = () => {
        router.push('/truk/create');
    };


    return (<main className="flex min-h-screen flex-col items-center justify-between" data-theme="winter">
        <Navbar/>
        <h1 className="card-title">List User DHA</h1>
        {error ? (<div>{error}</div>) : (<>
            {userData ? ( // Check if trukData is empty
                <DataTable columns={columns} data={userData} btnText="Detail" onClick={createTruk}
                           type="user"/>) : (
                <DataTable columns={columns} data={[]} btnText="Detail" onClick={createTruk} type="user"/>)}
        </>)}
        <Footer/>
    </main>);
}
export default ListUserPage;