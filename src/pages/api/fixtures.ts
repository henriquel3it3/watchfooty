import type { NextApiRequest, NextApiResponse } from 'next';
import { getFromCache, setToCache } from '@/lib/cache';

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
    const { teamId } = req.query;
    const apiKey = process.env.APISPORTS_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'API key invalid.' });
    }

    if (!teamId || Array.isArray(teamId)) {
      return res.status(400).json({ error: 'Parameter TeamId invalid.' });
    }

    const from = '2023-01-01';
    const to = '2023-02-01';
    const season = '2022';

    const cacheKey = `fixtures:${teamId}:${season}:${from}:${to}`;
    const cachedData = getFromCache(cacheKey);
    if (cachedData) {
      return res.status(200).json(cachedData);
    }

    const url = `https://v3.football.api-sports.io/fixtures?team=${teamId}&season=${season}&from=${from}&to=${to}`;

    const response = await fetch(url, {
      headers: {
        'x-apisports-key': apiKey,
      },
    });

    const responseText = await response.text();

    if (!response.ok) {
      return res.status(response.status).json({
        error: 'Error loading the results!',
        details: responseText,
      });
    }

    const json = JSON.parse(responseText);

    const fixtures = json.response.map((item: any) => {
      const fixture = item.fixture;
      const teams = item.teams;
      const venue = fixture.venue;

      return {
        id: fixture.id,
        starting_at: fixture.date,
        venue: {
          name: venue.name,
          city: venue.city,
        },
        participants: [
          {
            name: teams.home.name,
            meta: { location: 'home' },
          },
          {
            name: teams.away.name,
            meta: { location: 'away' },
          },
        ],
        tvstations: [],
      };
    });

    const limitedFixtures = fixtures.slice(0, 3);

    setToCache(cacheKey, limitedFixtures, 60 * 60 * 1000); // 1h

    res.status(200).json(limitedFixtures);
  } catch (error) {
    res.status(500).json({ error: 'Server internal error.' });
  }
}
