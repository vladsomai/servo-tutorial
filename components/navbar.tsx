import Link from 'next/link'

const Navbar = () => {
  return (
    <>
      <nav className="flex justify-around pt-4">
      <Link href='/'>
            <a className='btn btn-secondary'>Home</a>
        </Link>
 
        <Link href='/tutorial'>
            <a className='btn btn-accent btn-xl'>Take the tutorial!</a>
        </Link>
      </nav>
    </>
  )
}
export default Navbar
