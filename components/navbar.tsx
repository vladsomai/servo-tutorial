import Link from 'next/link'

const Navbar = () => {
  return (
    <>
      <nav className="flex justify-around items-center h-full">
        <Link href="/">
          <a className="btn btn-sm btn-primary">Home</a>
        </Link>

        <Link href="/tutorial/1">
          <a className="btn btn-sm btn-primary">Take the tutorial!</a>
        </Link>
      </nav>
    </>
  )
}
export default Navbar
