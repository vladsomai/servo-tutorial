import '../styles/output.css'
import type { AppProps } from 'next/app'
import { ReactElement, ReactNode, useState } from 'react'
import type { NextPage } from 'next'
import { useContext, createContext } from 'react'
import App from 'next/app'

export type GlobalStateType = {
  theme: {
    getTheme: string
    setTheme: Function
  }
  modal: {
    modalIsShown: boolean
    showModal: Function
  }
}

const GlobalState: GlobalStateType = {
  theme: {
    getTheme: '',
    setTheme: () => {},
  },
  modal: {
    modalIsShown: false,
    showModal: () => {},
  },
}
export const GlobalContext = createContext(GlobalState)

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {

  const [_theme, _setTheme] = useState('')
  const [_modalIsShown, _showModal] = useState(false)

  const GlobalState: GlobalStateType = {
    theme: {
      getTheme: _theme,
      setTheme: _setTheme,
    },
    modal: {
      modalIsShown: _modalIsShown,
      showModal: _showModal,
    },
  }

  const getLayout = Component.getLayout ?? ((page) => page)
  const layout = getLayout(<Component {...pageProps} />)
  return (
    <GlobalContext.Provider value={GlobalState}>
      <>{layout}</>
    </GlobalContext.Provider>
  )
}
