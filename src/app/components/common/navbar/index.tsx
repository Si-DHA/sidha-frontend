import Cookies from 'js-cookie';
import Link from 'next/link';

const LoginButton = () => {
    return <><Link className="btn btn-outline btn-primary px-8" href="login">Login</Link><Link className="btn btn-primary" href="https://wa.me/6285559414940?text=Halo">Whatsapp Kami</Link></>
}

const LogoutButton = () => {
    Cookies.remove('currentUser');
    Cookies.remove('isLoggedIn');
    return <Link className="btn btn-error px-8" href="/">Logout</Link>
}

const Navbar = () => {
    var button;
    const isLoggedIn = Cookies.get('isLoggedIn');
    if (isLoggedIn) {
        button = <LogoutButton/>;
    }
    else {
        button = <LoginButton/>;
    }
    return <div className="navbar bg-base-100">
        <div className="navbar-start">
            <div className="dropdown">
                <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                </div>
                <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                    <li><a>Armada Kami</a></li>
                    <li><a>Tentang Kami</a></li>
                </ul>
            </div>
            <Link className="btn btn-ghost text-xl" href="/">SiDHA</Link>
        </div>
        <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1">
                <li><a>Armada Kami</a></li>
                <li><a>Tentang Kami</a></li>
            </ul>
        </div>
        <div className="navbar-end space-x-4">
            {button}
        </div>
    </div>
}

export default Navbar

