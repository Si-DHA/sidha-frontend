import { PropsWithChildren } from 'react'
import Head from 'next/head'
import Navbar from '../navbar'
import Footer from '../footer'

interface Props {
  title?: string,
  transparent?: boolean
}

const Layout = (props: PropsWithChildren<Props>) => {


  return (

    <div>
      <Head>
        <title>{props.title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <header>
        <Navbar/>
      </header>
      <main>
        {props.children}
      </main>
      <Footer></Footer>
    </div>
  )
}

export default Layout