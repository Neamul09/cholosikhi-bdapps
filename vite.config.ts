import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

function devGeminiApiPlugin(): Plugin {
  return {
    name: 'dev-gemini-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url?.startsWith('/api/gemini')) {
          if (req.method === 'OPTIONS') {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            res.statusCode = 204;
            res.end();
            return;
          }

          if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', async () => {
              try {
                const parsed = JSON.parse(body || '{}');
                const messages = parsed.messages || [];
                const systemPrompt = parsed.systemPrompt || '';

                const env = loadEnv('development', process.cwd(), '');
                const cfAccountId = env.CLOUDFLARE_ACCOUNT_ID || env.VITE_CLOUDFLARE_ACCOUNT_ID;
                const cfApiToken = env.CLOUDFLARE_API_TOKEN || env.VITE_CLOUDFLARE_API_TOKEN;

                let responseText: string | null = null;

                if (cfAccountId && cfApiToken) {
                  const formattedMessages: any[] = [];
                  if (systemPrompt) {
                    formattedMessages.push({ role: 'system', content: systemPrompt });
                  }
                  for (const msg of messages.slice(-6)) {
                    formattedMessages.push({
                      role: msg.role === 'user' ? 'user' : 'assistant',
                      content: msg.content
                    });
                  }

                  const models = [
                    '@cf/meta/llama-3.2-3b-instruct',
                    '@cf/meta/llama-3.2-1b-instruct',
                    '@cf/meta/llama-3.1-8b-instruct',
                  ];

                  for (const model of models) {
                    try {
                      const cfRes = await fetch(`https://api.cloudflare.com/client/v4/accounts/${cfAccountId}/ai/run/${model}`, {
                        method: 'POST',
                        headers: {
                          'Authorization': `Bearer ${cfApiToken}`,
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          messages: formattedMessages,
                          max_tokens: 500,
                        }),
                      });

                      if (cfRes.ok) {
                        const data = await cfRes.json() as any;
                        responseText = data.result?.response || data.result?.choices?.[0]?.message?.content || data.response;
                        if (responseText) break;
                      }
                    } catch (e) {
                      console.warn('[Vite Dev Gemini Plugin] Cloudflare model call failed:', e);
                    }
                  }
                }

                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Access-Control-Allow-Origin', '*');
                if (responseText) {
                  res.statusCode = 200;
                  res.end(JSON.stringify({ response: responseText }));
                } else {
                  res.statusCode = 200;
                  res.end(JSON.stringify({ 
                    response: null,
                    error: 'Dev AI gateway unavailable, use client fallback' 
                  }));
                }
              } catch (err) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ response: null, error: String(err) }));
              }
            });
            return;
          }
        }
        next();
      });
    }
  };
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    devGeminiApiPlugin(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/py'),
    },
  },
  server: {
    proxy: {
      '/api/bdapps': {
        target: 'https://bdappsdigitalapps.com/CholoSikhi',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api\/bdapps/, ''),
      },
    },
  },
});

