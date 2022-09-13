import Navbar from './navbar'
import Footer from './footer'

export default function Layout({ session, children }: any) {
  return (
    <>
    <div className='h-[9vh]'>
      <Navbar />
    </div>

      <main className="hidden lg:block tracking-wider">
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
