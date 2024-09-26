import { jsxRenderer } from "hono/jsx-renderer";

export const renderer = jsxRenderer(({ children, title }) => {
  return (
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <meta name="description" content="Athens" />
        <meta name="color-scheme" content="light dark" />
        {import.meta.env.PROD ? (
          <>
            <link href="/static/index.css" rel="stylesheet" />
            <script defer type="module" src="/static/bundle.js"></script>
          </>
        ) : (
          <>
            <link href="/src/index.css" rel="stylesheet" />
            <script defer type="module" src="/src/bundle.ts"></script>
          </>
        )}
        <title>{title}</title>
      </head>
      <body>{children}</body>
    </html>
  );
});
