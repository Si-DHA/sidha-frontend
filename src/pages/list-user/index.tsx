import Footer from "@/app/components/common/footer";
import DataTable from "@/app/components/common/datatable/DataTable";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { viewAllUser } from "@/pages/api/user/viewAllUser";
import Cookies from "js-cookie";
import Drawer from "@/app/components/common/drawer";
import { Inter } from "next/font/google";


const inter = Inter({ subsets: ["latin"] });
function toTitleCase(str: String) {
    if (!str) return str;
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}


const ListUserPage: React.FC = () => {
    const queryParameters = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const roleQueryParam = queryParameters?.get("role");
    const [loading, setLoading] = useState(true);
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
        if (role == 'KLIEN' || role == 'SOPIR') {
            setError('Anda tidak diperbolehkan mengakses halaman ini');
        }
        if (role == 'KARYAWAN') {
            if (roleQueryParam == 'admin' || roleQueryParam == 'karyawan' || roleQueryParam == 'all') {
                setError('Anda tidak diperbolehkan mengakses halaman ini');
            }
        }
    }, [isLoggedIn, router])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userDataResponse = await viewAllUser(roleQueryParam || "all");
                if (userDataResponse) {
                    setUserData(userDataResponse['content']);
                }
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData(); // Call fetchData function when component mounts
    }, [roleQueryParam]);

    const columns = [{
        Header: 'Nama', accessor: 'name',
    }, {
        Header: 'Email', accessor: 'email',
    }, {
        Header: 'Peran', accessor: 'role',
        Cell: ({ value }) => <div className="badge badge-success text-xs">{toTitleCase(value)}</div>
    }, {
        Header: 'Alamat', accessor: 'address',
    }, {
        Header: 'Nomor HP', accessor: 'phone',
    }, {
        Header: 'Status',
        accessor: 'isDeleted',
        Cell: ({ value }) => value ? <div className="badge badge-error text-xs">Tidak Aktif</div> : <div className="badge badge-success text-xs">Aktif</div>
    },
    ];

    return (<main className={`flex min-h-screen flex-col items-center justify-between ${inter.className}`} data-theme="cmyk">
        <Drawer userRole={userRole}>
            <div className="flex flex-col justify-center items-center mih-h-screen p-8">
                <h1 className="text-3xl font-bold text-center ">Daftar Akun {toTitleCase(roleQueryParam)} PT DHA</h1>
            </div>

            <div className="flex flex-col gap-6 mx-4 my-4 ">
                <div className="flex flex-col gap-4 justify-center items-center mih-h-screen p-8 border rounded-lg shadow-md">
                    <div className="overflow-x-auto w-full">
                        {error ? (
                            <div>{error}</div>
                        ) : (
                            <>
                                {userData ? (
                                    <DataTable 
                                        columns={columns} 
                                        data={userData}
                                        loading={loading}
                                        type="user" />) : (
                                    <DataTable 
                                        columns={columns}
                                        data={[]} 
                                        loading={loading}
                                        type="user" />)}
                            </>)}
                    </div>
                </div>
            </div>
        </Drawer>
        <Footer />
    </main>);
}
export default ListUserPage;