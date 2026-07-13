import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const siteUrl = (env.VITE_SITE_URL || 'https://agencydesk.ai').replace(/\/$/, '')
  const ogImage = `${siteUrl}/og-image.png`
  const xHandle = (env.VITE_X_HANDLE || '').replace(/^@/, '')

  return {
    plugins: [
      react(),
      {
        name: 'inject-site-meta',
        transformIndexHtml(html) {
          let out = html
            .replaceAll('__SITE_URL__', siteUrl)
            .replaceAll('__OG_IMAGE__', ogImage)
          if (xHandle) {
            out = out.replace(
              '</head>',
              `    <meta name="twitter:site" content="@${xHandle}" />\n  </head>`,
            )
          }
          return out
        },
      },
    ],
    optimizeDeps: {
      include: ['remotion', '@remotion/player'],
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('remotion') || id.includes('@remotion')) {
              return 'remotion'
            }
          },
        },
      },
    },
  }
})
