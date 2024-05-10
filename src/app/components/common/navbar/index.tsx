import { BASE_URL, WA_URL } from '@/app/constant/constant';
import { checkIfAuthenticated } from '@/app/utils/checkIfAuthenticated';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const LoginButton = () => {
    return <><Link className="btn btn-outline btn-primary px-8" href="/login">Login</Link><Link className="btn btn-primary" href={WA_URL}>Whatsapp Kami</Link></>
}

const LogoutButton = () => {
    const userId = Cookies.get('idUser');
    const username = Cookies.get('name');
    const userRole = Cookies.get('role');
    const imageUrl = BASE_URL + `/image/file/${userId}`;
    const [modal, setModal]: any = useState(null);
    const handleModal = () => {
        modal.showModal()
    }

    useEffect(() => {
        setModal(document.getElementById('my_modal_1'));
    }, [])

    const logout = () => {
        Cookies.remove('idUser');
        Cookies.remove('token');
        Cookies.remove('role');
        Cookies.remove('isLoggedIn');
        Cookies.remove('name');
        Cookies.remove('companyName');
        modal.close();
        window.location.href = "/";
    }
    return <div className='flex flex-none gap-2'>



        <ul className="menu bg-base-200 sm:menu-horizontal rounded-box">
            <li>
                <a>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                    <Link className="" href="/dashboard">Dashboard</Link>
                </a>
            </li>
            <li>
                
                <a>
                <span className="badge badge-l badge-info">{userRole}</span>
                    <Link href="/profile">{username}</Link>
                </a>
            </li>
           
        </ul>
        <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">

                <div className="w-10 rounded-full">
                    <img alt="user profile" src={imageUrl} onError = {
                        (e) => {
                            e.target.onerror = null;
                            e.target.src = "https://i.pinimg.com/736x/0d/64/98/0d64989794b1a4c9d89bff571d3d5842.jpg"
                        }
                    } />

                </div>
            </div>
            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-64">
                <li className='flex flex-row'>
                    <Link className="justify-between" href="/profile">
                        Profile
                    </Link>

                </li>
                <li><button className='text-error' onClick={handleModal}>Logout</button></li>
            </ul>
            <dialog id="my_modal_1" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Logout</h3>
                    <p className="py-4">Apakah Anda yakin ingin keluar dari akun Anda?</p>
                    <div className="modal-action">
                        <form method="dialog" className='space-x-4'>
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn px-8">Batal</button>
                            <Link href="/"><button className="btn btn-error px-6" onClick={logout}>Keluar</button></Link>
                        </form>
                    </div>
                </div>
            </dialog>
        </div>
    </div>
}

const Navbar = () => {
    const [button, setButton] = useState(<LoginButton />);

    useEffect(() => {
        const loggedIn = checkIfAuthenticated();
        if (loggedIn) {
            setButton(<LogoutButton />);
        } else {
            setButton(<LoginButton />);
        }
    }, []);

    return <div className="navbar bg-base-100 w-full">
        <div className="flex-none lg:hidden">
            <label htmlFor="my-drawer-3" aria-label="open sidebar" className="btn btn-square btn-ghost">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </label>
        </div>
        <div className="navbar-start">
            <Link className="btn btn-ghost text-xl" href="/">SiDHA</Link>
        </div>
        <div className="navbar-center hidden lg:flex">
        </div>
        <div className="navbar-end space-x-4">
            {button}
        </div>
    </div>
}

export default Navbar

