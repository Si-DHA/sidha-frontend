import Footer from "@/app/components/common/footer";
import Navbar from "@/app/components/common/navbar";
import DataTable from "@/app/components/common/datatable/DataTable";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { viewAllUser } from "@/pages/api/user/viewAllUser";
import Cookies from "js-cookie";
import Drawer from "@/app/components/common/Drawer";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const ListUserPage: React.FC = () => {
    const router = useRouter();
    const [error, setError] = useState('');
    const [userData, setUserData] = useState([]); // State to hold truck data
    var isLoggedIn = Cookies.get('isLoggedIn');
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/login');
        }
        const role = Cookies.get('role');

        setUserRole(role || '');
    }, [isLoggedIn, router])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userDataResponse = await viewAllUser("all");
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
        Header: 'Nama', accessor: 'name',
    }, {
        Header: 'Email', accessor: 'email',
    }, {
        Header: 'Peran', accessor: 'role',
    }, {
        Header: 'Alamat', accessor: 'address',
    }, {
        Header: 'Nomor HP', accessor: 'phone',
    }

    ];

    const createTruk = () => {
        router.push('/truk/create');
    };


    return (<main className={`flex min-h-screen flex-col   ${inter.className}`} data-theme="cmyk">
        <Drawer userRole={userRole}>
            <div className="flex flex-col  align-middle justify-center items-center mx-auto gap-y-4">
                <h1 className="card-title">Daftar akun  PT DHA</h1>
                {error ? (<div>{error}</div>) : (<>
                    {userData ? (
                        <DataTable columns={columns} data={userData}
                            type="user" />) : (
                        <DataTable columns={columns} data={[]} type="user" />)}
                </>)}
            </div>
        </Drawer>
        <Footer />
    </main>);
}
export default ListUserPage;