const Footer = () => {
  const currentDate: Date = new Date()

  return (
    <footer className="">
      <p className="text-center pt-10">
        &copy;&nbsp;Tom&apos;s company&nbsp;- {currentDate.getFullYear()}
      </p>
    </footer>
  )
}
export default Footer
