import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";
import { dependencies } from "./package.json";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";

export default defineConfig({
  plugins: [
    federation({
      name: "ucp",
      filename: "remoteEntry.js",
      exposes: {
        "./App": "./src/App.tsx",
      },
      shared: {
        react: { singleton: true, requiredVersion: dependencies.react },
        "react-dom": {
          singleton: true,
          requiredVersion: dependencies["react-dom"],
        },
        "react-router-dom": {
          singleton: true,
          requiredVersion: dependencies["react-router-dom"],
        },
        "@tanstack/react-router": {
          singleton: true,
          requiredVersion: dependencies["@tanstack/react-router"],
        },
        "@tanstack/react-query": {
          singleton: true,
          requiredVersion: dependencies["@tanstack/react-query"],
        },
      },
    }),
    react(),
    // react({ reactRefreshHost: "http://localhost:5173" }),
    tailwindcss(),
    TanStackRouterVite(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: { port: 5174 },
  build: { target: "chrome89" },
});
