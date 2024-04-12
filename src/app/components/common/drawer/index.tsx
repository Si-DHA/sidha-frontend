import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Navbar from "../navbar";
import Link from "next/link";

const Drawer = ({ userRole, children }: { userRole: string, children: React.ReactNode }) => {
  // buat drawer berdasarkan role
  const [drawer, setDrawer] = useState(<></>);
  useEffect(() => {
    if (userRole === 'ADMIN') {
      setDrawer(
        <div className="drawer lg:drawer-open">
          <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content flex flex-col">
            <Navbar />
            {children}
          </div>
          <div className="drawer-side">
            <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label>
            <ul className="menu p-4 w-80 min-h-full bg-base-200">
              <ul className="menu bg-base-200 w-56 rounded-box">

                <li>
                  <h2 className="menu-title text-neutral"><a>Registrasi Akun</a></h2>
                  <ul>
                    <li><Link href="/register/karyawan">Registrasi Karyawan</Link></li>
                    <li><Link href="/register/sopir">Registrasi Sopir</Link></li>

                  </ul>
                </li>

                <li>
                  <h2 className="menu-title text-neutral"><Link href="/truk">Daftar Truk</Link></h2>
                  <ul>
                    <li><Link href="/truk/create">Tambah Truk</Link></li>
                  </ul>
                </li>

              </ul>
            </ul>
          </div>
        </div>
      )
    } else if (userRole === 'KLIEN') {
      setDrawer(
        <div className="drawer lg:drawer-open">
          <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content flex flex-col">
            <Navbar />
            {children}
          </div>
          <div className="drawer-side">
            <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label>
            <ul className="menu p-4 w-80 min-h-full bg-base-200">
              <ul className="menu bg-base-200 w-56 rounded-box">
                <li>
                  <h2 className="menu-title text-neutral"><Link href="/lihat-penawaran-harga-item">Daftar Penawaran Harga</Link></h2>

                </li>

              </ul>
            </ul>
          </div>
        </div>
      )
    } else if (userRole === 'KARYAWAN') {
      setDrawer(
        <div className="drawer lg:drawer-open">
          <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content flex flex-col">
            <Navbar />
            {children}
          </div>
          <div className="drawer-side">
            <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label>
            <ul className="menu p-4 w-80 min-h-full bg-base-200">
              <ul className="menu bg-base-200 w-56 rounded-box">

                <li>
                  <h2 className="menu-title text-neutral"><a>Registrasi Akun</a></h2>
                  <ul>
                    <li><Link href="/register/klien">Registrasi Klien</Link></li>

                  </ul>
                </li>

                <li>
                  <h2 className="menu-title text-neutral"><Link href="/penawaranharga">Daftar Penawaran Harga</Link></h2>
                  <ul>
                    <li><Link href="/penawaranharga/create">Tambah Penawaran Baru</Link></li>
                  </ul>
                </li>

                <li>
                  <h2 className="menu-title text-neutral"><a>Daftar Laporan Insiden</a></h2>
                  <ul>
                    <li><Link href="/insiden/karyawan">Lihat Laporan</Link></li>

                  </ul>
                </li>

              </ul>
            </ul>
          </div>
        </div>
      )
    }

    else {
      setDrawer(
        <div className="drawer lg:drawer-open">
          <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content flex flex-col">
            <Navbar />
            {children}
          </div>
          <div className="drawer-side">
            <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label>
            <ul className="menu p-4 w-80 min-h-full bg-base-200">
              <ul className="menu bg-base-200 w-56 rounded-box">
                <li>
                <h2 className="menu-title text-neutral"><Link href="/truk">Daftar Truk</Link></h2>
                </li>
                <li>
                <h2 className="menu-title text-neutral"><Link href="/insiden/sopir">Laporkan Insiden</Link></h2>
                </li>
                <li>
                <h2 className="menu-title text-neutral"><Link href="/order/sopir">Order Anda</Link></h2>
                </li>
              </ul>
            </ul>
          </div>
        </div>
      )
    }
  }, [userRole, children]);
  return drawer;
}

export default Drawer;