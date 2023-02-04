import Layout from '../components/layout'
import { ReactElement, useContext, useEffect, useRef, useState } from 'react'
import { GlobalContext, UserContext } from './_app'
import { firebaseAuth } from '../Firebase/initialize'
import {
  signInWithEmailAndPassword,
} from 'firebase/auth'
import { useRouter } from 'next/router'

export default function Signin() {
  const user = useContext(UserContext)
  const value = useContext(GlobalContext)
  const modalElem = useRef<HTMLElement | null>(null)

  const router = useRouter()

  useEffect(() => {
    modalElem.current = document.getElementById('my-modal-4')
  }, [])

  function login(e: any) {
    e.preventDefault()
    const email = e.target['email'].value
    const password = e.target['password'].value

    signInWithEmailAndPassword(firebaseAuth, email, password).catch((error) => {
      let errorMessage = ''

      if (error.message.includes('not-found')) {
        errorMessage = 'User not found!'
      } else if (error.message.includes('wrong-password')) {
        errorMessage = 'Wrong password!'
      }
      value.modal.setTitle('Error')
      value.modal.setDescription(
        <>
          <p>{errorMessage}</p>
        </>,
      )
      modalElem.current?.click()
    })
  }

  if (user == null)
    return (
      <>
        <div className="w-full h-full flex justify-center">
          <div className="flex items-center justify-around w-3/6 h-full">
            <div>
              <form className="flex flex-col" onSubmit={login}>
                <input
                  required={true}
                  type="email"
                  placeholder="Email"
                  name="email"
                  className="input input-bordered my-5"
                />
                <input
                  required={true}
                  name="password"
                  placeholder="Password"
                  type="password"
                  className="input input-bordered"
                />
                <button className="btn btn-primary mt-5" type="submit">
                  Log in
                </button>
              </form>
            </div>
          </div>
        </div>
      </>
    )
  else router.push('/view/feedback')
}

Signin.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}
