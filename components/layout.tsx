import Navbar from './navbar'
import Footer from './footer'


export default function Layout({ session, children }: any) {
  return (
    <>
      <div className="container">
        <div className="h-screen-10">
          <Navbar />
        </div>

        <main className="h-screen-80 ">{children}</main>

        <div className="h-screen-10">
          <Footer />
        </div>
      </div>
    </>
  )
}
