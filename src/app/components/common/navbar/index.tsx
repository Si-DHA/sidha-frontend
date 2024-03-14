import { WA_URL } from '@/app/constant/constant';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const LoginButton = () => {
    return <><Link className="btn btn-outline btn-primary px-8" href="login">Login</Link><Link className="btn btn-primary" href={WA_URL}>Whatsapp Kami</Link></>
}

const LogoutButton = () => {
    const modal: any = document.getElementById('my_modal_1');
    const handleModal = () => {
        if (modal) {
            modal.showModal();
        }
    }

    const logout = () => {
        Cookies.remove('idUser');
        Cookies.remove('token');
        Cookies.remove('role');
        Cookies.remove('isLoggedIn');
        modal.close()
    }
    return <div className='flex flex-none gap-2'>
        <Link className="btn btn-ghost" href="dashboard">Dashboard</Link>
        <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                    <img alt="Tailwind CSS Navbar component" src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                </div>
            </div>
            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                <li>
                    <Link className="justify-between" href="profile">
                        Profile
                    </Link>
                </li>
                <li><button className='text-error' onClick={handleModal}>Logout</button></li>
            </ul>
        </div>
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
        </dialog></div>
}

const Navbar = () => {
    const [button, setButton] = useState(<LoginButton />);

    useEffect(() => {
        const loggedIn = Cookies.get('isLoggedIn');
        const role = Cookies.get('role');
        console.log(role);
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
            {/* <div className="dropdown">
                <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                </div>
                {isLoggedIn && userRole === 'ADMIN' ? (
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                        <li><a href="/register">Daftar Akun</a></li>
                        <li><a href="/truk">Data Truk</a></li>
                    </ul>

                ) : (
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                        <li><a>Armada Kami</a></li>
                        <li><a>Tentang Kami</a></li>
                    </ul>
                )}
            </div> */}
            <Link className="btn btn-ghost text-xl" href="/">SiDHA</Link>
        </div>
        <div className="navbar-center hidden lg:flex">
            {/* {isLoggedIn && userRole === 'ADMIN' ? (
                <ul className="menu menu-horizontal px-1">
                    <li><a href="/register">Daftar Akun</a></li>
                    <li><a href="/truk">Data Truk</a></li>
                </ul>
            ) : (
                <ul className="menu menu-horizontal px-1">
                    <li><a>Armada Kami</a></li>
                    <li><a>Tentang Kami</a></li>
                </ul>
            )} */}
        </div>
        <div className="navbar-end space-x-4">
            {button}
        </div>
    </div>
}

export default Navbar

