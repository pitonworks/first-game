import { defineConfig } from 'vite';

export default defineConfig({
    server: {
        headers: {
            'Content-Type': 'application/javascript'
        }
    },
    build: {
        rollupOptions: {
            output: {
                format: 'es'
            }
        }
    }
}); 