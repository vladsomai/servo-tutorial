import '../styles/output.css'
import '../styles/prism-vsc-dark.css'
import type { AppProps } from 'next/app'
import { MutableRefObject, ReactElement, ReactNode, useState } from 'react'
import type { NextPage } from 'next'
import { createContext } from 'react'

export type GlobalStateType = {
  theme: {
    getTheme: string
    setTheme: Function
  }
  modal: {
    Show: 'modal-open' | 'modal-close'
    setShow: Function
    Title: string
    setTitle: Function
    Description: ReactNode
    setDescription: Function
  }

  alert: {
    Title: string
    setTitle: Function
    Description: ReactNode
    setDescription: Function
    Show: boolean
    setShow: Function
  }
  codeExamplePayload: {
    Bytes: string
    setBytes: Function
  }
}
const GlobalState: GlobalStateType = {
  theme: {
    getTheme: '',
    setTheme: () => {},
  },

  modal: {
    Show: 'modal-close',
    setShow: () => {},
    Title: '',
    setTitle: () => {},
    Description: <></>,
    setDescription: () => {},
  },

  alert: {
    Title: '',
    setTitle: () => {},
    Description: <></>,
    setDescription: () => {},
    Show: false,
    setShow: () => {},
  },

  codeExamplePayload: {
    Bytes: '',
    setBytes: Function,
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
  const [_modalShow, _setModalShow] = useState<'modal-open' | 'modal-close'>(
    'modal-close',
  )
  const [_modalTitle, _setModalTitle] = useState('')
  const [_modalDescription, _setModalDescription] = useState(<></>)
  const [_alertTitle, _setAlertTitle] = useState('')
  const [_alertDescription, _setAlertDescription] = useState(<></>)
  const [_alertShow, _setAlertShow] = useState(false)
  const [_bytes, _setBytes] = useState('')

  const GlobalState: GlobalStateType = {
    theme: {
      getTheme: _theme,
      setTheme: _setTheme,
    },
    modal: {
      Show: _modalShow,
      setShow: _setModalShow,
      Title: _modalTitle,
      setTitle: _setModalTitle,
      Description: _modalDescription,
      setDescription: _setModalDescription,
    },
    alert: {
      Title: _alertTitle,
      setTitle: _setAlertTitle,
      Description: _alertDescription,
      setDescription: _setAlertDescription,
      Show: _alertShow,
      setShow: _setAlertShow,
    },
    codeExamplePayload: { Bytes: _bytes, setBytes: _setBytes },
  }

  const getLayout = Component.getLayout ?? ((page) => page)
  const layout = getLayout(<Component {...pageProps} />)
  return (
    <GlobalContext.Provider value={GlobalState}>
      <>{layout}</>
    </GlobalContext.Provider>
  )
}
