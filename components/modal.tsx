import { useContext } from 'react'
import { GlobalContext } from '../pages/_app'

const Modal = () => {
  const globalContext = useContext(GlobalContext)

  return (
    <>
      <input type="checkbox" id="my-modal-4" className="modal-toggle" />
      <label htmlFor="my-modal-4" className={`modal`}>
        <label
          className="modal-box w-auto md:max-w-[60vw] pt-10 relative mx-3"
          htmlFor=""
        >
          <label
            htmlFor="my-modal-4"
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>
          <h1 className="text-2xl tracking-widest font-bold">
            {globalContext.modal.Title}
          </h1>
          <div className="py-4">{globalContext.modal.Description}</div>
        </label>
      </label>
    </>
  )
}
export default Modal
