import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx: any) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <meta
            content="Gearotons servo motor tutorial"
            name="application-name"
          />
          <meta name="author" content="https://svgdev.net"></meta>
          <meta
            name="keywords"
            content="servo motor, CNC, 3D printer motor, servo tutorial, Gearotons"
          ></meta>
          <meta
            name="description"
            content="This website will help you understand how to use a servo motor designed by Gearotons"
          ></meta>
          <meta charSet="utf-8" />
          <meta name="theme-color" content="dark"></meta>
          <link rel="logo icon" href="/Logo_icon.png" />
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
