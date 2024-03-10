import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const backendUrl = 'http://localhost:8080/api/penawaran-harga/create';
            
            // Forward the request to the backend, including the JSON body
            const backendRes = await fetch(backendUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(req.body),
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
