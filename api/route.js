/**
 * Vercel serverless proxy for Yandex Router API (avoids CORB/CORS when called from the browser).
 * Set env var YANDEX_API_KEY in Vercel to your Yandex API key.
 * GET /api/route?waypoints=55.752,37.6175|59.9386,30.3141&mode=driving
 */
module.exports = async (req, res) => {
  // Allow frontend origin (GH Pages, localhost, or any)
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(204).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ errors: ["Method not allowed"] });
  }

  const waypoints = req.query.waypoints;
  const apikey = process.env.YANDEX_API_KEY;

  if (!apikey) {
    return res.status(500).json({ errors: ["YANDEX_API_KEY is not set on the server"] });
  }
  if (!waypoints || typeof waypoints !== "string") {
    return res.status(400).json({ errors: ["Missing or invalid query: waypoints (lat1,lon1|lat2,lon2)"] });
  }

  const mode = (req.query.mode === "walking" || req.query.mode === "driving") ? req.query.mode : "driving";
  const url = `https://api.routing.yandex.net/v2/route?waypoints=${encodeURIComponent(waypoints)}&mode=${mode}&apikey=${apikey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.status(response.ok ? 200 : response.status).json(data);
  } catch (e) {
    res.status(502).json({ errors: [String(e.message || e)] });
  }
};
