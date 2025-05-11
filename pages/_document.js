import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
        <Head>
          {/* Bootstrap CDN */}
          <link
            rel="stylesheet"
            href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
            integrity="sha384-pzjw8f+ua7Kw1TIq0be7k6ldQFf5f6Pb13jO4KnFi5p6bflK7lnvZ5mrG7b3bZc7"
            crossorigin="anonymous"
          />
        </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
