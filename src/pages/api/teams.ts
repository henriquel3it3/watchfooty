import type { NextApiRequest, NextApiResponse } from 'next';

// Simple in-memory rate limiter
const RATE_LIMIT = 10; // Max of 10 requests for IP
const WINDOW_MS = 60 * 1000; // Window of 1 minute
const ipAccessMap = new Map<string, { count: number; timestamp: number }>();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Allow only GET method
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Limit rate by IP Address
  const ip = req.headers['x-forwarded-for']?.toString().split(',')[0] || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const ipData = ipAccessMap.get(ip);

  if (ipData && now - ipData.timestamp < WINDOW_MS) {
    if (ipData.count >= RATE_LIMIT) {
      return res.status(429).json({ error: 'Too Many Requests' });
    }
    ipData.count += 1;
    ipAccessMap.set(ip, ipData);
  } else {
    ipAccessMap.set(ip, { count: 1, timestamp: now });
  }

  try {
    let { search } = req.query;
    const apiKey = process.env.APISPORTS_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'API key não configurada' });
    }

    if (Array.isArray(search)) {
      search = search[0];
    }

    if (!search) {
      return res.status(400).json({ error: 'Parâmetro search é obrigatório' });
    }

    const url = `https://v3.football.api-sports.io/teams?search=${encodeURIComponent(search)}`;

    const response = await fetch(url, {
      headers: {
        'x-apisports-key': apiKey,
      },
    });

    const responseText = await response.text();

    if (!response.ok) {
      return res.status(response.status).json({
        error: 'Erro ao buscar equipas',
        details: responseText,
      });
    }

    const json = JSON.parse(responseText);

    if (!Array.isArray(json.response)) {
      return res.status(500).json({ error: 'Formato de resposta inválido da API' });
    }

    const teams = json.response.map((item: any) => ({
      id: item.team.id,
      name: item.team.name,
      image_path: item.team.logo,
    }));

    res.status(200).json(teams.slice(0, 5));
  } catch (error) {
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
}
