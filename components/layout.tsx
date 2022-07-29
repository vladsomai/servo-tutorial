import Navbar from './navbar'
import Footer from './footer'


export default function Layout({ session, children }: any) {
  return (
    <>
      <div className="container">
        <div className="h-screen-10 p-3">
          <Navbar />
        </div>

        <main className="h-screen-80 p-3">{children}</main>

        <div className="h-screen-10">
          <Footer />
        </div>
      </div>
    </>
  )
}
