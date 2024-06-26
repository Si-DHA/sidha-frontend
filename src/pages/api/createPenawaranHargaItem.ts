import type { NextApiRequest, NextApiResponse } from 'next';
import { BASE_URL } from '@/app/constant/constant';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const response = await fetch(BASE_URL+'/penawaran-harga-item/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(req.body),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Failed to create Penawaran Harga Item`);
            }

            const data = await response.json();
            res.status(200).json(data);
        } catch (error: any) {
            res.status(500).json({ message: error.message || 'An unexpected error occurred' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
