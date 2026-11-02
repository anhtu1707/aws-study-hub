import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';

const ttsProxyPlugin = (): Plugin => ({
  name: 'tts-proxy-middleware',
  configureServer(server) {
    server.middlewares.use('/api/tts', async (req, res) => {
      try {
        const reqUrl = new URL(req.url || '', 'http://localhost:3000');
        const q = reqUrl.searchParams.get('q');
        if (!q) {
          res.statusCode = 400;
          res.end('Missing text query parameter');
          return;
        }

        const googleUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=vi&q=${encodeURIComponent(q)}`;
        const upstream = await fetch(googleUrl, {
          headers: {
            'Referer': 'https://translate.google.com/',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
          }
        });

        if (!upstream.ok) {
          res.statusCode = upstream.status;
          res.end();
          return;
        }

        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Cache-Control', 'public, max-age=86400');
        const buf = await upstream.arrayBuffer();
        res.end(Buffer.from(buf));
      } catch (err) {
        res.statusCode = 500;
        res.end('TTS Proxy Error');
      }
    });
  }
});

export default defineConfig({
  base: './',
  plugins: [react(), ttsProxyPlugin()],
  server: {
    port: 3000
  }
});
