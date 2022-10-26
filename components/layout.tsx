import Navbar from './navbar'
import Footer from './footer'
import Modal from './modal'

export default function Layout({ session, children }: any) {
  return (
    <>
      <Modal />

      <div className="h-[7vh]">
        <Navbar />
      </div>

      <main className="hidden lg:block tracking-wider h-[88vh] px-3">
        {children}
      </main>

      <main className="lg:hidden flex justify-center items-center text-center">
        <h1 className="text-6xl">
          You cannot view this website on small screens!
        </h1>
      </main>

      <Footer />
    </>
  )
}
