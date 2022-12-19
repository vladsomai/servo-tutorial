import Navbar from './navbar'
import Footer from './footer'
import Modal from './modal'

export default function Layout({ session, children }: any) {
  return (
    <>
      <Modal />
      {/* <div className="h-[7vh]">
        <Navbar />
      </div> */}
      <main className="hidden lg:block tracking-wider h-[96vh] px-3 mt-[1vh]">
        {children}
      </main>
      <main className="lg:hidden h-[88vh] flex justify-center items-center text-center">
        <h1 className="text-6xl">
          You cannot view this website on small screens!
        </h1>
      </main>
      <div className="h-[3vh]">
        <Footer />
      </div>
    </>
  )
}
