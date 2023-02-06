import Navbar from './navbar'
import Footer from './footer'
import Modal from './modal'
import Alert from './alert'

export default function Layout({ session, children }: any) {
  return (
    <>
      {/* <div className="h-[7vh]">
        <Navbar />
      </div> */}
      <main className="hidden lg:block tracking-wider h-[96vh] px-3 mt-[1vh]">
        <div
          className="fixed flex-col justify-center h-full w-full items-center z-50 hidden"
          id="loading-motor"
        >
          <div className="w-[50px] h-[50px] bg-slate-50  rounded-full animate-ping "></div>
          <h1 className="text-6xl mt-16">Loading assets...</h1>
        </div>
        <Modal />
        <Alert />
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
