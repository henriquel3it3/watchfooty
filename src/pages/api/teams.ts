import type { NextApiRequest, NextApiResponse } from 'next';
import type { Team } from '@/types/team';

type TeamApiResponse = {
  team: {
    id: number;
    name: string;
    logo?: string; // logo pode ser undefined no retorno da API
  };
};

// Simple in-memory rate limiter
const RATE_LIMIT = 10; // Max de 10 requests por IP
const WINDOW_MS = 60 * 1000; // Janela de 1 minuto
const ipAccessMap = new Map<string, { count: number; timestamp: number }>();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const ip =
    req.headers['x-forwarded-for']?.toString().split(',')[0] ||
    req.socket.remoteAddress ||
    'unknown';
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

    const url = `https://v3.football.api-sports.io/teams?search=${encodeURIComponent(
      search
    )}`;

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

    // Mapeia usando o tipo Team e assegura image_path como string (fallback para '')
    const teams: Team[] = (json.response as TeamApiResponse[]).map((item) => ({
      id: item.team.id,
      name: item.team.name,
      image_path: item.team.logo ?? '',
    }));

    res.status(200).json(teams.slice(0, 5));
  } catch {
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
}
