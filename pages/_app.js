import '../css/style.css'
import '../css/form.css'
import Head from 'next/head'
import Link from 'next/link'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'

import {PAYPAL_CLIENT_ID} from '../utils/constants'

function MyApp({ Component, pageProps }) {
  return (
    <PayPalScriptProvider options= {{"client-id": PAYPAL_CLIENT_ID.clientId }}>
      <Head>
        <title>Pet Care App</title>
      </Head>

      <div className="top-bar">
        <div className="nav">
          <Link href="/">
            <a>Home</a>
          </Link>
          <Link href="/new">
            <a>Add Pet</a>
          </Link>
        </div>
        <Link href="/">
          <a>
            <img
              id="title"
              src="https://upload.wikimedia.org/wikipedia/commons/1/1f/Pet_logo_with_flowers.png"
              alt="pet care logo"
              ></img>
          </a>
        </Link>
      </div>
      <div className="grid wrapper">
        <Component {...pageProps} />
      </div>
    </PayPalScriptProvider>
  )
}

export default MyApp
