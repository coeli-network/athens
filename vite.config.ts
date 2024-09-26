import path from "path";
import pages from "@hono/vite-build/cloudflare-pages";
import devServer from "@hono/vite-dev-server";
import adapter from "@hono/vite-dev-server/cloudflare";
import { defineConfig, type UserConfig } from "vite";

export default defineConfig(({ mode }) => {
  const globalConfig: UserConfig = {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };

  if (mode === "bundle") {
    return {
      ...globalConfig,
      build: {
        rollupOptions: {
          input: ["./src/bundle.ts", "./src/index.css"],
          output: {
            entryFileNames: "static/bundle.js",
            assetFileNames: "static/[name].[ext]",
          },
        },
      },
    };
  } else {
    return {
      ...globalConfig,
      plugins: [
        pages(),
        devServer({
          adapter,
          entry: "src/index.tsx",
        }),
      ],
    };
  }
});
