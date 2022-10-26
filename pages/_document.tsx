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
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Mukta&family=Open+Sans&display=swap"
            rel="stylesheet"
          ></link>

        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
