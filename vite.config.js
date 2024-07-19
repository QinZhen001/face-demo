import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import { name } from "./package.json"

const genBaseUrl = (mode) => {
  if (mode !== "development") {
    return `/${name}/`
  }
  return "/"
}

// https://vitejs.dev/config/
export default defineConfig({
  base: genBaseUrl(mode),
  plugins: [react()],
})
