import { defineConfig } from 'vite';

export default defineConfig({
    base: '/',
    server: {
        port: 5173,
        host: true
    },
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        rollupOptions: {
            input: {
                main: './index.html'
            }
        }
    }
}); 