import Link from 'next/link'

const Navbar = () => {
  return (
    <>
      <nav className="flex justify-around p-4 bg-gradient-to-r from-blue-300 to-blue-600 rounded-lg">
      <Link href='/'>
            <a className='btn btn-secondary'>Home</a>
        </Link>
 
        <Link href='/tutorial'>
            <a className='btn btn-secondary'>Take the tutorial!</a>
        </Link>
      </nav>
    </>
  )
}
export default Navbar
