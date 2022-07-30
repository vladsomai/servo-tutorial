import Document, { Html, Head, Main, NextScript } from 'next/document'
import Modal from '../components/modal'

class MyDocument extends Document {
  static async getInitialProps(ctx: any) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <meta content="Tom's servo tutorial" name="Servo" />
          <meta charSet="utf-8" />
          <link rel="main icon" href="/favicon.ico" />
        </Head>
        <Modal {...{Description:"",Title:""}}/>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
