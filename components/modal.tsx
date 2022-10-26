import { useEffect, useState } from 'react'
import { useContext } from 'react'
import { GlobalContext } from '../pages/_app'

export type ModalPropertiesType = {}

const Modal = (props: ModalPropertiesType) => {
  const value = useContext(GlobalContext)
  useEffect(() => {
  })

  return (
    <>
      <input type="checkbox" id="my-modal-4" className="modal-toggle" />
      <label htmlFor="my-modal-4" className="modal">
        <label className="modal-box w-[50vw] max-w-full relative" htmlFor="">
          <label
            htmlFor="my-modal-4"
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>
          <h1 className="text-2xl tracking-widest font-bold">{value.modal.Title}</h1>
          <p className="py-4">{value.modal.Description}</p>
        </label>
      </label>
    </>
  )
}
export default Modal
