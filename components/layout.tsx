import Navbar from './navbar'
import Footer from './footer'
import react, { useMemo } from 'react'

export default function Layout({ session, children }: any) {
  return (
    <>
      <div className="container">
        <div className="h-screen-10 p-3">
          <Navbar />
        </div>

        <main className="h-screen-80 p-3 hidden md:block tracking-wider">{children}</main>


        <main className="h-screen-80 p-3 md:hidden flex justify-center items-center text-center">
          <h1 className="text-6xl">
            You cannot view this website on small screens!
          </h1>
        </main>

        <div className="h-screen-10">
          <Footer />
        </div>
      </div>
    </>
  )
}
