import Navbar from './navbar'
import Footer from './footer'
import Modal from './modal'
import Alert from './alert'

export default function IndexTutorialLayout({ children }: any) {
  return (
    <>
      <div className="h-full w-[40vw] m-auto ">
        <Navbar />
        {children}
      </div>
    </>
  )
}
