import Link from 'next/link'

const Navbar = () => {
  return (
    <>
      <nav className="flex justify-around items-center h-full">
        <Link href="/" className="btn btn-sm btn-primary"></Link>
        <Link href="/tutorial/1" className="btn btn-sm btn-primary"></Link>
      </nav>
    </>
  )
}
export default Navbar
