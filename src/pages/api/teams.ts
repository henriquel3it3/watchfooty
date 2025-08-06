import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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
