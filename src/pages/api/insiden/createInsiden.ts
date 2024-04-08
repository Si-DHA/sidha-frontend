import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const backendUrl = 'http://localhost:8080/api/insiden/create';
      
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          // Add any necessary headers
        },
        body: req.body, // Assuming the body has the form data in the correct format
      });

      if (!response.ok) {
        const errorData = await response.json();
        res.status(response.status).json(errorData);
      } else {
        const data = await response.json();
        res.status(200).json(data);
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;

