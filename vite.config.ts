import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { CodeInspectorPlugin } from "@rdservices/aime-code-inspector";
import WebSpatial from "@webspatial/vite-plugin";

// https://vite.dev/config/
//
// This is a GENUINE WebSpatial build. The @webspatial/vite-plugin wires up the
// compile-time JSX transform (via @webspatial/react-sdk's jsx-runtime), the
// XR_ENV define vars, the react-sdk web/default alias and the base-path / output
// handling for the spatial (avp) variant.
//
//   - `vite build`            -> web/flat variant at base "/"   -> dist/
//   - `XR_ENV=avp vite build` -> spatial variant  base "/webspatial/avp/" -> dist/webspatial/avp/
export default defineConfig({
  plugins: [
    // jsxImportSource makes @vitejs/plugin-react emit the WebSpatial JSX runtime
    // so `enable-xr` markers, spatial events and --xr-* CSS vars are compiled.
    react({ jsxImportSource: "@webspatial/react-sdk" }),
    WebSpatial(),
    // IMPORTANT: DO NOT REMOVE THIS!
    CodeInspectorPlugin({
      bundler: "vite",
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
