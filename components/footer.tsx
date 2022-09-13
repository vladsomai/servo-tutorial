const Footer = () => {
  const currentDate: Date = new Date()

  return (
    <footer className="">
      <p className="h-[5vh] flex justify-center items-center">
        &copy;&nbsp;Tom&apos;s company&nbsp;- {currentDate.getFullYear()}
      </p>
    </footer>
  )
}
export default Footer
