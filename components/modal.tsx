import { useContext } from 'react'
import { GlobalContext } from '../pages/_app'

const Modal = () => {
  const value = useContext(GlobalContext)

  return (
    <>
      <input type="checkbox" id="my-modal-4" className="modal-toggle" />
      <label htmlFor="my-modal-4" className={`modal`}>
        <label
          className="modal-box w-auto max-w-[60vw] pt-10 relative"
          htmlFor=""
        >
          <label
            htmlFor="my-modal-4"
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>
          <h1 className="text-2xl tracking-widest font-bold">
            {value.modal.Title}
          </h1>
          <div className="py-4">{value.modal.Description}</div>
        </label>
      </label>
    </>
  )
}
export default Modal
