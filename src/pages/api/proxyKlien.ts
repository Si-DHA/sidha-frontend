// pages/api/proxyKlien.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { BASE_URL } from '@/app/constant/constant';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const backendResponse = await fetch(BASE_URL + `/user/klien`);
    const data = await backendResponse.json();

    if (!backendResponse.ok) {
      throw new Error(data.message || 'Failed to fetch from backend');
    }

    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'An unexpected error occurred' });
  }
}
