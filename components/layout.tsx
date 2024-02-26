import Footer from './footer'
import Modal from './modal'
import Alert from './alert'

export default function Layout({ session, children }: any) {
  return (
    <>
      <main className="hidden lg:block tracking-wider h-[96vh] px-3 mt-[1vh]">
        <Modal />
        <Alert />
        {children}
      </main>
      <main className="lg:hidden h-[88vh] flex justify-center items-center text-center">
        <h1 className="text-3xl">
          You cannot view this website on small screens!
        </h1>
      </main>
      <div className="h-[3vh] fixed bottom-0 flex justify-center w-full bg-base-100">
        <Footer />
      </div>
    </>
  )
}
