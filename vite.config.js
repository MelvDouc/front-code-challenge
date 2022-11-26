import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  esbuild: {
    jsxFactory: "h",
    jsxFragment: "",
    jsxInject: "import {h} from 'reactfree-jsx'",
  },
  resolve: {
    alias: {
      src: resolve("src")
    }
  }
});