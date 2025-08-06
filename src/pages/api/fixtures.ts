import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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

    const url = `https://v3.football.api-sports.io/fixtures?team=${teamId}&season=${season}&from=${from}&to=${to}`;

    const response = await fetch(url, {
      headers: {
        'x-apisports-key': apiKey,
      },
    });

    const responseText = await response.text();

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Error loading the results!', details: responseText });
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

    res.status(200).json(limitedFixtures);
  } catch (error) {
    res.status(500).json({ error: 'Server internal error.' });
  }
}
