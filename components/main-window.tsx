const Main = () => {
  return (
    <>
      <div className="grid w-full card bg-base-300 rounded-box place-items-center h-screen-80 overflow-show-scroll p-5">
        <div className="w-full h-full flex flex-col justify-center items-center">
          <input
            type="text"
            placeholder="Set torque"
            className="input input-bordered w-full max-w-xs mb-5"
          />{' '}
          <input
            type="text"
            placeholder="Set speed"
            className="input input-bordered w-full max-w-xs mb-5"
          />
          <input
            type="text"
            placeholder="Maximum drown current"
            className="input input-bordered w-full max-w-xs mb-5"
          />
          <button className="btn btn-success w-full max-w-xs">
            Execute command!
          </button>
        </div>

        <div className="mockup-window border bg-base-200 w-full h-full">
          <div className="flex justify-center py-16 bg-base-100">
            Hello dear Scholar, this is the place you will see the sent and
            received bytes from the servo motor!
          </div>
        </div>
      </div>
    </>
  )
}
export default Main
