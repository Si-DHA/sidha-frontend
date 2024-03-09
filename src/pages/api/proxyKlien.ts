// pages/api/proxyKlien.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const backendResponse = await fetch('http://localhost:8080/api/user/klien');
    const data = await backendResponse.json();

    if (!backendResponse.ok) {
      throw new Error(data.message || 'Failed to fetch from backend');
    }

    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'An unexpected error occurred' });
  }
}
