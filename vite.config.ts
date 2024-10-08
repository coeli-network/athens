import path from "path";
import pages from "@hono/vite-build/cloudflare-pages";
import devServer from "@hono/vite-dev-server";
import adapter from "@hono/vite-dev-server/cloudflare";
import { defineConfig, type UserConfig } from "vite";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";
import rollupNodePolyFill from "rollup-plugin-node-polyfills";

export default defineConfig(({ mode }) => {
  const globalConfig: UserConfig = {
    base: "/",
    publicDir: "src/static",
    optimizeDeps: {
      esbuildOptions: {
        define: {
          global: "globalThis",
        },
        plugins: [
          NodeGlobalsPolyfillPlugin({
            process: true,
            buffer: true,
          }),
          NodeModulesPolyfillPlugin() as any,
        ],
      },
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        stream: "rollup-plugin-node-polyfills/polyfills/stream",
        util: "rollup-plugin-node-polyfills/polyfills/util",
        events: "rollup-plugin-node-polyfills/polyfills/events",
        "urbit-key-generation": path.resolve(
          __dirname,
          "src/shims/urbit-key-generation.js"
        ),
      },
    },
    build: {
      rollupOptions: {
        plugins: [rollupNodePolyFill],
      },
    },
  };

  if (mode === "bundle") {
    return {
      ...globalConfig,
      build: {
        ...globalConfig.build,
        rollupOptions: {
          ...globalConfig.build?.rollupOptions,
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
