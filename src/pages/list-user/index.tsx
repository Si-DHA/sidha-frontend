import Footer from "@/app/components/common/footer";
import Navbar from "@/app/components/common/navbar";
import DataTable from "@/app/components/common/datatable/DataTable";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { viewAllUser } from "@/pages/api/user/viewAllUser";
import Cookies from "js-cookie";
import Drawer from "@/app/components/common/drawer";
import { Inter } from "next/font/google";


const inter = Inter({ subsets: ["latin"] });
function toTitleCase(str : String) {
    if (!str) return str;
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}


const ListUserPage: React.FC = () => {
    const queryParameters = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const roleQueryParam = queryParameters?.get("role");
    const [shouldRedirect, setShouldRedirect] = useState(false);

    
    
    const router = useRouter();
    const [error, setError] = useState('');
    const [userData, setUserData] = useState([]); // State to hold truck data
    var isLoggedIn = Cookies.get('isLoggedIn');
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/login');
            setShouldRedirect(true)
        }
        const role = Cookies.get('role');
        if (role == 'KLIEN' || role == 'SOPIR') {
            router.push('/404');
            setShouldRedirect(true)
        }
        if (role == 'KARYAWAN'){
           if(roleQueryParam == 'admin' || roleQueryParam == 'karyawan' || roleQueryParam == 'all'){
               router.push('/404');
               setShouldRedirect(true)
           }
        }
      

        setUserRole(role || '');
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
        Cell : ({value}) => <div className="badge badge-success text-xs">{toTitleCase(value)}</div>
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

    const createTruk = () => {
        router.push('/truk/create');
    };

    if (shouldRedirect) {
        return null;
    }

   

    return (<main className={`flex min-h-screen flex-col   ${inter.className}`} data-theme="cmyk">
        <Drawer userRole={userRole}>
            <div className="flex flex-col  align-middle justify-center items-center mx-auto gap-y-4">
                <h1 className="card-title">Daftar Akun {toTitleCase(roleQueryParam)} PT DHA</h1>
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