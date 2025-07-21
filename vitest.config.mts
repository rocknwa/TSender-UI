import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    plugins: [tsconfigPaths()],
    test: {
        environment: 'jsdom',
        exclude: ['**/node_modules/**', '**/test/**', 'playwright-report/**', 'test-results/**'],
        server: {
            deps: {
                inline: ['wagmi', '@wagmi/core', 'viem'], // Updated to server.deps.inline and added viem
            },
        },
    },
});