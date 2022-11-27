import '../styles/output.css'
import type { AppProps } from 'next/app'
import { ReactElement, ReactNode, useState } from 'react'
import type { NextPage } from 'next'
import { createContext } from 'react'

export type GlobalStateType = {
  theme: {
    getTheme: string
    setTheme: Function
  }
  modal: {
    Title: string
    setTitle: Function
    Description: ReactNode
    setDescription: Function
  }
}

const GlobalState: GlobalStateType = {
  theme: {
    getTheme: '',
    setTheme: () => {},
  },
  modal: {
    Title: '',
    setTitle: () => {},
    Description: <></>,
    setDescription: () => {},
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
  const [_modalTitle, _setModalTitle] = useState('')
  const [_modalDescription, _setModalDescription] = useState(<></>)

  const GlobalState: GlobalStateType = {
    theme: {
      getTheme: _theme,
      setTheme: _setTheme,
    },
    modal: {
      Title: _modalTitle,
      setTitle: _setModalTitle,
      Description: _modalDescription,
      setDescription: _setModalDescription,
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
