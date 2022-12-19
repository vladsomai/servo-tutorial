const Footer = () => {
  const currentDate: Date = new Date()

  return (
    <footer className="h-full">
      <p className="flex flex-col text-center h-full justify-center text-xs">
        &copy;&nbsp;Tom&apos;s company&nbsp;- {currentDate.getFullYear()}
      </p>
    </footer>
  )
}
export default Footer
