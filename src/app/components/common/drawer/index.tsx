import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Navbar from "../navbar";
import Link from "next/link";

const Drawer = ({ userRole, children }: { userRole: string, children: React.ReactNode }) => {
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
                  <h2 className="menu-title text-neutral"><a>Data Akun</a></h2>
                  <ul>
                    <li><Link href="/list-user?role=klien">Daftar Klien</Link></li>
                    <li><Link href="/list-user?role=sopir">Daftar Sopir</Link></li>
                    <li><Link href="/list-user?role=admin">Daftar Admin</Link></li>
                    <li><Link href="/list-user?role=karyawan">Daftar Karyawan</Link></li>
                  </ul>
                </li>
                <li>
                  <h2 className="menu-title text-neutral"><a>Registrasi Akun</a></h2>
                  <ul>
                    <li><Link href="/register/karyawan">Registrasi Karyawan</Link></li>
                    <li><Link href="/register/sopir">Registrasi Sopir</Link></li>
                  </ul>
                </li>
                <li>
                  <h2 className="menu-title text-neutral"><a>Data Truk</a></h2><ul>
                    <li><Link href="/truk">Daftar Truk</Link></li>
                  </ul>
                </li>
                <li>
                  <h2 className="menu-title text-neutral"><a>FAQ</a></h2>
                  <ul>
                    <li><Link href="/faq">Kelola FAQ</Link></li>
                  </ul>
                </li>
              </ul>
            </ul>
          </div>
        </div>
      )
    } else if (userRole === 'KLIEN') {
      const idKlien = Cookies.get('idUser');
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
                  <h2 className="menu-title text-neutral">Dokumen Kontrak</h2>
                  <ul>
                    <li><Link href="/kontrak">Lihat Dokumen Kontrak</Link></li>
                  </ul>
                </li>
                <li>
                  <h2 className="menu-title text-neutral">Penawaran Harga</h2>
                  <ul>
                    <li><Link href="/lihat-penawaran-harga-item">Daftar Penawaran Harga</Link></li>
                  </ul>
                </li>
                <li>
                  <h2 className="menu-title text-neutral">Purchase Order</h2>
                  <ul>
                    <li><Link href="/order/create">Buat Purchase Order</Link></li>
                    <li><Link href="/order/klien">Daftar Purchase Order</Link></li>
                  </ul>
                </li>
                <li>
                  <h2 className="menu-title text-neutral">Invoice</h2>
                  <ul>
                    <li><Link href={`/invoice?idKlien=${idKlien}`}>Daftar Invoice</Link></li>
                  </ul>
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
                  <h2 className="menu-title text-neutral"><a>Data Akun</a></h2>
                  <ul>
                    <li><Link href="/list-user?role=klien">Daftar Klien</Link></li>
                  </ul>
                  <ul>
                    <li><Link href="/list-user?role=sopir">Daftar Sopir</Link></li>
                  </ul>
                </li>
                <li>
                  <h2 className="menu-title text-neutral"><a>Registrasi Akun</a></h2>
                  <ul>
                    <li><Link href="/register/klien">Registrasi Klien</Link></li>

                  </ul>
                </li>
                <li>
                  <h2 className="menu-title text-neutral"><a>Dokumen Surat Kontrak</a></h2>
                  <ul>
                    <li><Link href="/kontrak/daftar">Daftar  Kontrak Klien</Link></li>

                  </ul>
                </li>

                <li>
                  <h2 className="menu-title text-neutral">Penawaran Harga</h2>
                  <ul>
                    <li><Link href="/penawaranharga">Daftar Penawaran Harga</Link></li>
                  </ul>
                  <ul>
                    <li><Link href="/penawaranharga/create">Tambah Penawaran Baru</Link></li>
                  </ul>
                </li>

                <li>
                  <h2 className="menu-title text-neutral"><a>Laporan Insiden</a></h2>
                  <ul>
                    <li><Link href="/insiden/karyawan">Daftar Laporan Insiden</Link></li>

                  </ul>
                </li>

                <li>
                  <h2 className="menu-title text-neutral"><a>Purchase Order</a></h2>
                  <ul>
                    <li><Link href="/order">Daftar Purchase Order</Link></li>

                  </ul>
                </li>

                <li>
                  <h2 className="menu-title text-neutral"><a>Invoice</a></h2>
                  <ul>
                    <li><Link href="/invoice/klien">Daftar Invoice</Link></li>

                  </ul>
                </li>

                <li>
                  <h2 className="menu-title text-neutral"><a>Tawaran Kerja</a></h2>
                  <ul>
                    <li><Link href="/tawarankerja/karyawan">Konfirmasi Tawaran Kerja</Link></li>

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
                  <h2 className="menu-title text-neutral"><a>Data Order</a></h2>
                  <ul>
                    <li><Link href="/order/sopir">Order Anda</Link></li>
                  </ul>
                </li>
                <li>
                  <h2 className="menu-title text-neutral"><a>Tawaran Kerja</a></h2>
                  <ul>
                    <li><Link href="/tawarankerja/sopir">Daftar Tawaran Kerja</Link></li>
                    <li><Link href="/tawarankerja/sopir/listacceptedoffer">Tawaran Kerja Anda</Link></li>
                  </ul>
                </li>
                <li>
                  <h2 className="menu-title text-neutral"><a>Laporan Insiden</a></h2>
                  <ul>
                    <li><Link href="/insiden/sopir">Daftar Laporan Insiden</Link></li>
                  </ul>
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