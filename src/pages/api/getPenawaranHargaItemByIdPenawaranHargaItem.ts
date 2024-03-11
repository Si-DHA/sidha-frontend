import type { NextApiRequest, NextApiResponse } from 'next';
import { BASE_URL } from '@/app/constant/constant';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { idPenawaranHargaItem } = req.query;
    if (req.method === 'GET' && idPenawaranHargaItem) {
        try {
            const backendUrl = BASE_URL + `/penawaran-harga-item/${idPenawaranHargaItem}`;
            
            // Forward the request to the backend, including the JSON body
            const backendRes = await fetch(backendUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // Check if the backend response is OK (status code in the range 200-299)
            if (!backendRes.ok) {
                const errorData = await backendRes.json();
                return res.status(backendRes.status).json(errorData);
            }

            // If everything went fine, send the backend response to the frontend
            const data = await backendRes.json();
            return res.status(200).json(data);
        } catch (error: any) {
            // Handle any errors that occurred during the fetch operation
            return res.status(500).json({ message: error.message || 'An unexpected error occurred' });
        }
    } else {
        // If the request used a method other than POST, return a 405 Method Not Allowed status
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
