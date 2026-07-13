import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(express.json());

// API: list files in the public/gallery directory
app.get('/api/gallery', (req, res) => {
  try {
    const galleryDir = path.join(process.cwd(), 'public', 'gallery');
    if (fs.existsSync(galleryDir)) {
      const files = fs.readdirSync(galleryDir)
        .filter(file => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file));
      const filePaths = files.map(file => `/gallery/${file}`);
      res.json(filePaths);
    } else {
      res.json([]);
    }
  } catch (err) {
    console.error('Error reading gallery folder:', err);
    res.status(500).json({ error: 'Failed to read gallery' });
  }
});

// Vite Integration
if (process.env.NODE_ENV !== 'production') {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom'
  });
  app.use(vite.middlewares);
  app.use('*', async (req, res, next) => {
    const url = req.originalUrl;
    try {
      let template = await vite.transformIndexHtml(url, `
        <!doctype html>
        <html lang="ru">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Dancela — Студия спортивно-бальных танцев | Астана</title>
          </head>
          <body class="bg-black text-slate-100">
            <div id="root"></div>
            <script type="module" src="/src/main.tsx"></script>
          </body>
        </html>
      `);
      res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
} else {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on port ${port}`);
});
