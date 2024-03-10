// api/viewAllPenawaranHargaitem.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { idPenawaranHarga } = req.query; // Extracting idPenawaranHarga from the query

  if (req.method === 'GET' && idPenawaranHarga) {
    try {
      const endpoint = `http://localhost:8080/api/penawaran-harga-item/${idPenawaranHarga}/view-all`;

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return res.status(response.status).json({ message: errorData.message || 'Failed to get Penawaran Harga' });
      }

      const data = await response.json();
      return res.status(200).json(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return res.status(500).json({ message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
