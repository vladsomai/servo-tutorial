import Link from 'next/link'
import Image from 'next/image'

const Navbar = () => {
  return (
    <>
      <nav className="flex justify-between items-center h-[15%] w-full">
        <Link href="/">
          <Image
            className="w-[165px] h-auto"
            loading="eager"
            src={'/Logo.png'}
            sizes="100vw"
            width={0}
            height={0}
            alt="logo"
          ></Image>
        </Link>
        <div>
        <Link
          href="/docs/1002"
          className="text-xl btn btn-primary rounded-full"
          >
          Tutorial
        </Link>
        <Link
          href="/docs/1001"
          className="text-xl btn btn-primary rounded-full ml-10"
          >
          Docs
        </Link>
          </div>
      </nav>
    </>
  )
}
export default Navbar
